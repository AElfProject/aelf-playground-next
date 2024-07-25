"use client";
import Dexie, { type EntityTable } from "dexie";

interface File {
  path: string;
  contents: string;
}

interface Workspace {
  name: string;
  template: string;
  dll: string;
}

interface Wallet {
  privateKey: string;
}

const db = new Dexie("FileDatabase") as Dexie & {
  files: EntityTable<File, "path">;
  workspaces: EntityTable<Workspace, "name">;
  wallet: EntityTable<Wallet, "privateKey">;
};

// Schema declaration:
db.version(3).stores({
  files: "path, contents",
  workspaces: "name, template, dll",
  wallet: "privateKey",
});

export type { File as FileContent, Workspace, Wallet };
export { db };
