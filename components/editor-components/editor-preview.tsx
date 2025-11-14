"use client";
import { useEffect, useState } from "react";
import { ElementOverlay } from "./element-overlay";
import { useEditor } from "./editor-provider";
export interface lockedType {
  top: number;
  left: number;
  width: number;
  height: number;
  tagName: string;
}
export default function EditorPreview({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selected, setSelected] = useState<HTMLElement | null>(null);
  const [locked, setLocked] = useState<lockedType | null>(null);

  const { editableMode } = useEditor();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setLocked({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        tagName: (e.target as HTMLElement).tagName.toLowerCase(),
      });
    };

    const handleMouseOver = (e: MouseEvent) => {
      e.stopPropagation();
      const target = e.target as HTMLElement;
      setSelected(target);
    };

    const handleMouseOut = (e: MouseEvent) => {
      e.stopPropagation();
      setSelected(null);
    };
    console.log("Editable mode:", editableMode);
    if (!editableMode)
      return () => {
        console.log("EditorPreview cleanup");
        document.removeEventListener("mouseover", handleMouseOver);
        document.removeEventListener("mouseout", handleMouseOut);
        document.removeEventListener("click", handleClick);
      };
    document.addEventListener("click", handleClick);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("click", handleClick);
    };
  }, [editableMode]);
  return (
    <>
      {children}
      {editableMode && selected && (
        <ElementOverlay target={selected} locked={locked} />
      )}
    </>
  );
}
