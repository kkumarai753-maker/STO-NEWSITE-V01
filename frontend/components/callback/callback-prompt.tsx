"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Dialog } from "radix-ui";
import { ArrowUpRight, PhoneCall, X } from "lucide-react";
const key = "sunrise-callback-seen-v1";
export function CallbackPrompt({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const seen = useRef(false);
  useEffect(() => {
    let stored = false;
    try {
      stored = sessionStorage.getItem(key) === "1";
    } catch {}
    if (stored || seen.current) return;
    const timer = setTimeout(() => {
      // Do not interrupt a visitor who already opened navigation or another dialog.
      if (document.querySelector('[role="dialog"]')) return;
      seen.current = true;
      try {
        sessionStorage.setItem(key, "1");
      } catch {}
      setOpen(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <div className="border-y border-line bg-[#0e2747]">
        <div className="container-page flex flex-col items-start justify-between gap-3 py-5 text-white sm:flex-row sm:items-center">
          <p className="flex items-center gap-3 text-sm">
            <PhoneCall className="size-4 text-[#ffb865]" aria-hidden />
            Have an idea, but not sure where to begin?
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-5 text-sm font-medium hover:bg-white/15"
          >
            Request a Callback
            <ArrowUpRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-90 bg-[#091d39]/60 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 motion-reduce:animate-none" />
          <Dialog.Content
            aria-describedby="callback-description"
            className="fixed top-1/2 left-1/2 z-91 max-h-[92dvh] w-[min(94vw,34rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[1.5rem] border border-white bg-[#f8faff] p-6 shadow-2xl outline-none sm:p-8"
          >
            <Dialog.Close
              aria-label="Close callback form"
              className="absolute top-4 right-4 grid size-10 place-items-center rounded-full border border-line bg-white text-text"
            >
              <X className="size-4" />
            </Dialog.Close>
            <p className="preview-kicker pr-12">
              Let’s talk about your next step
            </p>
            <Dialog.Title className="mt-4 pr-8 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
              Request a callback.
            </Dialog.Title>
            <Dialog.Description
              id="callback-description"
              className="mt-3 max-w-md text-sm leading-relaxed text-text-muted"
            >
              Tell us what you have in mind. We’ll help you find a practical
              place to start.
            </Dialog.Description>
            {children}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
