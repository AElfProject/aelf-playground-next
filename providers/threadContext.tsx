import { createContext } from "react";

interface ThreadContextProps {
  threadId: string | null;
  setThreadId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const ThreadContext = createContext<ThreadContextProps | undefined>(
  undefined
);
