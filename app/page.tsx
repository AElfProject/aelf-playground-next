import CreateWorkspaceChat from "@/components/create-workspace-chat";
import {
  GlobeIcon,
  TargetIcon,
  TokensIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { ReactNode } from "react";

function HomeCard({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-background p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-lg font-semibold">{title}</h4>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        <div className="bg-primary rounded-full p-2 text-primary-foreground">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function Home() {

  const links = [
    {
      title: "Hello World",
      subtitle: "The basics.",
      icon: <GlobeIcon className="h-6 w-6" />,
    },
    {
      title: "Lottery",
      subtitle: "Medium difficulty.",
      icon: <TargetIcon className="h-6 w-6" />,
    },
    {
      title: "NFT",
      subtitle: "Non-fungible tokens.",
      icon: <TokensIcon className="h-6 w-6" />,
    },
    {
      title: "Simple DAO",
      subtitle: "Decentralised Autonomous Org.",
      icon: <PersonIcon className="h-6 w-6" />,
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container grid items-center justify-center gap-8 px-4 md:px-6">
        <div className="space-y-4 text-center">
          <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
            AElf Playground
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Get started coding smart contracts.
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            An online playground to develop and deploy
            <br />
            smart contracts on the aelf blockchain.
          </p>
        </div>
        <h3 className="text-xl font-bold">Choose from a template...</h3>
        <Link href="/workspaces">
          <div className="grid w-full max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
            {links.map((link) => (
              <HomeCard key={link.title} {...link} />
            ))}
          </div>
        </Link>

        <h3 className="text-xl font-bold">... or generate from a prompt:</h3>
        <CreateWorkspaceChat />
      </div>
    </section>
  );
}
