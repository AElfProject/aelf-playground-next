import {
    GlobeIcon,
    TargetIcon,
    TokensIcon,
    PersonIcon,
    ListBulletIcon,
    MixIcon,
    IdCardIcon,
    StackIcon,
  } from "@radix-ui/react-icons";
  import { Link } from "react-router-dom";
  import { ReactNode } from "react";
  
  function HomeCard({
    title,
    subtitle,
    icon,
    template,
  }: {
    title: string;
    subtitle: string;
    icon: ReactNode;
    template: string;
  }) {
    return (
      <Link to={`/workspaces?template=${template}`}>
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
      </Link>
    );
  }
  
  export function Component() {
    const links = [
      {
        title: "Hello World",
        subtitle: "The basics.",
        icon: <GlobeIcon className="h-6 w-6" />,
        template: "aelf-hello-world",
      },
      {
        title: "Lottery",
        subtitle: "Medium difficulty.",
        icon: <TargetIcon className="h-6 w-6" />,
        template: "aelf-lottery",
      },
      {
        title: "NFT",
        subtitle: "Non-fungible tokens.",
        icon: <TokensIcon className="h-6 w-6" />,
        template: "aelf-nft-sale",
      },
      {
        title: "Simple DAO",
        subtitle: "Decentralised Autonomous Org.",
        icon: <PersonIcon className="h-6 w-6" />,
        template: "aelf-simple-dao",
      },
      {
        title: "ToDo",
        subtitle: "A basic ToDo smart contract",
        icon: <ListBulletIcon className="h-6 w-6" />,
        template: "aelf-todo",
      },
      {
        title: "Tic Tac Toe",
        subtitle: "Decentralised gamify contract",
        icon: <MixIcon className="h-6 w-6" />,
        template: "aelf-tictactoe",
      },
      {
        title: "Expense Tracker",
        subtitle: "Expense organizer",
        icon: <IdCardIcon className="h-6 w-6" />,
        template: "aelf-expense",
      },
      {
        title: "Single Pool Staking",
        subtitle: "Token staking",
        icon: <StackIcon className="h-6 w-6" />,
        template: "aelf-staking",
      },
    ];
  
    return (
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container grid items-center justify-center gap-8 px-4 md:px-6">
          <div className="space-y-4 text-center">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
              aelf Playground
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
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
            {links.map((link) => (
              <HomeCard key={link.title} {...link} />
            ))}
          </div>
          <h3 className="text-xl font-bold">
            ... or enter a{" "}
            <Link to="/import" className="hover:underline">
              GitHub repo url (click here)
            </Link>{" "}
          </h3>
          {/* <h3 className="text-xl font-bold">... or generate from a prompt:</h3>
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg border bg-background p-6 shadow-sm">
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-2xl font-bold">DeepChat AI</h4>
              <p className="text-muted-foreground">Coming soon.</p>
            </div>
          </div> */}
        </div>
      </section>
    );
  }
  