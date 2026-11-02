/**
 * Soft light behind the whole page (Server Component, no JS).
 * Visible for the "glow" and "living" backgrounds only, see html[data-bg]
 * in globals.css. Purely decorative, so it is hidden from assistive tech.
 */
export function BackgroundFX() {
  return (
    <div aria-hidden className="bg-fx">
      <span className="bg-fx-blob bg-fx-a" />
      <span className="bg-fx-blob bg-fx-b" />
      <span className="bg-fx-blob bg-fx-c" />
    </div>
  );
}
