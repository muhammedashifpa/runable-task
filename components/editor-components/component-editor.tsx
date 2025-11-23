"use client";
import { ElementOverlay } from "./element-overlay";
import { useEditor } from "../../context/editor-provider";

// ComponentEditor wraps the user application area
// and conditionally renders the ElementOverlay in editable mode
// and Place Selected element overlay
export default function ComponentEditor({
  userComponent,
}: {
  userComponent: React.ReactNode;
}) {
  const {
    Component,
    editableMode,
    isResetting,
    lockedBoundingClients,
    userAppAreaRef,
    setActiveElement,
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
        {userComponent}
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
