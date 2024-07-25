import { getBuildServerBaseUrl } from "@/lib/env";
import { getWorkspaceData } from "./generated-workspace";

export async function getTemplateData(id: string, name: string = "test") {
  const res = await fetch(
    `${getBuildServerBaseUrl()}/playground/template?template=${id}&projectName=${name}`
  );

  const data = await res.text();

  return getWorkspaceData(data);
}

export async function getTemplateNames() {
  const res = await fetch(`${getBuildServerBaseUrl()}/playground/templates`);
  const data = await res.json();

  return data as string[];
}