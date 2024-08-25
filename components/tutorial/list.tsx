"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useTutorialList } from "@/data/client";

export function TutorialList() {
  const searchParams = useSearchParams();
  const { data } = useTutorialList();

  const list = useMemo(() => {
    if (!data) return [];

    let all = data;

    const level = searchParams.getAll("level");
    const lang = searchParams.getAll("lang");
    const search = searchParams.get("search");

    if (level.length > 0) all = all.filter((i) => level.includes(i.levelId));

    if (lang.length > 0) all = all.filter((i) => lang.includes(i.langId));

    if (search && search.length > 0)
      all = all.filter(
        (i) =>
          i.title.toLowerCase().includes(search) ||
          i.description.toLowerCase().includes(search)
      );

    return all;
  }, [data, searchParams]);

  return (
    <div className="grid grid-flow-row-dense grid-cols-2 lg:grid-cols-3 gap-8">
      {list.map((i) => (
        <Link key={i.id} href={`/tutorials/${i.id}`}>
          <Card className="flex flex-col h-full">
            <div className="overflow-hidden">
              <Image
                alt="Image"
                width={300}
                height={300}
                className="h-auto w-full object-cover transition-all hover:scale-105"
                src={i.img}
              />
            </div>
            <CardHeader className="flex-grow">
              <CardTitle>{i.title}</CardTitle>
              <CardDescription>{i.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 mr-3">
                {i.level}
              </span>
              <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                {i.lang}
              </span>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
