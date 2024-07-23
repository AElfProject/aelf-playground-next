"use client";
import Dexie, { type EntityTable } from "dexie";

interface File {
  path: string;
  contents: string;
}

interface Workspace {
  name: string;
  template: string;
}

const db = new Dexie("FileDatabase") as Dexie & {
  files: EntityTable<File, "path">;
  workspaces: EntityTable<Workspace, "name">;
};

// Schema declaration:
db.version(1).stores({
  files: "path, contents",
  workspaces: "name, template",
});

export type { File as FileContent, Workspace };
export { db };
