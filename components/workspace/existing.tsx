"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/data/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { mutate } from "swr";
import { useWorkspaces } from "@/data/client";

export default function Existing() {
  const { data } = useWorkspaces();

  const router = useRouter();

  return (
    <Table>
      <TableCaption>A list of your saved workspaces.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((i) => (
          <TableRow key={i.name}>
            <TableCell className="font-medium w-full">
              <Link href={`/workspace/${i.name}`}>{i.name}</Link>
            </TableCell>
            <TableCell>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  title="Open"
                  onClick={() => router.push(`/workspace/${i.name}`)}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. Are you sure you want to
                        permanently delete this workspace?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="destructive"
                        onClick={async () => {
                          await db.files
                            .filter((file) =>
                              file.path.startsWith(`/workspace/${i.name}`)
                            )
                            .delete();
                          await db.workspaces.delete(i.name);
                          await mutate("workspaces");
                        }}
                      >
                        Delete workspace &quot;{i.name}&quot;
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
