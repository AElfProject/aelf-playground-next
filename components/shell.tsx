"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ReactNode } from "react";
import { TerminalContextProvider } from "react-terminal";

export function Shell({
  left,
  top,
  bottom,
}: {
  left: ReactNode;
  top: ReactNode;
  bottom: ReactNode;
}) {
  return (
    <div className="h-[calc(100vh-40px)]">
      <ResizablePanelGroup direction="horizontal" className="border">
        <ResizablePanel defaultSize={25}>{left}</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={70} className="overflow-y-auto">
              {top}
            </ResizablePanel>
            <ResizableHandle />
            <TerminalContextProvider>
              <ResizablePanel defaultSize={30}>{bottom}</ResizablePanel>
            </TerminalContextProvider>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
