"use client";

import React, { useEffect, useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { csharp } from "@replit/codemirror-lang-csharp";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { useTheme } from "next-themes";
import { StreamLanguage } from "@codemirror/language";
import { protobuf } from "@codemirror/legacy-modes/mode/protobuf";
import { getLang, Languages } from "./editor-enum";
import { xml } from "@codemirror/legacy-modes/mode/xml";
import { usePathname, useSearchParams } from "next/navigation";
import { db } from "@/data/db";
import { useDebounce } from "use-debounce";

export default function Editor({ defaultValue }: { defaultValue?: string }) {
  const path = usePathname();
  const params = useSearchParams();
  const file = params.get("file");
  const pathname = `${path}/${file}`;

  const { theme, systemTheme } = useTheme();

  const currentTheme = theme !== "system" ? theme : systemTheme;
  const editorTheme = currentTheme === "light" ? githubLight : githubDark;

  const [value, setValue] = React.useState(defaultValue || "");
  const [debouncedValue] = useDebounce(value, 100);

  const lang = getLang(pathname);

  const extensions = useMemo(() => {
    switch (lang) {
      case Languages.CSHARP:
        return Array.from([csharp()]);
      case Languages.PROTOBUF:
        return Array.from([StreamLanguage.define(protobuf)]);
      case Languages.XML:
        return Array.from([StreamLanguage.define(xml)]);
      default:
        return Array.from([]);
    }
  }, [lang]);

  const onChange = React.useCallback((val: string, viewUpdate: any) => {
    setValue(val);
  }, []);

  useEffect(() => {
    (async () => {
      const existing = await db.files.get(pathname);

      if (existing) {
        setValue(existing.contents);
      } else {
        if (!pathname.includes("null"))
          await db.files.add({ path: pathname, contents: value });
      }
    })();
  }, [pathname]);

  useEffect(() => {
    (async () => {
      if (!pathname.includes("null"))
        await db.files.update(pathname, { contents: debouncedValue });
    })();
  }, [debouncedValue, pathname]);

  return (
    <CodeMirror
      value={value}
      height="1000px"
      theme={editorTheme}
      extensions={extensions}
      onChange={onChange}
    />
  );
}
