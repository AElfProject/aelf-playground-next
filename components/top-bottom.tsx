import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ReactNode } from "react";

export default function TopBottom({
  top,
  bottom,
}: {
  top: ReactNode;
  bottom: ReactNode;
}) {
  return (
    <div className="h-[calc(100vh-40px)]">
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={70} className="overflow-y-auto">
          {top}
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={30}>{bottom}</ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
