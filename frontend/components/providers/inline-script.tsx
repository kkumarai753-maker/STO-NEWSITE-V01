"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * An inline `<script>` that only ever comes from the server HTML. If React has to
 * build the tree on the client (e.g. a browser extension altered the HTML and
 * hydration fell back to a client render), a fresh `<script>` would never run and
 * React warns about it, so on the client this renders nothing. The script has
 * already executed from the server HTML by then.
 */
export function InlineScript({ html }: { html: string }) {
  const fromServer = useSyncExternalStore(subscribe, () => false, () => true);
  return fromServer ? <script dangerouslySetInnerHTML={{ __html: html }} /> : null;
}
