"use server";

import { getBuildServerBaseUrl } from "@/lib/env";
import { strToU8, Zippable, zipSync } from "fflate";
import { FileContent } from "./db";
import { v4 as uuidv4 } from "uuid";

export async function build(files: FileContent[]) {
  const data: Zippable = files.reduce((acc, { path, contents }) => {
    acc[path] = strToU8(contents);

    return acc;
  }, {} as Zippable);

  const zippedData = zipSync(data);

  const formData = new FormData();
  const filePath = uuidv4() + ".zip";
  formData.append(
    "contractFiles",
    new File([zippedData], filePath, { type: "application/zip" }),
    filePath
  );

  const requestInit: RequestInit = {
    method: "POST",
    body: formData,
    redirect: "follow",
  };

  const response = await fetch(
    `${getBuildServerBaseUrl()}/playground/build`,
    requestInit
  );
  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  return await response.text();
}
