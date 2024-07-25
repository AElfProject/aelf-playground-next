"use client";
import React, { useEffect, useState, useRef } from 'react';
import { DeepChat } from 'deep-chat-react';
import { getWorkspaceData } from '@/data/generated-workspace';
import { strFromU8 } from 'fflate';
import { useRouter } from 'next/navigation';
import { db } from "@/data/db";

interface DeepChatProps {
  // other props
  mode: string; // Adjust the type according to your needs
}

export const ChatBot: React.FC<DeepChatProps> = ({ mode }) => {
  const router = useRouter();
  const [isBrowser, setIsBrowser] = useState(false);
  const threadId = useRef<string>();

  useEffect(() => {
    setIsBrowser(true);
    console.log('Deep Chat mounted');
  }, []);

  const sendMessage = async (body: any, signals: any, mode: string) => {
    if(mode != "create")
    {
      mode = "chat";
    }

    const url = 'http://localhost:5555/openai-chat';
    const headers = { 'Content-Type': 'application/json' };
    const requestBody = {
      messages: body.messages,
      mode: mode,
      ...(threadId.current && { thread_id: threadId.current }),
    };

    try {
      const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(requestBody) });
      if (!response.ok) {
        const data = await response.json();
        console.log(data);
        return data;
      } else {
        const text = await response.text();
        const jsonObject = JSON.parse(text);
        threadId.current = jsonObject.thread_id;
        if(jsonObject.file !== undefined)
        {
          const unzipped = await getWorkspaceData(jsonObject.file);
        
          console.log(unzipped.Object);

          const data = Object.entries(unzipped.Object).map(([key, value]) => ({
            path: encodeURIComponent(key),
            contents: strFromU8(new Uint8Array(value)),
          }));

          console.log(data);
        
          const res = Response.json(data);
          const templateData: { path: string; contents: string }[] = await res.json();

          await db.files.bulkAdd(
            templateData.map(({ path, contents }) => ({
              path: `/workspace/${'testtemplate'}/${path}`,
              contents,
            }))
          );
          await router.push(`/workspace/${'testtemplate'}`);
        }
        signals.onResponse({ text: jsonObject.text, role: jsonObject.role });
      }
    } catch (e) {
      signals.onResponse({ error: 'Error' }); // displays an error message
    }
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <DeepChat
        style={{ borderRadius: '10px', width: '100%', height: '100%' }}
        introMessage={{ text: 'Send a chat message to create a smart contract.' }}
        connect={{
          handler: (body, signals) => sendMessage(body, signals, mode),
        }}
        requestBodyLimits={{ maxMessages: -1 }}
        errorMessages={{ displayServiceErrorMessages: true }}
      />
    </div>
  );
};