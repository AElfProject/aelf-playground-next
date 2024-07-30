"use client";
import React, { useEffect, useState, useRef } from 'react';
import { DeepChat } from 'deep-chat-react';
import { useThread } from '@/providers/threadProvider';

interface DeepChatProps {
  // other props
  mode: string; // Adjust the type according to your needs
  onFile?: (file: any) => void;
}

export const ChatBot: React.FC<DeepChatProps> = ({ mode, onFile }) => {
  //const router = useRouter();
  const [isBrowser, setIsBrowser] = useState(false);
  const { threadId, setThreadId } = useThread();

  useEffect(() => {
    setIsBrowser(true);
    console.log('Deep Chat mounted');
  }, []);

  const sendMessage = async (body: any, signals: any, mode: string) => {
    let url = 'http://localhost:5555/chat';
    if(mode == "create")
    {
    //  url = 'http://localhost:5555/create';
    }

    const headers = { 'Content-Type': 'application/json' };
    const requestBody = {
      messages: body.messages,
      ...(threadId && { thread_id: threadId }),
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
        setThreadId((prev) => prev || jsonObject.thread_id);
        //if(jsonObject.file !== undefined)
        {
          if (onFile) {
            onFile(jsonObject.file);
          }
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