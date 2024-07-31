"use client";
import React, { useEffect, useState, useRef } from 'react';
import { DeepChat } from 'deep-chat-react';
import { useThread } from '@/providers/threadProvider';

interface DeepChatProps {
  // other props
  mode: string; // Adjust the type according to your needs
  onFile?: (file: any) => void;
}

export async function stream(url : string, payload : any, update: (arg0: string) => void) {
  const response = await fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(payload)
  })

  if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
  }

  if (!response.body) {
      throw new Error('No response body)')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let partial: string | undefined = ''
  while (true) {
      const { done, value } = await reader.read()
      if (done) {
          break
      }
      partial += decoder.decode(value)
      const lines: string[] = partial?.split('\n') || [];
      partial = lines.pop()
      for (const line of lines) {
          update(line)
      }
  }
  if (partial) {
      update(partial)
  }
}

export const ChatBot: React.FC<DeepChatProps> = ({ mode, onFile }) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const { threadId, setThreadId } = useThread();

  useEffect(() => {
    setIsBrowser(true);
    console.log('Deep Chat mounted');
  }, []);

  const sendMessage = async (body: any, signals: any, mode: string) => {
    
    console.log('Sending thread ID:', window.sessionStorage.getItem('thread_id'));
    body = { ...(window.sessionStorage.getItem('thread_id') && { thread_id: window.sessionStorage.getItem('thread_id') }), ...body };

    stream('http://localhost:5555/create-stream', body, (data) => {
      try {
        console.log(data);

        if (data.includes("thread_id")) {
          const jsonString = data.match(/{.*}/)?.[0];
          if (jsonString) {
            const jsonObject = JSON.parse(jsonString);
            if(jsonObject.thread_id !== undefined) {
              window.sessionStorage.setItem('thread_id', jsonObject.thread_id);
              setThreadId(jsonObject.thread_id);
            }
          }
        }
        if (data.includes("file")) {
          const jsonString = data.match(/{.*}/)?.[0];
          if (jsonString) {
            const jsonObject = JSON.parse(jsonString);
            if (onFile) {
              onFile(jsonObject.file);
            }
          }
        }
        if (data.includes("end")) {
          const jsonString = data.match(/{.*}/)?.[0];
          if (jsonString) {
            const jsonObject = JSON.parse(jsonString);
            if(jsonObject.end !== undefined) {
              signals.onClose();
              return
            }
          }
        }

        signals.onResponse({ text: data, role: 'ai' });
      } catch (error) {
        console.error("Error during streaming:", error);
      }
    });

    return;
    
    let url = 'http://localhost:5555/chat';
    if(mode == "create")
    {
      url = 'http://localhost:5555/create';
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
        setThreadId(jsonObject.thread_id);
        if(jsonObject.file !== undefined)
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
    <div style={{ width: '100%', height: '100%' }}>
      <DeepChat
        style={{ borderRadius: '10px', width: '100%', height: '100%' }}
        introMessage={{ text: 'Send a chat message to create a smart contract.' }}
        connect={{
          handler: (body, signals) => sendMessage(body, signals, mode), stream: true,
        }}
        requestBodyLimits={{ maxMessages: -1 }}
        errorMessages={{ displayServiceErrorMessages: true }}
      />
    </div>
  );
};