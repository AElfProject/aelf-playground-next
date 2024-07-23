import {
  GlobeIcon,
  TargetIcon,
  TokensIcon,
  PersonIcon,
} from "@radix-ui/react-icons";

export default function Home() {
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
        <div className="grid w-full max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg border bg-background p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-lg font-semibold">Hello World</h4>
                <p className="text-muted-foreground">The basics.</p>
              </div>
              <div className="bg-primary rounded-full p-2 text-primary-foreground">
                <GlobeIcon className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-background p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-lg font-semibold">Lottery</h4>
                <p className="text-muted-foreground">Medium difficulty.</p>
              </div>
              <div className="bg-primary rounded-full p-2 text-primary-foreground">
                <TargetIcon className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-background p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-lg font-semibold">NFT</h4>
                <p className="text-muted-foreground">Non-fungible Tokens.</p>
              </div>
              <div className="bg-primary rounded-full p-2 text-primary-foreground">
                <TokensIcon className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-background p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-lg font-semibold">Simple DAO</h4>
                <p className="text-muted-foreground">
                  Decentralised Autonomous Organisation.
                </p>
              </div>
              <div className="bg-primary rounded-full p-2 text-primary-foreground">
                <PersonIcon className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
        <h3 className="text-xl font-bold">... or generate from a prompt:</h3>
        <div className="grid w-full max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg border bg-background p-6 shadow-sm">
            <img
              src="/placeholder.svg"
              width={400}
              height={225}
              alt="Deepchat here"
              className="aspect-video object-cover rounded-md"
            />
          </div>
          <div className="space-y-4">
            <h4 className="text-2xl font-bold">DeepChat AI</h4>
            <p className="text-muted-foreground">Some description.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
