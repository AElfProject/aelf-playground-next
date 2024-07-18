"use client";

import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { csharp } from "@replit/codemirror-lang-csharp";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { useTheme } from "next-themes";

export default function Editor() {
  const { theme, systemTheme } = useTheme();

  const currentTheme = theme !== "system" ? theme : systemTheme;
  const editorTheme = currentTheme === "light" ? githubLight : githubDark;

  const [value, setValue] = React.useState(`using System;
namespace Test
{
  class Program
  {
    public static void Main(string[] args)
    {
      Console.WriteLine("Hello, world!");
    }
  }
}`);
  const onChange = React.useCallback((val: string, viewUpdate: any) => {
    console.log("val:", val);
    setValue(val);
  }, []);
  return (
    <CodeMirror
      value={value}
      height="1000px"
      theme={editorTheme}
      extensions={[csharp()]}
      onChange={onChange}
    />
  );
}
