import TopBottom from "@/components/top-bottom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Cli from "@/components/workspace/cli";
import Editor from "@/components/workspace/editor";
import FileExplorer from "@/components/workspace/file-explorer";

export default function Home() {
  return (
    <div className="h-[calc(100vh-40px)]">
      <ResizablePanelGroup direction="horizontal" className="border">
        <ResizablePanel defaultSize={25}>
          <TopBottom
            top={<p>Click on the New menu button to begin.</p>}
            bottom={<p>bottom</p>}
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75}>
          <TopBottom
            top={<Editor defaultValue="Welcome to AElf Playground!" />}
            bottom={<Cli />}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
