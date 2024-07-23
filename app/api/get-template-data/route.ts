import { getTemplateData } from "@/data/template";
import { strFromU8 } from "fflate";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id"),
    name = searchParams.get("name");

  if (!id) {
    throw new Error("no id");
  }
  if (!name) {
    throw new Error("no name");
  }

  const res = await getTemplateData(id, name);

  const data = Object.entries(res).map(([key, value]) => ({
    path: encodeURIComponent(key),
    contents: strFromU8(value),
  }));

  return Response.json(data);
}
