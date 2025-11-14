import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Undo2, Redo2, Save } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TypographyEditController } from "@/components/ui/typography-edit-controller";
import { EditorProvider } from "@/components/editor-components/editor-provider";
import { EditModeToggle } from "@/components/editor-components/edit-mode-toggle";
import UserApp from "@/components/user-components/canvas";
import EditorPreview from "@/components/editor-components/editor-preview";

export default function Page() {
  return (
    <EditorProvider>
      <SidebarProvider>
        <AppSidebar className="z-9999" />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
            <div className="flex items-center">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <EditModeToggle />
            </div>
            <TypographyEditController />
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
          {/* User app area */}
          <EditorPreview>
            <UserApp />
          </EditorPreview>
        </SidebarInset>
      </SidebarProvider>
    </EditorProvider>
  );
}
