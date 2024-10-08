"use client";

import { useWebContainer } from "@/components/webcontainer/use-web-container";
import { useEffect, useRef } from "react";

export function Preview() {
  const webContainer = useWebContainer();
  const iframeElRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!!webContainer && !!iframeElRef.current) {
      webContainer.on("server-ready", (port, url) => {
        if (!!iframeElRef.current) iframeElRef.current.src = url;
      });
    }
  }, [webContainer, iframeElRef.current]);

  if (!webContainer) return <p>Loading...</p>;

  return (
    <div className="w-full h-full">
      <h1 className="text-xl">Preview will be shown here</h1>
      <iframe ref={iframeElRef} className="w-full h-full" />
    </div>
  );
}
