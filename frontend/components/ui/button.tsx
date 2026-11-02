import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

/**
 * Brand button (DESIGN.md §7). Use `asChild` to render a Link/anchor with
 * button styling. Variants read theme tokens, so the same button works on
 * light and deep surfaces. `magnetic` opts into the page-level magnetic hover.
 *
 * Fully rounded pills. Primary is solid blue with a soft blue shadow and lifts
 * 2px on hover; a <ButtonArrow /> inside it is a plain trailing "→".
 */
const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-[-0.005em] transition-[background-color,border-color,color,box-shadow,transform,translate] duration-[250ms] ease-out outline-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        /** The one action we want: solid blue, white label (5:1), soft blue shadow, 2px lift. */
        primary:
          "bg-primary font-semibold text-on-primary shadow-(--shadow-primary) hover:-translate-y-0.5 hover:bg-(--primary-fill-hover) hover:shadow-(--shadow-primary-hover)",
        /** Quiet companion to primary: white pill, 1.5px light-blue border, light-blue fill on hover. */
        secondary:
          "border-[1.5px] border-line-strong bg-white/80 font-semibold text-ink hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary-light",
        /** Paper on night, ink on day, for statement bands. */
        inverse: "bg-text text-bg hover:bg-text/88",
        /** Kept for older call sites: ink fill with white text. */
        light: "bg-ink text-white hover:bg-ink/85",
        ghost: "text-text-muted hover:bg-tint/6 hover:text-text",
        outline:
          "border-[1.5px] border-line-strong bg-white/70 font-semibold text-text hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary-light [.theme-deep_&]:bg-transparent [.theme-deep_&]:hover:bg-white/8",
        destructive: "border border-danger/30 bg-danger/8 text-danger hover:bg-danger/14",
        link: "h-auto rounded-sm px-0 text-brand underline decoration-brand/35 underline-offset-[0.3em] hover:decoration-brand",
      },
      size: {
        sm: "h-10 px-5 text-sm",
        md: "h-12 px-6 text-[0.9375rem]",
        /** 14px × 28px, the reference pill */
        lg: "min-h-13 px-7 py-3.5 text-base",
        icon: "size-11",
        "icon-sm": "size-9 [&_svg:not([class*='size-'])]:size-4",
      },
    },
    compoundVariants: [{ variant: "link", className: "h-auto px-0" }],
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    magnetic?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  magnetic = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      data-magnetic={magnetic ? "" : undefined}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

/**
 * Trailing "→" that nudges on hover, in buttons and in text links.
 * `className` applies to the arrow itself (e.g. rotate-90 for "scroll down").
 */
function ButtonArrow({ className }: { className?: string }) {
  return (
    <span data-slot="button-arrow" aria-hidden className="inline-grid shrink-0 place-items-center">
      <svg
        viewBox="0 0 16 16"
        fill="none"
        className={cn("size-4 transition-transform duration-300 ease-out group-hover/button:translate-x-1", className)}
      >
        <path d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export { Button, ButtonArrow, buttonVariants };
