import { unzipSync } from "fflate";

export async function getWorkspaceData(file: string) {
  const zipData = Buffer.from(file, "base64");

  return unzipSync(zipData);
}