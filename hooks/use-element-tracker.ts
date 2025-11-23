import { useState, useEffect, RefObject } from "react";

export function useElementTracker(
  userAppAreaRef: RefObject<HTMLDivElement | null>,
  editableMode: boolean,
  setActiveElement: (el: HTMLElement | null) => void
) {
  const [liveSelected, setLiveSelected] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!editableMode || !userAppAreaRef.current) return;

    const node = userAppAreaRef.current;

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const el = e.target as HTMLElement;
      setActiveElement(el);
    };
    const handleDoubleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const el = e.target as HTMLElement;

      // Enable content editable
      el.setAttribute("contenteditable", "true");
      el.focus();

      // Disable on blur
      const handleBlur = () => {
        el.removeAttribute("contenteditable");
        el.removeEventListener("blur", handleBlur);
      };
      // Allow focusing immediately
      el.setAttribute("tabindex", "-1");

      // Focus
      el.focus();
      el.addEventListener("blur", handleBlur);
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
    node.addEventListener("dblclick", handleDoubleClick);
    node.addEventListener("mouseover", handleMouseOver);
    node.addEventListener("mouseout", handleMouseOut);

    return () => {
      node.removeEventListener("click", handleClick);
      node.removeEventListener("dblclick", handleDoubleClick);
      node.removeEventListener("mouseover", handleMouseOver);
      node.removeEventListener("mouseout", handleMouseOut);
    };
  }, [editableMode, userAppAreaRef, setActiveElement]);

  return { liveSelected };
}
