"use client";

import { useSyncExternalStore } from "react";
import { DEFAULTS, readOption, subscribeOptions, type DesignKey } from "@/lib/design-lab";

/** Current value of a design option (palette / font / background), live. */
export function useDesignOption(key: DesignKey): string {
  return useSyncExternalStore(
    subscribeOptions,
    () => readOption(key),
    () => DEFAULTS[key],
  );
}
