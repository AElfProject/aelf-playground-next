"use client";

import useSWR from "swr";
import { db, FileContent } from "./db";
import { ProposalInfo } from "./proposal-info-types";
import AElf from "aelf-sdk";
import { Transactions } from "./transactions-types";
const { deserializeLog } = AElf.pbUtils;

const aelf = new AElf(
  new AElf.providers.HttpProvider("https://tdvw-test-node.aelf.io")
);

export function useWorkspaces() {
  return useSWR("workspaces", async () => {
    return (await db.workspaces.toArray()).filter(
      (i) => !i.name.startsWith("/")
    );
  });
}

export function useTransactionResult(id?: string, refreshInterval?: number) {
  return useSWR<
    {
      TransactionId: string;
      Status: string;
      Logs: Array<{
        Address: string;
        Name: string;
        Indexed: Array<string>;
        NonIndexed: string;
      }>;
      Bloom: string;
      BlockNumber: number;
      BlockHash: string;
      Transaction: {
        From: string;
        To: string;
        RefBlockNumber: number;
        RefBlockPrefix: string;
        MethodName: string;
        Params: string;
        Signature: string;
      };
      ReturnValue: string;
      Error: any;
      TransactionSize: number;
    },
    {
      TransactionId: string;
      Status: string;
      Logs: [];
      Bloom: null;
      BlockNumber: 0;
      BlockHash: null;
      Transaction: null;
      ReturnValue: "";
      Error: string;
      TransactionSize: 0;
    }
  >(
    id ? `tx-${id}` : undefined,
    async () => {
      const res = await aelf.chain.getTxResult(id);

      switch (res?.Status) {
        case "NOTEXISTED":
        case "NODEVALIDATIONFAILED":
          throw res;
      }

      return res;
    },
    { refreshInterval }
  );
}

export function useProposalInfo(id?: string, refreshInterval?: number) {
  return useSWR(
    id ? `get-proposal-info-${id}` : undefined,
    async () => {
      const res = await fetch(`/api/get-proposal-info?id=${id}`);
      const { data }: ProposalInfo = await res.json();

      return data;
    },
    { refreshInterval }
  );
}

export function useLogs(id?: string, refreshInterval?: number) {
  const { data: txResult } = useTransactionResult(id);
  return useSWR(
    id && !!txResult ? `get-logs-${id}` : undefined,
    async () => {
      const services = await Promise.all(
        txResult!.Logs.map(async ({ Address }: { Address: string }) =>
          AElf.pbjs.Root.fromDescriptor(
            await aelf.chain.getContractFileDescriptorSet(Address)
          )
        )
      );

      const deserializedLogs: Array<{ proposalId: string }> =
        await deserializeLog(txResult!.Logs, services);

      return deserializedLogs.reduce(
        (acc, cur) => ({ ...acc, ...cur }),
        {} as Record<string, string>
      );
    },
    { refreshInterval }
  );
}

export function useTransactions(address: string) {
  return useSWR(address ? `transactions-${address}` : undefined, async () => {
    const res = await fetch(`/api/get-transactions?address=${address}`);
    const { data }: { data:{ transactions: Transactions }} = await res.json();

    return data;
  });
}

export function useTutorialList() {
  return useSWR<
    {
      id: string;
      img: string;
      title: string;
      description: string;
      level: string;
      levelId: string;
      lang: string;
      langId: string;
    }[]
  >(`tutorial-list`, async () => {
    const res = await fetch(`/api/get-tutorial-list`);

    const data = await res.json();

    return data;
  });
}

export function useShare(id: string) {
  return useSWR<{ files?: FileContent[]; message?: string; success: boolean }>(
    `get-share-${id}`,
    async () => {
      const res = await fetch(`/api/get-share?id=${id}`);

      const data = await res.json();

      return data;
    }
  );
}
