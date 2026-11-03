import * as z from "zod/mini";

/** Limits shared by the chat widget and the /api/chat route. */
export const CHAT_LIMITS = {
  maxMessages: 16,
  maxMessageLength: 1500,
} as const;

export const chatRequestSchema = z.object({
  category: z.optional(z.string().check(z.maxLength(80))),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z
          .string()
          .check(z.minLength(1), z.maxLength(CHAT_LIMITS.maxMessageLength)),
      }),
    )
    .check(z.minLength(1), z.maxLength(CHAT_LIMITS.maxMessages)),
});

export type ChatMessage = z.infer<typeof chatRequestSchema>["messages"][number];
