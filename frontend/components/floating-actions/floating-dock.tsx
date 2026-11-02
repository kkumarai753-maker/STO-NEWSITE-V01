"use client";

/**
 * Floating action system (Client Component).
 * One coherent dock instead of scattered widgets: AI chat (primary),
 * WhatsApp, call, email and back-to-top.
 *  - Desktop: call/email expand on hover or keyboard focus.
 *  - Mobile: compact (chat, WhatsApp, back-to-top only).
 * Why client: scroll position, hover/expand state and chat open state.
 * The chat window is code-split and only downloaded on first open.
 */
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUp, Mail, Phone } from "lucide-react"; // add `X` back with the Ask Jen button
import { emailHref, phoneHref, whatsappHref } from "@/config/site";
// import { LogoMark } from "@/components/brand/logo"; // used by the hidden Ask Jen button
import { BrandIcon } from "@/components/ui/brand-icon";
import { cn } from "@/lib/utils";

const ChatPanel = dynamic(() => import("@/components/chatbot/chat-panel"), { ssr: false });

const isDev = process.env.NODE_ENV !== "production";

export function FloatingDock() {
  const [chatOpen, setChatOpen] = useState(false);
  // setChatLoaded is only used by the hidden Ask Jen button: restore it with the button.
  const [chatLoaded /* , setChatLoaded */] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [progress, setProgress] = useState(0);
  /** Mobile only: tuck the dock away while the user scrolls down to read. */
  const [tucked, setTucked] = useState(false);
  const chatButtonRef = useRef<HTMLButtonElement>(null);

  const whatsapp = whatsappHref();
  const phone = phoneHref();
  const email = emailHref("Project enquiry");

  useEffect(() => {
    let frame = 0;
    let lastY = window.scrollY;
    let idle: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setShowTop(y > 700);
        setProgress(max > 0 ? Math.min(1, y / max) : 0);
        if (Math.abs(y - lastY) > 6) setTucked(y > lastY && y > 400 && y < max - 80);
        lastY = y;
        clearTimeout(idle);
        idle = setTimeout(() => setTucked(false), 1200);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      clearTimeout(idle);
    };
  }, []);

  // Opens the chat; only the hidden Ask Jen button calls it.
  // const openChat = () => {
  //   setChatLoaded(true);
  //   setChatOpen(true);
  // };
  const closeChat = () => {
    setChatOpen(false);
    chatButtonRef.current?.focus();
  };

  const scrollToTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    document.getElementById("main")?.focus({ preventScroll: true });
  };

  return (
    <>
      {chatLoaded ? <ChatPanel open={chatOpen} onClose={closeChat} /> : null}

      <aside
        aria-label="Quick actions"
        className={cn(
          "fixed right-[max(0.75rem,env(safe-area-inset-right))] z-60 flex flex-col items-end gap-2 bg-transparent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:right-6 sm:gap-2.5",
          "bottom-[max(0.75rem,env(safe-area-inset-bottom))] sm:bottom-6",
          tucked && !chatOpen && "max-sm:translate-x-[calc(100%+1rem)]",
          chatOpen && "max-sm:hidden",
        )}
      >
        {/* Back to top (with scroll-progress ring) */}
        <DockButton
          label="Back to top"
          onClick={scrollToTop}
          className={cn(
            "transition-all duration-300",
            showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
          )}
          size="sm"
          hidden={!showTop}
        >
          <svg aria-hidden viewBox="0 0 44 44" className="absolute inset-0 size-full -rotate-90">
            <circle cx="22" cy="22" r="20.5" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1.5" />
            <circle
              cx="22"
              cy="22"
              r="20.5"
              fill="none"
              stroke="url(#dock-progress)"
              strokeWidth="1.5"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray={`${progress * 100} 100`}
            />
            <defs>
              <linearGradient id="dock-progress">
                <stop stopColor="var(--gold)" />
                <stop offset="1" stopColor="var(--sun)" />
              </linearGradient>
            </defs>
          </svg>
          <ArrowUp className="size-4" />
        </DockButton>

        <div className="group/dock flex flex-col items-end gap-2.5">
          {/* Secondary actions, desktop only, revealed on hover / focus */}
          <div className="hidden flex-col items-end gap-2.5 sm:flex">
            {phone ? (
              <DockLink
                href={phone}
                label="Call us"
                className="translate-y-2 opacity-0 group-focus-within/dock:translate-y-0 group-focus-within/dock:opacity-100 group-hover/dock:translate-y-0 group-hover/dock:opacity-100"
              >
                <Phone className="size-4" />
              </DockLink>
            ) : null}
            <DockLink
              href={email}
              label="Email us"
              className="translate-y-2 opacity-0 group-focus-within/dock:translate-y-0 group-focus-within/dock:opacity-100 group-hover/dock:translate-y-0 group-hover/dock:opacity-100"
            >
              <Mail className="size-4" />
            </DockLink>
          </div>

          {/* Primary actions: the AI assistant and WhatsApp, side by side */}
          <div className="flex items-center gap-2.5">
            {/* "Ask Jen" AI assistant button, hidden for now. Uncomment to bring it back.
            <button
              ref={chatButtonRef}
              type="button"
              onClick={() => (chatOpen ? closeChat() : openChat())}
              onPointerEnter={() => void import("@/components/chatbot/chat-panel")}
              onFocus={() => void import("@/components/chatbot/chat-panel")}
              aria-expanded={chatOpen}
              aria-haspopup="dialog"
              aria-label={chatOpen ? "Close Ask Jen chat" : "Ask Jen, our AI assistant"}
              className="group relative flex h-12 items-center gap-2.5 rounded-full border border-line-strong bg-surface pr-4 pl-1.5 text-sm font-medium text-text [box-shadow:var(--shadow-lg),var(--inset-highlight)] transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-text/30 active:scale-[0.97] sm:h-13"
            >
              <span className="relative grid size-9 place-items-center rounded-full bg-bg sm:size-10">
                {chatOpen ? (
                  <X className="size-4.5" aria-hidden />
                ) : (
                  <>
                    <LogoMark className="size-6" />
                    <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-surface bg-success" />
                  </>
                )}
              </span>
              <span aria-hidden>{chatOpen ? "Close" : "Ask Jen"}</span>
            </button>
            */}

            {whatsapp ? (
              <DockLink
                href={whatsapp}
                label="Chat with us on WhatsApp"
                external
                className="size-14 border-2 border-white bg-[#00a900] text-white shadow-[0_6px_20px_rgba(8,160,0,0.28)] hover:brightness-105 sm:size-15"
              >
                <BrandIcon slug="whatsapp" className="size-8" />
              </DockLink>
            ) : isDev ? (
              <DockLink
                href="/contact"
                label="WhatsApp not configured: set NEXT_PUBLIC_WHATSAPP_NUMBER (dev only)"
                className="size-12 border-dashed border-whatsapp/60 sm:size-13"
              >
                <BrandIcon slug="whatsapp" className="size-8" />
              </DockLink>
            ) : null}
          </div>
        </div>
      </aside>
    </>
  );
}

function Tooltip({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute top-1/2 right-[calc(100%+0.75rem)] hidden -translate-y-1/2 translate-x-1 rounded-md border border-line-strong bg-surface px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-text opacity-0 shadow-md transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 sm:block"
    >
      {children}
    </span>
  );
}

const baseButton =
  "group relative grid place-items-center rounded-full border border-line-strong bg-surface text-text-muted shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:border-text/30 hover:text-text";

function DockButton({
  label,
  onClick,
  className,
  size = "md",
  hidden,
  children,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  size?: "sm" | "md";
  hidden?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      tabIndex={hidden ? -1 : undefined}
      aria-hidden={hidden || undefined}
      className={cn(baseButton, size === "sm" ? "size-10 sm:size-11" : "size-11 sm:size-12", className)}
    >
      {children}
      <Tooltip>{label}</Tooltip>
    </button>
  );
}

function DockLink({
  href,
  label,
  external,
  className,
  children,
}: {
  href: string;
  label: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={external ? `${label} (opens in a new tab)` : label}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(baseButton, "size-11 sm:size-12", className)}
    >
      {children}
      <Tooltip>{label}</Tooltip>
    </a>
  );
}
