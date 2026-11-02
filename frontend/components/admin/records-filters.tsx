"use client";

/**
 * Records filters: search as you type (debounced) and styled dropdowns that
 * apply instantly, no Apply button. Filters stay in the URL, so views can be
 * bookmarked, shared and navigated with Back/Forward; the server page reads
 * them and renders the results.
 * Why client: typing, debouncing and the dropdowns.
 */
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Select } from "radix-ui";
import { Check, ChevronDown, LoaderCircle, Search, X } from "lucide-react";
import { recordsHref, type RecordsQuery } from "@/lib/admin";
import { cn } from "@/lib/utils";

const SEARCH_DEBOUNCE_MS = 350;
/** Radix Select can't use "" as an item value, so "all" stands for "no filter". */
const ALL = "all";

type Option = { value: string; label: string };
type Current = { q: string; status?: string; period?: string; per: number };

export function RecordsFilters({
  current,
  statusOptions,
  periodOptions,
  pageSizes,
}: {
  current: Current;
  statusOptions: Option[];
  periodOptions: Option[];
  pageSizes: readonly number[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [q, setQ] = useState(current.q);
  // The search text we last sent to the URL. When the URL's q changes to
  // something else (Back/Forward, "Clear filters"), mirror it in the box; when
  // it's just our own debounced search coming back, leave the box alone so
  // characters typed meanwhile aren't lost.
  const [sentQ, setSentQ] = useState(current.q);
  const [seenQ, setSeenQ] = useState(current.q);
  if (current.q !== seenQ) {
    setSeenQ(current.q);
    if (current.q !== sentQ) {
      setQ(current.q);
      setSentQ(current.q);
    }
  }

  useEffect(() => () => clearTimeout(timer.current), []);

  /** Navigate to the filtered view. Any filter change starts again at page 1. */
  const go = (changes: Partial<RecordsQuery>, mode: "push" | "replace" = "push") => {
    const href = recordsHref({ ...current, q: sentQ, ...changes, page: 1 });
    startTransition(() => {
      if (mode === "replace") router.replace(href, { scroll: false });
      else router.push(href, { scroll: false });
    });
  };

  const search = (value: string) => {
    clearTimeout(timer.current);
    const next = value.trim().slice(0, 200);
    if (next === sentQ) return;
    setSentQ(next);
    // replace: typing shouldn't fill the Back button with every keystroke.
    go({ q: next }, "replace");
  };

  const onType = (value: string) => {
    setQ(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => search(value), SEARCH_DEBOUNCE_MS);
  };

  /** Dropdown changes include whatever is in the search box, even mid-pause. */
  const flushSearch = () => {
    clearTimeout(timer.current);
    const next = q.trim().slice(0, 200);
    if (next !== sentQ) setSentQ(next);
    return next;
  };

  const filtered = Boolean(sentQ || current.status || current.period);

  return (
    <div
      role="search"
      aria-label="Filter records"
      aria-busy={isPending}
      className="grid gap-3 border-b border-line p-4 sm:p-5 lg:grid-cols-[1fr_auto_auto_auto_auto]"
    >
      <div className="relative">
        <label htmlFor="records-search" className="sr-only">
          Search records
        </label>
        <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-subtle" />
        <input
          id="records-search"
          type="text"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          value={q}
          maxLength={200}
          onChange={(e) => onType(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              search(q); // search now, without waiting for the pause
            } else if (e.key === "Escape" && q) {
              e.preventDefault();
              setQ("");
              search("");
            }
          }}
          placeholder="Search name, email, phone or message"
          className="field-control h-12 pr-20 pl-10"
        />
        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1">
          {isPending ? <LoaderCircle aria-hidden className="size-4 animate-spin text-subtle" /> : null}
          {q ? (
            <button
              type="button"
              onClick={() => {
                setQ("");
                search("");
              }}
              aria-label="Clear search"
              className="grid size-8 place-items-center rounded-lg text-subtle transition-colors hover:bg-tint/5 hover:text-text"
            >
              <X aria-hidden className="size-4" />
            </button>
          ) : null}
        </div>
      </div>

      {/* One per row on narrow phones (labels need the width), two from 380px, three from sm. */}
      <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:grid-cols-3 lg:contents">
        <FilterSelect
          label="Status"
          value={current.status ?? ALL}
          options={[{ value: ALL, label: "All statuses" }, ...statusOptions]}
          onChange={(v) => go({ q: flushSearch(), status: v === ALL ? undefined : v })}
        />
        <FilterSelect
          label="Date"
          value={current.period ?? ALL}
          options={[{ value: ALL, label: "Any time" }, ...periodOptions]}
          onChange={(v) => go({ q: flushSearch(), period: v === ALL ? undefined : v })}
        />
        <FilterSelect
          className="min-[380px]:col-span-2 sm:col-span-1"
          label="Rows per page"
          value={String(current.per)}
          options={pageSizes.map((n) => ({ value: String(n), label: `${n} per page` }))}
          onChange={(v) => go({ q: flushSearch(), per: Number(v) })}
        />
      </div>

      {filtered ? (
        <button
          type="button"
          onClick={() => {
            clearTimeout(timer.current);
            setQ("");
            setSentQ("");
            go({ q: "", status: undefined, period: undefined });
          }}
          className="inline-flex h-12 items-center justify-center gap-1.5 rounded-xl px-4 text-sm font-medium text-text-muted transition-colors hover:bg-tint/5 hover:text-text"
        >
          <X aria-hidden className="size-4" /> Clear
        </button>
      ) : null}
    </div>
  );
}

/** Styled dropdown (Radix Select): keyboard, typeahead and screen-reader support built in. */
function FilterSelect({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  className?: string;
}) {
  const active = value !== ALL && label !== "Rows per page";
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger
        aria-label={label}
        className={cn(
          "group inline-flex h-12 w-full min-w-0 items-center justify-between gap-1.5 rounded-xl border bg-bg-elevated px-3 text-left text-sm text-text sm:gap-2 sm:px-3.5 sm:text-[0.9375rem] transition-[border-color,box-shadow,background-color] outline-none hover:border-ink/25 focus-visible:border-ink focus-visible:shadow-[0_0_0_4px_rgb(15_23_42/0.08)] data-[state=open]:border-ink data-[state=open]:bg-surface lg:w-auto lg:min-w-40",
          active ? "border-ink/40 bg-surface font-medium" : "border-line-strong",
          className,
        )}
      >
        <span className="truncate">
          {/* Explicit label so it shows in the server HTML, before JavaScript loads. */}
          <Select.Value>{options.find((o) => o.value === value)?.label}</Select.Value>
        </span>
        <Select.Icon asChild>
          <ChevronDown aria-hidden className="size-4 shrink-0 text-subtle transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={6}
          collisionPadding={12}
          className="z-70 max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) overflow-hidden rounded-2xl border border-line bg-surface p-1.5 shadow-[0_2px_6px_rgb(15_23_42/0.06),0_24px_60px_-20px_rgb(15_23_42/0.3)] data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
        >
          <Select.Viewport>
            {options.map((o) => (
              <Select.Item
                key={o.value}
                value={o.value}
                className="relative flex cursor-pointer items-center rounded-lg py-2 pr-9 pl-3 text-sm text-text outline-none select-none data-highlighted:bg-tint/5 data-[state=checked]:font-medium"
              >
                <Select.ItemText>{o.label}</Select.ItemText>
                <Select.ItemIndicator className="absolute right-3 inline-flex">
                  <Check aria-hidden className="size-4 text-brand" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
