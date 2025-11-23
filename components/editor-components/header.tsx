"use client";
import {
  Save,
  Loader2,
  Check,
  RefreshCcw,
  AlertCircleIcon,
  SquareDashedMousePointer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertiesEditController } from "@/components/editor-components/properties-edit-controller";
import { EditModeToggle } from "@/components/editor-components/edit-mode-toggle";

import { useEditor } from "../../context/editor-provider";
import { Alert, AlertTitle } from "../ui/alert";

export default function Header() {
  const {
    activeElement,
    editableMode,
    elementType,
    saveComponentHandler,
    saveState,
    resetToOriginalComponent,
    isResetting,
  } = useEditor();
  const mountPropertiesController =
    editableMode && activeElement && elementType === "text";
  const mountAlert = activeElement && elementType !== "text";
  return (
    <header className="flex h-16 shrink-0 items-center bg-white sticky top-0 justify-between gap-2 border-b px-4 z-3000">
      <div className="flex items-center relative">
        <EditModeToggle />
      </div>
      <div>
        {/* Alerts in header for non-text elements , preview mode and selection */}
        {mountAlert && (
          <Alert variant="default">
            <AlertCircleIcon />
            <AlertTitle>Text Editing Only (For Now)</AlertTitle>
          </Alert>
        )}
        {!editableMode && (
          <Alert variant="default">
            <AlertCircleIcon />
            <AlertTitle>Preview mode</AlertTitle>
          </Alert>
        )}
        {editableMode && !activeElement && (
          <Alert variant="default">
            <SquareDashedMousePointer />
            <AlertTitle>
              Select a text element to edit its properties
            </AlertTitle>
          </Alert>
        )}
      </div>
      {/* Text properties controller */}
      {mountPropertiesController && (
        <PropertiesEditController activeElement={activeElement} />
      )}
      <div className="flex items-center gap-4">
        <Button
          className="flex items-center gap-2"
          variant="ghost"
          aria-label="Submit"
          onClick={resetToOriginalComponent}
          disabled={isResetting || !editableMode}
        >
          {isResetting ? (
            <>
              Resetting
              <Loader2 className="h-4 w-4 animate-spin" />
            </>
          ) : (
            <>
              Reset
              <RefreshCcw className="h-4 w-4" />
            </>
          )}
        </Button>

        <Button
          disabled={!saveState.dirty || saveState.saving}
          onClick={saveComponentHandler}
          className="flex items-center gap-2"
        >
          {saveState.saving ? (
            <>
              Saving
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
