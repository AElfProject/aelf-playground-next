"use client";
import React, { useEffect, useState } from 'react';
import { DeepChat } from 'deep-chat-react';

export const ChatBot = () => {
  // demo/style/textInput are examples of passing an object directly into a property
  // history is an example of passing a state object into a property
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <DeepChat
        style={{borderRadius: '10px', width: '100%', height: '100%'}}
        introMessage={{text: 'Send a chat message through an example server to OpenAI.'}}
        connect={{url: 'http://localhost:5555/openai-chat', additionalBodyProps: {assistant_id: 'asst_H11tM7AavEMyXdoyvG6os9ly'}}}
        requestBodyLimits={{maxMessages: -1}}
        errorMessages={{displayServiceErrorMessages: true}}
        />
    </div>
  );
};