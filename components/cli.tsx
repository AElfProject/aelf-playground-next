"use client";

import { useTheme } from "next-themes";
import { ReactTerminal } from "react-terminal";

export default function Cli() {
  const commands = {
    whoami: "jackharper",
    cd: (directory: string) => `changed path to ${directory}`,
    help: () => (
      <div>
        <p>These are the available commands:</p>
        <ol>
          <li className="ml-8">clear - clears the terminal</li>
        </ol>
      </div>
    ),
  };

  const { theme, systemTheme } = useTheme();

  return (
    <ReactTerminal
      commands={commands}
      prompt="#"
      theme={theme !== "system" ? theme : systemTheme}
      showControlBar={false}
      welcomeMessage={
        <div>
          <p>Welcome to AElf Playground.</p>
          <p>Type help to see all commands.</p>
        </div>
      }
    />
  );
}
