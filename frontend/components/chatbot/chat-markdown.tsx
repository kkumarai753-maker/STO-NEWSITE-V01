import { Fragment } from "react";

/**
 * Minimal, safe renderer for assistant replies: paragraphs, "- " bullet
 * lists and **bold**. Produces React elements only, never injects HTML.
 */
export function ChatMarkdown({ text }: { text: string }) {
  const blocks: { type: "p" | "ul"; lines: string[] }[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trimEnd();
    const isBullet = /^\s*[-•*]\s+/.test(line);
    const last = blocks[blocks.length - 1];
    if (!line.trim()) {
      blocks.push({ type: "p", lines: [] });
      continue;
    }
    if (isBullet) {
      const item = line.replace(/^\s*[-•*]\s+/, "");
      if (last?.type === "ul") last.lines.push(item);
      else blocks.push({ type: "ul", lines: [item] });
    } else if (last?.type === "p" && last.lines.length) {
      last.lines.push(line);
    } else {
      blocks.push({ type: "p", lines: [line] });
    }
  }

  return (
    <div className="space-y-2">
      {blocks
        .filter((b) => b.lines.length)
        .map((block, i) =>
          block.type === "ul" ? (
            <ul key={i} className="space-y-1 pl-1">
              {block.lines.map((item, j) => (
                <li key={j} className="flex gap-2">
                  <span aria-hidden className="mt-[0.55em] size-1 shrink-0 rounded-full bg-brand" />
                  <span>{inline(item)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p key={i}>
              {block.lines.map((line, j) => (
                <Fragment key={j}>
                  {j > 0 ? <br /> : null}
                  {inline(line)}
                </Fragment>
              ))}
            </p>
          ),
        )}
    </div>
  );
}

function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*|\/(?:services|build-your-proposal)(?:[/?][a-zA-Z0-9_?=&%/-]*)?)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-text">
        {part.slice(2, -2)}
      </strong>
    ) : /^\/(?:services|build-your-proposal)(?:[/?][a-zA-Z0-9_?=&%/-]*)?$/.test(part) ? (
      <a key={i} href={part} className="font-medium text-primary underline">{part.startsWith("/build-your-proposal") ? "Choose these services" : "Explore services"}</a>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
