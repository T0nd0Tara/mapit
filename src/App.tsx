import RequestPanel from "./components/request-panel";
import { FileExplorer } from "./components/file-explorer";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./components/ui/resizable";

export default function App() {

  return (
    <div className="w-dvw h-dvh p-3">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={30}>
          <FileExplorer />
        </ResizablePanel>
        <ResizableHandle withHandle className="mx-2" />
        <ResizablePanel minSize={50}>
          <RequestPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
