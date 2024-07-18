"use client";

import { TerminalContextProvider } from "react-terminal";
import Cli from "@/components/cli";

export default function Bottom() {
  return (
    <TerminalContextProvider>
      <Cli />
    </TerminalContextProvider>
  );
}
