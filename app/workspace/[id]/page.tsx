"use client";

import TopBottom from "@/components/top-bottom";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import Cli from "@/components/workspace/cli";
import Editor from "@/components/workspace/editor";
import FileExplorer from "@/components/workspace/file-explorer";
import { TerminalContextProvider } from "react-terminal";

export default function Page() {
  return (
    <ResizablePanelGroup direction="horizontal" className="border">
      <ResizablePanel defaultSize={25}>
        <TopBottom top={<FileExplorer />} bottom={<p>Chat component</p>} />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>
        <TopBottom
          top={<Editor />}
          bottom={
            <TerminalContextProvider>
              <Cli />
            </TerminalContextProvider>
          }
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
