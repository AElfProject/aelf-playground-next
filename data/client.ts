import useSWR from "swr";
import { db } from "./db";

export function useWorkspaces() {
  return useSWR("workspaces", async () => {
    return await db.workspaces.toArray();
  });
}
