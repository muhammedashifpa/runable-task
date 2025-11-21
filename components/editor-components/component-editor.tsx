"use client";
import { ElementOverlay } from "./element-overlay";
import { useEditor } from "./editor-provider";

// EditorPreview wraps the user application area
// and conditionally renders the ElementOverlay in editable mode
// and Place Selected element overlay
export default function EditorPreview({
  component,
}: {
  component: React.ReactNode;
}) {
  const {
    editableMode,
    setActiveElement,
    lockedBoundingClients,
    userAppAreaRef,
    isResetting,
    Component,
  } = useEditor();
  const mountOverlay =
    editableMode &&
    Component !== "error" &&
    Component !== "loading" &&
    !isResetting;
  return (
    <>
      <div
        data-editor-root
        className={mountOverlay ? "**:cursor-crosshair" : undefined}
        ref={userAppAreaRef}
      >
        {component}
      </div>
      {mountOverlay && (
        <ElementOverlay
          setActiveElement={setActiveElement}
          userAppAreaRef={userAppAreaRef}
          editableMode={editableMode}
          lockedBoundingClients={lockedBoundingClients}
        />
      )}
    </>
  );
}
