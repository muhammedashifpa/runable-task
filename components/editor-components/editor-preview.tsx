"use client";
import { useRef } from "react";
import { ElementOverlay } from "./element-overlay";
import { useEditor } from "./editor-provider";

export default function EditorPreview({
  children,
}: {
  children: React.ReactNode;
}) {
  const { editableMode, setActiveElement, locked } = useEditor();
  const userAppAreaRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={userAppAreaRef}>
      {children}

      {editableMode && (
        <ElementOverlay
          setActiveElement={setActiveElement}
          userAppAreaRef={userAppAreaRef}
          editableMode={editableMode}
          locked={locked}
        />
      )}
    </div>
  );
}
