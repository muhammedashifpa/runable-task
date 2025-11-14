// ElementOverlay.tsx
import { useEffect, useState } from "react";
import { lockedType } from "./editor-preview";

export function ElementOverlay({
  target,
  locked,
}: {
  target: HTMLElement;
  locked: lockedType | null;
}) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!target) return;
    const update = () => setRect(target.getBoundingClientRect());
    update();

    // Update overlay position on resize or scroll
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, [target]);

  if (!rect) return null;

  return (
    <>
      {locked && (
        <div
          data-dev-overlay
          className="fixed border border-sky-400 pointer-events-none select-none"
          style={{
            top: locked.top - window.scrollY,
            left: locked.left + window.scrollX,
            width: locked.width,
            height: locked.height,
            zIndex: 9999,
          }}
        >
          <span className="absolute -top-5 left-0 bg-sky-100 text-sky-600 px-1 rounded text-xs">
            {locked.tagName}
          </span>
        </div>
      )}
      <div
        className="fixed border-2 border-sky-400 pointer-events-none select-none z-9998"
        style={{
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
          zIndex: 9999,
        }}
      >
        <span className="absolute -top-5 left-0 bg-sky-100 text-sky-600 px-1 rounded text-xs">
          {target.tagName.toLowerCase()}
        </span>
      </div>
    </>
  );
}
