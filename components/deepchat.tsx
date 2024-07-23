"use client";
import React, { useEffect, useState, useRef } from 'react';
import { DeepChat } from 'deep-chat-react';

export const ChatBot = () => {
  const [isBrowser, setIsBrowser] = useState(false);
  const threadId = useRef<string>();

  useEffect(() => {
    setIsBrowser(true);
    console.log('Deep Chat mounted');
  }, []);

  const sendMessage = async (body: any, signals: any) => {
    const url = 'http://localhost:5555/openai-chat';
    const headers = { 'Content-Type': 'application/json' };
    const requestBody = {
      messages: body.messages,
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
        introMessage={{ text: 'Send a chat message through an example server to OpenAI.' }}
        connect={{
          handler: sendMessage,
        }}
        requestBodyLimits={{ maxMessages: -1 }}
        errorMessages={{ displayServiceErrorMessages: true }}
      />
    </div>
  );
};