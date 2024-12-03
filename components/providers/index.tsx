import { PropsWithChildren } from "react";
import { ThemeProvider } from "./theme-provider";
import { TerminalContextProvider } from "react-terminal";
import { ApolloWrapper } from "./apollo-wrapper";
import { SettingsProvider } from "./settings-provider";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <ApolloWrapper>
        <SettingsProvider>
          <TerminalContextProvider>{children}</TerminalContextProvider>
        </SettingsProvider>
      </ApolloWrapper>
    </ThemeProvider>
  );
}
