"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { db, FileContent } from "@/data/db";
import { useCallback, useState } from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { usePathname } from "@/lib/use-pathname";
import { useRefreshFileExplorer } from "@/components/file-explorer";
import { Tooltip } from "../tooltip";

export default function UploadModal() {
  const refreshFileExplorer = useRefreshFileExplorer();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const onDrop = useCallback<NonNullable<DropzoneOptions["onDrop"]>>(
    async (acceptedFiles) => {
      let all: FileContent[] = [];

      acceptedFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = () => {
          // Do whatever you want with the file contents
          const binaryStr = reader.result;
          if (binaryStr instanceof ArrayBuffer) {
            const contents = Buffer.from(binaryStr).toString("utf-8");
            // @ts-expect-error
            const filename = file.path!;

            all.push({ path: filename.slice(1), contents });
          }
        };
        reader.readAsArrayBuffer(file);
      });

      try {
        await db.workspaces.delete(pathname);
        await db.files.bulkDelete(
          (await db.files.toArray())
            .map((i) => i.path)
            .filter((i) => i.startsWith(pathname + "/"))
        );

        await db.workspaces.add({
          name: pathname,
          template: "file-upload",
          dll: "",
        });

        const templateData: { path: string; contents: string }[] = all;

        await db.files.bulkAdd(
          templateData.map(({ path, contents }) => ({
            path: `${pathname}/${path}`,
            contents,
          }))
        );

        await refreshFileExplorer();
        setIsOpen(false);
      } catch (err) {
        alert(String(err));
      }
    },
    []
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Tooltip text="Upload Files">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
            <Upload className="h-4 w-4" />
          </Button>
        </Tooltip>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            <div {...getRootProps()} className="p-8 border">
              <input {...getInputProps()} />
              <p>
                Drag &apos;n&apos; drop some files here, or click to select
                files
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
