import Header from "@/components/editor-components/header";
import { EditorProvider } from "@/context/editor-provider";
import ComponentEditor from "@/components/editor-components/component-editor";
import UserComponentLoader from "@/components/user-components-loader";

export default function Page() {
  return (
    <EditorProvider>
      <Header />
      <ComponentEditor userComponent={<UserComponentLoader />} />
    </EditorProvider>
  );
}
