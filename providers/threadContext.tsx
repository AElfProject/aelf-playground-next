import { createContext } from "react";

interface ThreadContextProps {
    threadId: string | null;
    setThreadId: (id: string) => void;
  }
  
export const ThreadContext = createContext<ThreadContextProps | undefined>(undefined);