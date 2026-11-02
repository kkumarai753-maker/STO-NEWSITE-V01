"use client";
import Link from "next/link";
import { useState } from "react";
import { Dialog } from "radix-ui";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Dumbbell,
  Lightbulb,
  PlugZap,
  Scissors,
  ShoppingBag,
  ShoppingCart,
  X,
} from "lucide-react";
import { templates } from "@/data/templates";

type Template = (typeof templates)[number];
const products = [
  { name: "Arc LED Desk Lamp", kind: "Lighting", price: 1499, icon: Lightbulb },
  { name: "Modular Switch Set", kind: "Switches", price: 799, icon: PlugZap },
  {
    name: "Warm Pendant Light",
    kind: "Lighting",
    price: 2499,
    icon: Lightbulb,
  },
];
export function DemoWebsite({ template: t }: { template: Template }) {
  const [cart, setCart] = useState<number[]>([]);
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState("");
  const [done, setDone] = useState(false);
  const store = t.kind === "store";
  const salon = t.kind === "salon";
  const openBooking = (value: string) => {
    setChoice(value);
    setDone(false);
    setOpen(true);
  };
  return (
    <div
      className="demo-site relative z-10 min-h-screen bg-[#f8f5ee] text-[#1e292b]"
      style={
        {
          "--demo-color": t.color,
          "--demo-accent": t.accent,
        } as React.CSSProperties
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#0c2442] px-5 py-3 text-xs text-white">
        <Link
          href="/templates"
          className="inline-flex min-h-9 items-center gap-2"
        >
          <ArrowLeft className="size-3.5" />
          Back to Sunrise templates
        </Link>
        <p className="text-white/80">
          Concept demo · Sample content · No real orders or bookings
        </p>
        <Link
          href={`/inquiry?service=${encodeURIComponent(t.subtitle)}`}
          className="inline-flex min-h-9 items-center gap-2 font-semibold text-[#ffc078]"
        >
          I like this design
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-6 py-6">
        <Link
          href={`/templates/${t.slug}`}
          className="font-display text-2xl font-semibold tracking-tight"
        >
          {t.name}
          <span className="text-[var(--demo-accent)]">.</span>
        </Link>
        <nav
          aria-label="Demo navigation"
          className="hidden items-center gap-6 text-sm sm:flex"
        >
          <a href="#demo-options">
            {store ? "Shop" : salon ? "Our services" : "Memberships"}
          </a>
          <a href="#demo-story">Our story</a>
        </nav>
        <button
          aria-label={
            store
              ? `Open cart, ${cart.length} items`
              : "Explore booking options"
          }
          onClick={() =>
            store
              ? setOpen(true)
              : openBooking(salon ? "Signature haircut" : "Starter membership")
          }
          className="flex min-h-11 items-center gap-2 rounded-full bg-[var(--demo-color)] px-5 text-sm text-white"
        >
          {store ? (
            <>
              <ShoppingCart className="size-4" />
              {cart.length}
            </>
          ) : salon ? (
            "Book a visit"
          ) : (
            "Start your journey"
          )}
        </button>
      </header>
      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-9 md:grid-cols-2 md:items-center md:gap-12 md:py-14">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase">
            {store
              ? "Considered essentials for modern spaces"
              : salon
                ? "Your moment. Your kind of beautiful."
                : "Show up for your stronger self"}
          </p>
          <h1 className="mt-6 max-w-xl font-display text-[clamp(2.6rem,5vw,4.7rem)] leading-[1.02] font-semibold tracking-[-0.055em]">
            {store ? (
              <>
                Small details.
                <br />
                Brighter living.
              </>
            ) : salon ? (
              <>
                A fresh look.
                <br />A little more you.
              </>
            ) : (
              <>
                Build strength.
                <br />
                Find your rhythm.
              </>
            )}
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-[#58656a]">
            {store
              ? "Thoughtfully selected lights, switches and everyday electrical essentials. Find the finishing touch for your space."
              : salon
                ? "Unhurried appointments, thoughtful care and a style that feels like you. Welcome to your neighbourhood studio."
                : "A welcoming space to move, train and build a routine that fits your life. Start where you are. We’ll meet you there."}
          </p>
          <a
            href="#demo-options"
            className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-[var(--demo-color)] px-6 text-sm font-semibold text-white"
          >
            {store
              ? "Explore the collection"
              : salon
                ? "Find your treatment"
                : "Explore memberships"}
            <ArrowRight className="size-4" />
          </a>
          <p className="mt-6 text-xs text-[#667074]">
            {store
              ? "Lighting · Switches · Home essentials"
              : salon
                ? "Hair · Colour · Care"
                : "Personal training · Strength · Group classes"}
          </p>
        </div>
        <div
          aria-hidden
          className={`relative flex aspect-[5/4] items-center justify-center overflow-hidden rounded-[2rem] ${store ? "bg-[#e8dccc]" : salon ? "bg-[#e4cfc8]" : "bg-[#243833]"}`}
        >
          <div className="absolute inset-y-8 right-8 w-1/2 rounded-t-full border border-white/35" />
          <div className="absolute -bottom-12 -left-12 size-64 rounded-full bg-white/15" />
          {store ? (
            <div className="relative flex flex-col items-center">
              <div className="h-4 w-36 rounded-t-full bg-[#ae7445]" />
              <div className="h-28 w-52 rounded-t-full bg-[#fff0ce] shadow-[0_35px_80px_#f7d998]" />
              <div className="h-24 w-2 bg-[#a26f46]" />
              <div className="h-4 w-32 rounded-full bg-[#a26f46]" />
              <p className="mt-9 text-xs tracking-[0.2em] text-[#715e4d]">
                A WARMER WELCOME HOME
              </p>
            </div>
          ) : salon ? (
            <div className="relative w-3/5 rounded-t-full border-[12px] border-[#b8876f] bg-linear-to-br from-[#f5e8dd] to-[#c5a491] p-8 text-center shadow-2xl">
              <Scissors
                className="mx-auto size-20 text-[#5b4238]"
                strokeWidth={1}
              />
              <p className="mt-8 font-display text-3xl text-[#5b4238]">
                A little time,
                <br />
                just for you.
              </p>
            </div>
          ) : (
            <div className="relative text-center">
              <Dumbbell
                className="mx-auto size-40 -rotate-25 text-[#e4b55d]"
                strokeWidth={1}
              />
              <p className="mt-7 font-display text-3xl font-semibold tracking-tight text-white">
                Progress starts
                <br />
                with showing up.
              </p>
            </div>
          )}
          <span className="absolute right-4 bottom-4 rounded-full bg-white/85 px-3 py-1 text-[10px] text-[#33494e]">
            ILLUSTRATIVE DESIGN
          </span>
        </div>
      </section>
      <section
        id="demo-options"
        className="mx-auto max-w-6xl scroll-mt-6 px-6 py-10"
      >
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs tracking-widest text-[#647477] uppercase">
              {store
                ? "The essentials"
                : salon
                  ? "Carefully considered care"
                  : "Find your fit"}
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
              {store
                ? "Good things, well chosen."
                : salon
                  ? "Make a little time for you."
                  : "A plan for your pace."}
            </h2>
          </div>
          {store ? (
            <div
              role="group"
              aria-label="Filter demo products"
              className="flex gap-2"
            >
              {["All", "Lighting", "Switches"].map((f) => (
                <button
                  key={f}
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                  className={`min-h-10 rounded-full border px-4 text-xs ${filter === f ? "bg-[var(--demo-color)] text-white" : "border-[#b8c2c2]"}`}
                >
                  {f}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {store
            ? products.map((p, i) =>
                filter !== "All" && p.kind !== filter ? null : (
                  <article
                    key={p.name}
                    className="rounded-2xl border border-[#d9dfdc] bg-white p-5"
                  >
                    <div className="grid h-32 place-items-center rounded-xl bg-[#f0ede5]">
                      <p.icon
                        className="size-16 text-[#8d6e4b]"
                        strokeWidth={1}
                      />
                    </div>
                    <p className="mt-4 text-[10px] tracking-widest text-[#667074] uppercase">
                      {p.kind}
                    </p>
                    <h3 className="mt-2 font-semibold">{p.name}</h3>
                    <div className="mt-5 flex items-center justify-between gap-2">
                      <span className="text-sm">
                        ₹{p.price.toLocaleString("en-IN")}{" "}
                        <span className="text-[10px] text-[#667074]">
                          sample
                        </span>
                      </span>
                      <button
                        onClick={() => setCart((c) => [...c, i])}
                        aria-label={`Add ${p.name} to demo cart`}
                        className="grid size-11 place-items-center rounded-full bg-[var(--demo-color)] text-white"
                      >
                        <ShoppingBag className="size-4" />
                      </button>
                    </div>
                  </article>
                ),
              )
            : (salon
                ? [
                    {
                      name: "Signature haircut",
                      detail: "A fresh shape, finished your way.",
                      time: "45 minutes",
                    },
                    {
                      name: "Colour consultation",
                      detail: "Find a colour that feels like you.",
                      time: "30 minutes",
                    },
                    {
                      name: "Care ritual",
                      detail: "Nourish, restore and unwind.",
                      time: "60 minutes",
                    },
                  ]
                : [
                    {
                      name: "Starter membership",
                      detail: "Find your routine with open gym access.",
                      time: "Monthly plan",
                    },
                    {
                      name: "Guided training",
                      detail: "Build confidence with coaching support.",
                      time: "Personal training",
                    },
                    {
                      name: "Move together",
                      detail: "Bring fresh energy to your week.",
                      time: "Group classes",
                    },
                  ]
              ).map((p) => (
                <article
                  key={p.name}
                  className="rounded-2xl border border-[#d9dfdc] bg-white p-6"
                >
                  <p className="text-xs text-[#667074]">{p.time}</p>
                  <h3 className="mt-4 text-xl font-semibold">{p.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#58656a]">
                    {p.detail}
                  </p>
                  <button
                    onClick={() => openBooking(p.name)}
                    className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--demo-color)]"
                  >
                    {salon ? "Choose service" : "Explore plan"}
                    <ArrowRight className="size-4" />
                  </button>
                </article>
              ))}
        </div>
        {store ? (
          <p role="status" className="mt-4 text-xs text-[#58656a]">
            {cart.length} items in your sample cart. Product prices are
            illustrative, not Sunrise service prices.
          </p>
        ) : null}
      </section>
      <section id="demo-story" className="mx-auto mb-12 max-w-6xl px-6 py-8">
        <div className="rounded-2xl bg-[var(--demo-color)] p-8 text-white">
          <p className="text-xs tracking-widest text-white/70 uppercase">
            Built around people
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold">
            {store
              ? "A brighter everyday."
              : salon
                ? "Care that feels personal."
                : "More than a place to train."}
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80">
            This is a Sunrise Tech Origin concept website. Explore the layout
            and interactions, then tell us what you would like for your own
            business.
          </p>
          <Link
            href={`/inquiry?service=${encodeURIComponent(t.subtitle)}`}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[var(--demo-color)]"
          >
            Discuss a website like this
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-90 bg-black/50" />
          <Dialog.Content
            aria-describedby="demo-dialog-description"
            className="fixed top-1/2 left-1/2 z-91 max-h-[90dvh] w-[min(92vw,28rem)] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-2xl bg-white p-6 text-[#1e292b] shadow-2xl"
          >
            <Dialog.Close
              className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-[#eff3f3]"
              aria-label="Close demo dialog"
            >
              <X className="size-4" />
            </Dialog.Close>
            <Dialog.Title className="pr-10 text-xl font-semibold">
              {store
                ? "Your sample cart"
                : done
                  ? "Sample request prepared"
                  : choice}
            </Dialog.Title>
            <Dialog.Description
              id="demo-dialog-description"
              className="mt-3 text-sm text-[#58656a]"
            >
              Concept preview only. No order or appointment will be placed.
            </Dialog.Description>
            {store ? (
              <>
                <ul className="mt-5 space-y-3">
                  {cart.map((id, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-3 border-b border-[#dde3e3] pb-3 text-sm"
                    >
                      <span>{products[id].name}</span>
                      <button
                        aria-label={`Remove ${products[id].name} from cart`}
                        className="grid size-9 place-items-center rounded-full bg-[#eff3f3]"
                        onClick={() =>
                          setCart((c) => c.filter((_, j) => i !== j))
                        }
                      >
                        <X className="size-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
                {cart.length === 0 ? (
                  <p className="mt-6 text-sm">Your sample cart is empty.</p>
                ) : (
                  <p className="mt-5 font-semibold">
                    Sample total: ₹
                    {cart
                      .reduce((sum, i) => sum + products[i].price, 0)
                      .toLocaleString("en-IN")}
                  </p>
                )}
              </>
            ) : done ? (
              <p className="mt-6 flex gap-3 text-sm">
                <Check className="size-5 text-[#28764b]" />
                You’ve completed the sample flow. Nothing was sent or booked.
              </p>
            ) : (
              <form
                className="mt-5 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setDone(true);
                }}
              >
                <label className="block text-sm">
                  Your name
                  <input
                    required
                    autoComplete="name"
                    className="mt-2 min-h-11 w-full rounded-lg border border-[#bbc8c8] px-3"
                  />
                </label>
                <label className="block text-sm">
                  Email
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    className="mt-2 min-h-11 w-full rounded-lg border border-[#bbc8c8] px-3"
                  />
                </label>
                <button className="min-h-12 w-full rounded-full bg-[var(--demo-color)] px-4 text-sm font-semibold text-white">
                  Try the sample {salon ? "booking" : "enquiry"}
                </button>
              </form>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
