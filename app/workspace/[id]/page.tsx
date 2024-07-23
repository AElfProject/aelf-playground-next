import TopBottom from "@/components/top-bottom";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import Cli from "@/components/workspace/cli";
import Editor from "@/components/workspace/editor";
import FileExplorer from "@/components/workspace/file-explorer";

export default function Page() {
  return (
    <div className="h-[calc(100vh-40px)]">
      <ResizablePanelGroup direction="horizontal" className="border">
        <ResizablePanel defaultSize={25}>
          <TopBottom top={<FileExplorer />} bottom={<p>Chat component</p>} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75}>
          <TopBottom top={<Editor />} bottom={<Cli />} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
