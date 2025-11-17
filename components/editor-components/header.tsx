"use client";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Undo2, Redo2, Save } from "lucide-react";
import { TypographyEditController } from "@/components/editor-components/typography-edit-controller";
import { EditModeToggle } from "@/components/editor-components/edit-mode-toggle";

import { SidebarTrigger } from "../ui/sidebar";
import { useEditor } from "./editor-provider";

export default function Header() {
  const { activeElement, editableMode, elementType } = useEditor();
  const mountTypography =
    editableMode && activeElement && elementType === "text";
  return (
    <header className="flex h-16 shrink-0 items-center bg-white sticky top-0 justify-between gap-2 border-b px-4">
      <div className="flex items-center relative">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <EditModeToggle />
      </div>
      {mountTypography && (
        <TypographyEditController activeElement={activeElement} />
      )}
      <div className="flex items-center">
        <Button variant="ghost" size="icon" aria-label="Submit" disabled>
          <Undo2 />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Submit" disabled>
          <Redo2 />
        </Button>
        <Button className="ml-2" size="sm" aria-label="Submit" disabled>
          Save
          <Save />
        </Button>
      </div>
    </header>
  );
}
