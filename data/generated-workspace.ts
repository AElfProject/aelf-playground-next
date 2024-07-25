import { unzipSync } from "fflate";

export function getWorkspaceData(file: string) {
  const zipData = Buffer.from(file, "base64");

  return unzipSync(zipData);
}