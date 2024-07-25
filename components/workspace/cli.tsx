"use client";

import { build } from "@/data/build";
import { db } from "@/data/db";
import {
  getProposalInfo,
  useDeploy,
  useLogs,
  useTransactionResult,
} from "@/data/wallet";
import { useTheme } from "next-themes";
import { useParams } from "next/navigation";
import { ReactTerminal } from "react-terminal";
import { z } from "zod";

export default function Cli() {
  const { id } = useParams();
  const deploy = useDeploy();
  const getResult = useTransactionResult();
  const getLogs = useLogs();
  const commands = {
    help: () => (
      <div>
        <p>These are the available commands:</p>
        <ol>
          <li className="ml-8">clear - clears the terminal</li>
          <li className="ml-8">build - builds the current workspace</li>
          <li className="ml-8">deploy - deploys the built smart contract</li>
          <li className="ml-8">
            check txID - checks the result of transaction
          </li>
        </ol>
      </div>
    ),
    build: async () => {
      if (typeof id !== "string") throw new Error("id is not string");
      const start = `/workspace/${id}/`;
      const files = await db.files
        .filter((file) => file.path.startsWith(start))
        .toArray();
      const params = files
        .map((file) => ({
          path: decodeURIComponent(file.path.replace(start, "")),
          contents: file.contents,
        }))
        .filter((i) => i.path.startsWith("src"));

      const str = await build(params);
      await db.workspaces.update(id, { dll: str });

      return "Build successful.";
    },
    deploy: async () => {
      if (typeof id !== "string") return "Workspace id not found.";
      const { dll } = (await db.workspaces.get(id)) || {};
      if (!dll) return "Contract not built. Please build first.";
      const { TransactionId } = await deploy(dll);
      try {
        const result: { TransactionId: string; Status: string } =
          await getResult(TransactionId);
        return `TransactionId: ${TransactionId}, Status: ${result.Status}`;
      } catch (err) {
        return JSON.stringify(err, undefined, 2);
      }
    },
    check: async (id: string) => {
      if (!id) return `Please enter the Transaction ID.`;
      try {
        const result = await getResult(id);
        const logs = await getLogs(id);
        const { data } = z.object({ proposalId: z.string() }).safeParse(logs);
        const proposalInfo = await getProposalInfo(data?.proposalId);
        const releasedTxId = proposalInfo?.data.proposal.releasedTxId;
        const releasedTxLogs = releasedTxId
          ? await getLogs(releasedTxId)
          : undefined;
        const { data: contractAddressData } = z
          .object({ address: z.string() })
          .safeParse(releasedTxLogs);

        return (
          <>
            <table className="mt-4">
              <tr>
                <td className="pr-4">TransactionId:</td>
                <td>{id}</td>
              </tr>
              <tr>
                <td>Status:</td>
                <td>{result.Status}</td>
              </tr>
              <tr>
                <td>ProposalId:</td>
                <td>{data?.proposalId}</td>
              </tr>
              <tr>
                <td>Proposal Status:</td>
                <td>{proposalInfo?.data.proposal.status}</td>
              </tr>
              <tr>
                <td>Contract Address:</td>
                <td>
                  {proposalInfo?.data.proposal.status === "released"
                    ? contractAddressData?.address
                    : "-"}
                </td>
              </tr>
            </table>
          </>
        );
      } catch (err) {
        return JSON.stringify(err, undefined, 2);
      }
    },
  };

  const { theme, systemTheme } = useTheme();

  return (
    <ReactTerminal
      commands={commands}
      prompt="#"
      theme={theme !== "system" ? theme : systemTheme}
      showControlBar={false}
      welcomeMessage={
        <div>
          <p>Welcome to AElf Playground.</p>
          <p>Type help to see all commands.</p>
        </div>
      }
    />
  );
}
