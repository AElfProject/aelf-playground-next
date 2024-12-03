import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSettings } from "@/components/providers/settings-provider";
import useSWR from "swr";
import { Check, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { codeToHtml } from "shiki";

const code = `docker run --name aelf-node --restart always \\
  -itd -p 6801:6801 -p 8000:8000 -p 5001:5001 -p 5011:5011 \\
  --platform linux/amd64 \\
  --ulimit core=-1 \\
  --security-opt seccomp=unconfined --privileged=true \\
  aelf/standalone-testing-node
`;
const html = await codeToHtml(code, {
  lang: "bash",
  theme: "vitesse-dark",
});

export function Component() {
  const { settings, setSettings } = useSettings();
  const { error } = useSWR(
    "local-node",
    () => fetch("http://localhost:8000/swagger/index.html"),
    {
      refreshInterval: 1000,
    }
  );

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Card className="md:max-w-2xl">
        <CardHeader>
          <CardTitle>Network Preferences</CardTitle>
          <CardDescription>Manage your network settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="local-node">Local node</Label>
            <Switch
              id="local-node"
              checked={settings.localNode}
              onCheckedChange={(localNode) =>
                setSettings((prev) => ({ ...prev, localNode }))
              }
            />
          </div>
          {settings.localNode ? (
            error ? (
              <div className="text-red-500">
                <p>
                  <span className="flex">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> There is
                    an error detecting your local node. Have you started it?
                  </span>
                  <ol className="list-decimal ml-4">
                    <li>
                      First, install{" "}
                      <Link
                        to="https://docs.docker.com/get-started/get-docker/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        Docker
                      </Link>
                      .
                    </li>
                    <li>
                      Run the following command in a new terminal window:
                      <div className="bg-black p-4 ml-[-14px]">
                        <div dangerouslySetInnerHTML={{ __html: html }}></div>
                      </div>
                    </li>
                  </ol>
                </p>
              </div>
            ) : (
              <p className="text-green-600 flex">
                {" "}
                <Check className="h-4 w-4 mr-2" /> Local node detected.
              </p>
            )
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
