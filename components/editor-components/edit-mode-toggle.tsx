"use client";

import { useEditor } from "./editor-provider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface EditModeToggleProps {
  className?: string;
}

export function EditModeToggle({ className }: EditModeToggleProps) {
  const { editableMode, toggleEditableMode } = useEditor();

  return (
    <div className={cn("flex items-center justify-between gap-3 ", className)}>
      <div className="flex items-center gap-2">
        <Label htmlFor="edit-mode-toggle" className="text-sm font-medium">
          Preview
        </Label>
      </div>

      <Switch
        id="edit-mode-toggle"
        checked={!editableMode}
        onCheckedChange={toggleEditableMode}
      />
    </div>
  );
}
