import Header from "@/components/editor-components/header";
import { EditorProvider } from "@/components/editor-components/editor-provider";
import ComponentEditor from "@/components/editor-components/component-editor";
import UserComponentLoader from "@/components/user-components-loader";
import { Toaster } from "@/components/ui/sonner";

export default function Page() {
  return (
    <EditorProvider>
      <Header />
      <ComponentEditor component={<UserComponentLoader />} />
    </EditorProvider>
  );
}
