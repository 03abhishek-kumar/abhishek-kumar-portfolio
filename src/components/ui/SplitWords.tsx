import { Fragment } from "react";

export type SplitPart = string | { em: string };

/**
 * Splits text into masked words for the `[data-split]` reveal.
 * `{ em: "..." }` parts render in the italic serif accent face.
 * Screen readers get the plain sentence via aria-label on the parent.
 */
export function SplitWords({ parts, offset = 0 }: { parts: SplitPart[]; offset?: number }) {
  let i = offset;
  return (
    <>
      {parts.map((part, pi) => {
        const isEm = typeof part !== "string";
        const text = isEm ? part.em : part;
        const words = text.split(" ").filter(Boolean);
        return (
          <Fragment key={pi}>
            {words.map((w, wi) => {
              const idx = i++;
              return (
                <Fragment key={wi}>
                  <span className="word-mask" aria-hidden>
                    <span className={`word ${isEm ? "font-serif-italic" : ""}`} style={{ ["--i" as string]: idx }}>
                      {w}
                    </span>
                  </span>{" "}
                </Fragment>
              );
            })}
          </Fragment>
        );
      })}
    </>
  );
}

export const plainText = (parts: SplitPart[]) =>
  parts.map((p) => (typeof p === "string" ? p : p.em)).join(" ").replace(/\s+/g, " ").trim();
