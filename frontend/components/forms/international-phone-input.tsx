"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Popover } from "radix-ui";
import { Check, ChevronDown, Search } from "lucide-react";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import { normalizePhone, phoneCountries, phoneFormValue, type CountryCode } from "@/lib/phone";

type Props = {
  id?: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  error?: string;
  disabled?: boolean;
};

export function InternationalPhoneInput({ id, name, value, onChange, onBlur, required = false, error, disabled = false }: Props) {
  const uid = useId();
  const inputId = id || `${uid}-mobile`;
  const listId = `${uid}-countries`;
  const [country, setCountry] = useState<CountryCode>(() => parsePhoneNumberFromString(value, "IN")?.country || "IN");
  const [number, setNumber] = useState(() => value ? parsePhoneNumberFromString(value, "IN")?.formatNational() || value : "");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const query = search.trim().toLowerCase();
  const india = phoneCountries.find((c) => c.code === "IN")!;
  const matches = (c: typeof india) => `${c.name} ${c.code} +${c.callingCode}`.toLowerCase().includes(query);
  const others = phoneCountries.filter((c) => c.code !== "IN" && matches(c));
  const shown = [india, ...others];
  const current = phoneCountries.find((c) => c.code === country)!;
  const localError = touched && ((required && !number.trim()) || normalizePhone(number, country) === null)
    ? "Please enter a valid mobile number for your country." : undefined;
  const message = error || localError;

  useEffect(() => {
    if (open) document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, listId, open]);

  function select(next: CountryCode) {
    setCountry(next);
    const updated = phoneFormValue(number, next);
    onChange(updated);
    setOpen(false);
  }

  function change(raw: string) {
    let next = country;
    let display = raw;
    if (raw.trim().startsWith("+")) {
      const parsed = parsePhoneNumberFromString(raw);
      if (parsed?.isValid() && parsed.country && !parsed.ext) {
        next = parsed.country;
        display = parsed.formatNational();
        setCountry(next);
      }
    }
    setNumber(display);
    const updated = phoneFormValue(display, next);
    onChange(updated);
  }

  const field = "mt-1.5 flex min-h-12 w-full min-w-0 items-center rounded-xl border border-line-strong bg-white px-3.5 py-2.5 text-sm text-text outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:opacity-60";
  return <div className="min-w-0 space-y-1">
    <div className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-3 sm:gap-4">
      <div className="min-w-0">
        <label htmlFor={`${uid}-country`} className="block text-xs font-medium text-text">Country code{required ? " *" : ""}</label>
        <Popover.Root modal open={open} onOpenChange={(next) => { setOpen(next); if (next) { setSearch(""); setActive(0); } }}>
          <Popover.Trigger asChild>
            <button id={`${uid}-country`} type="button" disabled={disabled} className={`${field} gap-1.5`} aria-label="Country code" title={`${current.name} +${current.callingCode}`}>
              <span className="min-w-0 flex-1 truncate text-left">{current.name}</span>
              <span className="shrink-0 tabular-nums">+{current.callingCode}</span><ChevronDown className="size-4 shrink-0" aria-hidden />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content align="start" sideOffset={6} collisionPadding={12} onOpenAutoFocus={(e) => { e.preventDefault(); searchRef.current?.focus(); }}
              className="z-[120] w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-line-strong bg-white p-3 text-text shadow-xl outline-none">
              <div className="flex items-center gap-2 rounded-lg border border-line-strong px-3">
                <Search className="size-4 shrink-0 text-text-muted" aria-hidden />
                <input ref={searchRef} role="combobox" aria-expanded="true" aria-controls={listId} aria-activedescendant={`${listId}-${Math.min(active, shown.length - 1)}`} aria-autocomplete="list" aria-label="Search country or code" placeholder="Search country or code"
                  value={search} onChange={(e) => { const q = e.target.value; setSearch(q); setActive(q && !`${india.name} IN +91`.toLowerCase().includes(q.toLowerCase()) ? 1 : 0); }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); setActive((n) => Math.max(0, Math.min(shown.length - 1, n + (e.key === "ArrowDown" ? 1 : -1)))); }
                    if (e.key === "Enter") { e.preventDefault(); const chosen = shown[Math.min(active, shown.length - 1)]; if (chosen) select(chosen.code); }
                  }} className="min-h-11 min-w-0 flex-1 bg-transparent text-sm outline-none" />
              </div>
              <div id={listId} role="listbox" aria-label="Countries and calling codes" className="mt-2 max-h-[min(19rem,45dvh)] overflow-y-auto overscroll-contain">
                {shown.map((c, i) => <div key={c.code}>
                  {i === 0 && <p className="px-2 py-2 text-xs text-text-muted" role="presentation">Suggested</p>}
                  {i === 1 && <p className="mt-2 border-t border-line px-2 pt-3 pb-2 text-xs text-text-muted" role="presentation">All countries</p>}
                  <button type="button" id={`${listId}-${i}`} role="option" aria-selected={c.code === country} tabIndex={-1}
                    onMouseMove={() => setActive(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => select(c.code)}
                    className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-2.5 text-left text-sm ${i === active ? "ring-2 ring-inset ring-primary/40" : ""} ${c.code === "IN" || c.code === country ? "bg-blue-50 text-blue-900" : "hover:bg-slate-50"}`}>
                    <span className="min-w-0 flex-1">{c.name}</span><span className="tabular-nums">+{c.callingCode}</span>
                    {c.code === country ? <Check className="size-4 shrink-0 text-primary" aria-hidden /> : <span className="w-4" />}
                  </button>
                </div>)}
                {!others.length && <p className="p-3 text-xs text-text-muted">No other countries found.</p>}
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
      <div className="min-w-0">
        <label htmlFor={inputId} className="block text-xs font-medium text-text">Mobile number{required ? " *" : " (optional)"}</label>
        <input id={inputId} name={`${name}National`} type="tel" inputMode="tel" autoComplete="tel-national" placeholder="Enter your mobile number" required={required} disabled={disabled} maxLength={50}
          value={number} onChange={(e) => change(e.target.value)} onBlur={() => { setTouched(true); onBlur?.(); }}
          aria-invalid={message ? true : undefined} aria-describedby={message ? `${inputId}-error` : undefined} className={field} />
      </div>
    </div>
    <input type="hidden" name={name} value={value} />
    {message && <p id={`${inputId}-error`} role="alert" className="pt-1 text-xs text-[#b12525]">{message}</p>}
  </div>;
}
