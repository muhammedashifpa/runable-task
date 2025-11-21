"use client";
import { Button } from "@/components/ui/button";
import { Undo2, Redo2, Save, Loader2, Check } from "lucide-react";
import { PropertiesEditController } from "@/components/editor-components/properties-edit-controller";
import { EditModeToggle } from "@/components/editor-components/edit-mode-toggle";

import { useEditor } from "./editor-provider";

export default function Header() {
  const { activeElement, editableMode, elementType, saveComponent, saveState } =
    useEditor();
  const mountPropertiesController =
    editableMode && activeElement && elementType === "text";

  return (
    <header className="flex h-16 shrink-0 items-center bg-white sticky top-0 justify-between gap-2 border-b px-4">
      <div className="flex items-center relative">
        <EditModeToggle />
      </div>
      {mountPropertiesController && (
        <PropertiesEditController activeElement={activeElement} />
      )}
      <div className="flex items-center">
        {/* <Button variant="ghost" size="icon" aria-label="Submit" disabled>
          <Undo2 />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Submit" disabled>
          <Redo2 />
        </Button> */}

        <Button
          disabled={!saveState.dirty || saveState.saving}
          onClick={saveComponent}
          className="flex items-center gap-2"
        >
          {saveState.saving ? (
            <>
              Saving…
              <Loader2 className="h-4 w-4 animate-spin" />
            </>
          ) : saveState.dirty ? (
            <>
              Save
              <Save className="h-4 w-4" />
            </>
          ) : saveState.success ? (
            <>
              Saved
              <Check className="h-4 w-4" />
            </>
          ) : (
            <>
              Save
              <Save />
            </>
          )}
        </Button>
      </div>
    </header>
  );
}
