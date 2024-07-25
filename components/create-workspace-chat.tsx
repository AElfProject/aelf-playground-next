"use client";
import { ChatBot } from "@/components/deepchat";
import { db } from "@/data/db";
import { getWorkspaceData } from "@/data/generated-workspace";
import { useRouter } from "next/navigation";
import { strFromU8 } from "fflate";
import { useEffect, useState } from "react";
import { createGUIDHash } from '../lib/crypto';

export default function CreateWorkspaceChat() {

  const [isBrowser, setIsBrowser] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsBrowser(true);
    console.log('Deep Chat mounted');
  }, []);

  return (
    <ChatBot mode="create" onFile={
            async (file) => {
                if(!isBrowser)
                {
                    return;
                }

                const unzipped = getWorkspaceData(file);

                const data = Object.entries(unzipped).map(([key, value]) => ({
                path: encodeURIComponent(key),
                contents: strFromU8(new Uint8Array(value)),
                }));

                console.log(data);
            
                const res = Response.json(data);
                const templateData: { path: string; contents: string }[] = await res.json();

                const workspaceName = 'GeneratedWorkspace' + await createGUIDHash();

                await db.files.bulkAdd(
                templateData.map(({ path, contents }) => ({
                    path: `/workspace/${workspaceName}/${path}`,
                    contents,
                }))
                );
                await router.push(`/workspace/${workspaceName}`);
            }
        } />
  );
}
