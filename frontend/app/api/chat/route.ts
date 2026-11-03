import { serviceCategories } from "@/data/service-categories";
import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt, demoReply } from "@/lib/server/chat/knowledge";
import { clientKeyFromHeaders, createRateLimiter } from "@/lib/server/rate-limit";
import { chatRequestSchema, type ChatMessage } from "@/lib/validation/chat";

/**
 * POST /api/chat, website assistant.
 *
 * Response: newline-delimited JSON (NDJSON) events
 *   {"type":"text","text":"…"}   incremental assistant text
 *   {"type":"error","message":"…"} terminal, user-safe error
 *   {"type":"done","mode":"ai"|"demo"}
 *
 * Secrets stay on the server: ANTHROPIC_API_KEY is read here only. Without a
 * key the route answers from site content (demo mode) so the widget still works.
 */

const MAX_BODY_BYTES = 32_000;
const MODEL = process.env.AI_MODEL ?? "claude-opus-5-5";
// Public endpoint: cap per-reply spend. Raise via AI_MAX_TOKENS if answers truncate.
const MAX_TOKENS = Number(process.env.AI_MAX_TOKENS ?? 2048);

/** 20 messages per 5 minutes per client. */
const limiter = createRateLimiter({ limit: 20, windowMs: 5 * 60 * 1000 });

const SYSTEM_PROMPT = buildSystemPrompt();

let anthropic: Anthropic | null = null;
function getClient() {
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) return null;
  anthropic ??= new Anthropic();
  return anthropic;
}

const encoder = new TextEncoder();
const line = (event: Record<string, unknown>) => encoder.encode(`${JSON.stringify(event)}\n`);

function jsonError(status: number, message: string, headers?: HeadersInit) {
  return Response.json({ error: message }, { status, headers });
}

export async function POST(request: Request) {
  // Same-origin only: block cross-site use of our AI quota.
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return jsonError(403, "Forbidden");
    } catch {
      return jsonError(403, "Forbidden");
    }
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonError(415, "Expected application/json");
  }

  const rate = limiter(clientKeyFromHeaders(request.headers));
  if (!rate.allowed) {
    return jsonError(429, "You're sending messages too quickly. Please wait a moment.", {
      "Retry-After": String(rate.retryAfterSeconds),
    });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return jsonError(413, "Message too long");

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return jsonError(400, "Invalid JSON");
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "Invalid chat request");

  const messages = normaliseHistory(parsed.data.messages);
  if (!messages) return jsonError(400, "The last message must come from the user");

  const category = serviceCategories.find((c) => c.id === parsed.data.category);
  const context = category ? `\nThe visitor is exploring ${category.name}. Prioritise only services in this category unless they explicitly ask to change. Relevant services: ${category.items.join("; ")}. Category page: /services/${category.id}. Service selection: /build-your-proposal?category=${category.id}.` : "";
  const client = getClient();
  const stream = client
    ? aiStream(client, messages, request.signal, context)
    : demoStream(messages[messages.length - 1].content, category?.id);

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

/** Drop leading assistant turns (e.g. the greeting) and require a final user turn. */
function normaliseHistory(messages: ChatMessage[]) {
  const firstUser = messages.findIndex((m) => m.role === "user");
  if (firstUser === -1) return null;
  const trimmed = messages.slice(firstUser);
  return trimmed[trimmed.length - 1].role === "user" ? trimmed : null;
}

function aiStream(client: Anthropic, messages: ChatMessage[], signal: AbortSignal, context: string) {
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      let sentText = false;
      try {
        const stream = client.beta.messages.stream(
          {
            model: MODEL,
            max_tokens: MAX_TOKENS,
            // Refusals are retried server-side on Anthropic's recommended fallback model.
            betas: ["server-side-fallback-2026-07-01"],
            fallbacks: "default",
            // Conversational route: low effort keeps replies fast and inexpensive.
            output_config: { effort: "low" },
            system: [
              { type: "text", text: SYSTEM_PROMPT + context, cache_control: { type: "ephemeral" } },
            ],
            messages,
          },
          { signal },
        );

        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            sentText = true;
            controller.enqueue(line({ type: "text", text: event.delta.text }));
          }
        }

        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal" && !sentText) {
          controller.enqueue(
            line({
              type: "text",
              text: "I can't help with that here, but our team is happy to talk through your project. Use the contact form below.",
            }),
          );
        }
        controller.enqueue(line({ type: "done", mode: "ai" }));
      } catch (error) {
        if (signal.aborted) {
          controller.close();
          return;
        }
        controller.enqueue(line({ type: "error", message: describeError(error) }));
      }
      controller.close();
    },
  });
}

function describeError(error: unknown) {
  if (error instanceof Anthropic.RateLimitError) {
    return "The assistant is busy right now. Please try again in a moment.";
  }
  if (error instanceof Anthropic.AuthenticationError || error instanceof Anthropic.PermissionDeniedError) {
    console.error("[chat] AI provider authentication failed. Check ANTHROPIC_API_KEY.");
    return "The assistant is temporarily unavailable. Please use the contact form.";
  }
  if (error instanceof Anthropic.BadRequestError) {
    console.error("[chat] Bad request:", error.message);
    return "I couldn't process that message. Please try rephrasing it.";
  }
  if (error instanceof Anthropic.APIError) {
    console.error(`[chat] API error ${error.status}:`, error.message);
    return "The assistant is temporarily unavailable. Please try again shortly.";
  }
  console.error("[chat] Unexpected error:", error);
  return "Something went wrong. Please try again.";
}

/** Streams a canned answer in small chunks so the UI behaves like the real thing. */
function demoStream(question: string, category?: string) {
  const reply = demoReply(question, category);
  const chunks = reply.match(/\S+\s*/g) ?? [reply];
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      await sleep(450);
      for (const chunk of chunks) {
        controller.enqueue(line({ type: "text", text: chunk }));
        await sleep(18 + Math.random() * 30);
      }
      controller.enqueue(line({ type: "done", mode: "demo" }));
      controller.close();
    },
  });
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
