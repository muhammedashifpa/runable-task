import { useState, useEffect, RefObject } from "react";

import { lockedType } from "@/components/types";

export function useElementTracker<T extends HTMLElement>(
  ref: RefObject<HTMLDivElement | null>,
  editableMode: boolean,
  setActiveElement: (el: HTMLElement | null) => void
) {
  const [liveSelected, setLiveSelected] = useState<HTMLElement | null>(null);
  const [locked, setLocked] = useState<lockedType | null>(null);

  useEffect(() => {
    if (!editableMode || !ref.current) return;

    const node = ref.current;

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const el = e.target as HTMLElement;
      setActiveElement(el);
      // const rect = structuredClone(el.getBoundingClientRect());

      // setLocked({
      //   top: rect.top + window.scrollY,
      //   left: rect.left + window.scrollX,
      //   width: rect.width,
      //   height: rect.height,
      //   tagName: el.tagName.toLowerCase(),
      // });
    };

    const handleMouseOver = (e: MouseEvent) => {
      e.stopPropagation();
      setLiveSelected(e.target as HTMLElement);
    };

    const handleMouseOut = (e: MouseEvent) => {
      e.stopPropagation();
      setLiveSelected(null);
    };

    node.addEventListener("click", handleClick);
    node.addEventListener("mouseover", handleMouseOver);
    node.addEventListener("mouseout", handleMouseOut);

    return () => {
      node.removeEventListener("click", handleClick);
      node.removeEventListener("mouseover", handleMouseOver);
      node.removeEventListener("mouseout", handleMouseOut);
    };
  }, [editableMode, ref]);

  return { liveSelected, locked };
}
