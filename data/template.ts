import { getBuildServerBaseUrl } from "@/lib/env";
import { unzipSync } from "fflate";

export async function getTemplateData(id: string, name: string = "test") {
  const res = await fetch(
    `${getBuildServerBaseUrl()}/playground/template?template=${id}&projectName=${name}`
  );

  const data = await res.text();

  const zipData = Buffer.from(data, "base64");

  return unzipSync(zipData);
}

export async function getTemplateNames() {
  const res = await fetch(`${getBuildServerBaseUrl()}/playground/templates`);
  const data = await res.json();

  return data as string[];
}