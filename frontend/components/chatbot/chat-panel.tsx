"use client";

/**
 * AI chat window (Client Component, lazy-loaded on first open).
 * Why client: conversation state, streaming network reads, keyboard and
 * focus handling. All AI calls go to /api/chat, no keys ever reach the browser.
 */
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AssistantMascot, type AssistantMood } from "./assistant-mascot";
import { serviceCategories } from "@/data/service-categories";
import { SERVICES } from "@/data/services-catalog";
import { VoiceControls } from "./voice-controls";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { MotionProvider } from "@/components/providers/motion-provider";
import { ArrowUp, RotateCcw, Sparkles, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { CHAT_LIMITS, type ChatMessage } from "@/lib/validation/chat";
import { cn } from "@/lib/utils";
import { ChatMarkdown } from "./chat-markdown";

type UiMessage = ChatMessage & { id: string; error?: boolean };

const STORAGE_KEY = "chat:v2";
const SUGGESTIONS = [
  "What services do you offer?",
  "Can you automate my business?",
  "I need a custom application.",
  "How much does a project cost?",
  "I want to discuss my idea.",
];

const greeting = (): UiMessage => ({
  id: "greeting",
  role: "assistant",
  content: `Hi! I'm Sunrise Assistant, the ${siteConfig.name} AI assistant. Ask me about our web development, digital growth, how we work, or tell me about your project!`,
});

let counter = 0;
const uid = () => `${Date.now().toString(36)}-${(counter++).toString(36)}`;

function loadMessages(): UiMessage[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as UiMessage[];
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {
    /* storage unavailable */
  }
  return [greeting()];
}

export default function ChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<UiMessage[]>(loadMessages);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "waiting" | "streaming">("idle");
  const [demoMode, setDemoMode] = useState(false);
  const [voiceMood, setVoiceMood] = useState<AssistantMood>("idle");
  const abortRef = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const busy = status !== "idle";

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.filter((m) => !m.error)));
    } catch {
      /* storage unavailable */
    }
  }, [messages]);

  // Keep the newest message in view.
  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTo({ top: list.scrollHeight, behavior: status === "streaming" ? "auto" : "smooth" });
  }, [messages, status]);

  // Focus the composer on open. A reply in progress keeps streaming while the
  // panel is closed, so reopening never shows a truncated answer.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  // Escape closes the chat even when focus has left the panel (e.g. after a
  // suggestion chip unmounts), unless another dialog is handling it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && !e.defaultPrevented && !document.querySelector('[role="dialog"][aria-modal="true"]')) {
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const send = useCallback(
    async (text: string, base: UiMessage[] = messages) => {
      const content = text.trim().slice(0, CHAT_LIMITS.maxMessageLength);
      if (!content || busy) return;

      const userMessage: UiMessage = { id: uid(), role: "user", content };
      const history = [...base.filter((m) => !m.error), userMessage];
      const assistantId = uid();
      setMessages([...history]);
      setInput("");
      setStatus("waiting");

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const url = new URL(window.location.href);
        const service = SERVICES.find((s) => s.id === url.searchParams.get("service"));
        const candidate = url.pathname.startsWith("/services/") ? url.pathname.split("/")[2] : url.searchParams.get("category") ?? service?.category;
        const category = serviceCategories.find((c) => c.id === candidate)?.id;
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category,
            messages: history
              .slice(-CHAT_LIMITS.maxMessages)
              .map(({ role, content: c }) => ({ role, content: c })),
          }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          const data = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(data?.error ?? "The assistant is unavailable right now.");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let reply = "";

        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.trim()) continue;
            const event = JSON.parse(line) as
              | { type: "text"; text: string }
              | { type: "error"; message: string }
              | { type: "done"; mode: "ai" | "demo" };
            if (event.type === "text") {
              reply += event.text;
              setStatus("streaming");
              setMessages([...history, { id: assistantId, role: "assistant", content: reply }]);
            } else if (event.type === "error") {
              throw new Error(event.message);
            } else if (event.type === "done") {
              setDemoMode(event.mode === "demo");
            }
          }
        }
        if (!reply) throw new Error("No response received. Please try again.");
      } catch (error) {
        if (controller.signal.aborted) return;
        setMessages((current) => [
          ...current.filter((m) => m.id !== assistantId),
          {
            id: uid(),
            role: "assistant",
            content: error instanceof Error ? error.message : "Something went wrong.",
            error: true,
          },
        ]);
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
        setStatus("idle");
      }
    },
    [busy, messages],
  );

  const retry = () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    void send(lastUser.content, messages.slice(0, messages.lastIndexOf(lastUser)));
  };

  const clear = () => {
    abortRef.current?.abort();
    setStatus("idle");
    setMessages([greeting()]);
    inputRef.current?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void send(input);
    }
  };

  const showSuggestions = messages.length === 1 && !busy;
  const lastIsError = messages[messages.length - 1]?.error;

  return (
    <MotionProvider>
      <AnimatePresence>
        {open ? (
          <m.div
            key="chat"
            role="dialog"
            aria-modal="false"
            aria-labelledby="chat-title"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-[max(0.5rem,env(safe-area-inset-right))] bottom-[max(0.5rem,env(safe-area-inset-bottom))] left-[max(0.5rem,env(safe-area-inset-left))] z-65 flex h-[min(85dvh,40rem)] origin-bottom-right flex-col overflow-hidden rounded-xl border border-line-strong bg-surface shadow-lg sm:right-6 sm:bottom-24 sm:left-auto sm:w-[25rem]"
          >
            {/* Header */}
            <div className="theme-deep relative flex items-center gap-3 px-4 py-4">
              <div aria-hidden className="horizon-line bottom-0" />
              <span className="relative grid size-10 place-items-center rounded-full border border-line-strong bg-surface">
                <AssistantMascot mood={busy ? "thinking" : voiceMood} className="size-12" />
                <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-surface bg-success" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id="chat-title" className="font-sans text-sm font-semibold tracking-normal text-text">
                  Sunrise Assistant
                </h2>
                <p className="truncate text-xs text-text-muted">Ask us about your project.</p>
              </div>
              <button
                type="button"
                onClick={clear}
                className="grid size-9 place-items-center rounded-full text-text-muted transition-colors hover:bg-tint/6 hover:text-text"
                aria-label="Clear conversation"
                title="Clear conversation"
              >
                <RotateCcw className="size-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="grid size-9 place-items-center rounded-full text-text-muted transition-colors hover:bg-tint/6 hover:text-text"
                aria-label="Close chat"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={listRef}
              role="log"
              aria-live="polite"
              aria-relevant="additions"
              aria-label="Conversation"
              tabIndex={0}
              className="thin-scrollbar flex-1 space-y-4 overflow-y-auto px-4 py-5"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex animate-in duration-300 fade-in-0 slide-in-from-bottom-1",
                    message.role === "user" ? "justify-end" : "justify-start gap-2.5",
                  )}
                >
                  {message.role === "assistant" ? (
                    <span aria-hidden className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-line bg-bg">
                      <Sparkles className="size-3.5 text-accent" />
                    </span>
                  ) : null}
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                      message.role === "user"
                        ? "rounded-br-md bg-primary text-on-primary"
                        : message.error
                          ? "rounded-bl-md border border-danger/25 bg-danger/5 text-danger"
                          : "rounded-bl-md border border-line bg-bg text-text",
                    )}
                  >
                    <span className="sr-only">{message.role === "user" ? "You: " : "Assistant: "}</span>
                    {message.role === "assistant" && !message.error ? (
                      <ChatMarkdown text={message.content} />
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {status === "waiting" ? (
                <div className="flex items-center gap-2.5" aria-label="Assistant is typing">
                  <span aria-hidden className="grid size-7 place-items-center rounded-full border border-line bg-bg">
                    <Sparkles className="size-3.5 text-accent" />
                  </span>
                  <span className="flex gap-1 rounded-2xl rounded-bl-md border border-line bg-bg px-3.5 py-3.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="size-1.5 animate-bounce rounded-full bg-text-muted"
                        style={{ animationDelay: `${i * 140}ms`, animationDuration: "1s" }}
                      />
                    ))}
                  </span>
                </div>
              ) : null}

              {lastIsError && !busy ? (
                <div className="flex justify-start pl-9">
                  <button
                    type="button"
                    onClick={retry}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-line-strong hover:text-text"
                  >
                    <RotateCcw className="size-3" /> Try again
                  </button>
                </div>
              ) : null}

              {showSuggestions ? (
                <div className="pt-1">
                  <p className="mb-2 pl-9 text-xs text-subtle">Suggested questions</p>
                  <ul className="flex flex-wrap gap-2 pl-9">
                    {SUGGESTIONS.map((s) => (
                      <li key={s}>
                        <button
                          type="button"
                          onClick={() => {
                            void send(s);
                            inputRef.current?.focus();
                          }}
                          className="min-h-8 rounded-full border border-line-strong bg-surface px-3 py-1.5 text-left text-xs text-text-muted transition-colors hover:border-text/40 hover:text-text"
                        >
                          {s}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
              className="border-t border-line p-3"
            >
              <VoiceControls open={open} busy={busy} reply={[...messages].reverse().find((m) => m.role === "assistant")} onMoodChange={setVoiceMood} onTranscript={(text) => { void send(text.slice(0, CHAT_LIMITS.maxMessageLength)); }} />
              <div className="flex items-end gap-2 rounded-2xl border border-line-input bg-surface p-1.5 pl-3.5 transition-[border-color,box-shadow] focus-within:border-focus focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--focus)_22%,transparent)]">
                <label htmlFor="chat-input" className="sr-only">
                  Message the AI assistant
                </label>
                <textarea
                  id="chat-input"
                  ref={inputRef}
                  rows={1}
                  value={input}
                  maxLength={CHAT_LIMITS.maxMessageLength}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                  }}
                  onKeyDown={onKeyDown}
                  placeholder="Type your message…"
                  className="thin-scrollbar max-h-[120px] min-h-9 flex-1 resize-none bg-transparent py-2 text-base text-text placeholder:text-subtle focus:outline-none sm:text-sm focus-visible:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || busy}
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-on-primary transition-[opacity,background-color] hover:bg-(--primary-fill-hover) disabled:opacity-35"
                  aria-label="Send message"
                >
                  <ArrowUp className="size-4" />
                </button>
              </div>
              <p className="mt-2 px-1 text-center text-[0.6875rem] text-subtle">
                {demoMode ? "Site guide: answers from our published services. Contact our team for project specifics." : "AI can make mistakes. For project specifics, contact our team."}
              </p>
            </form>
          </m.div>
        ) : null}
      </AnimatePresence>
    </MotionProvider>
  );
}
