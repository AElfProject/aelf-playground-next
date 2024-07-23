import { unstable_noStore as noStore } from "next/cache";

export function getBuildServerBaseUrl() {
  noStore();

  return process.env["BUILD_SERVER_BASE_URL"];
}
