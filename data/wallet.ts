"use client";

import useSWR from "swr";
import { db } from "./db";
// @ts-ignore
import AElf from "aelf-sdk";
import BigNumber from "bignumber.js";
import { ProposalInfo } from "./proposal-info-types";
const { deserializeLog } = AElf.pbUtils;

const aelf = new AElf(
  new AElf.providers.HttpProvider("https://tdvw-test-node.aelf.io")
);

export function useWallet() {
  const { data: privateKey } = useSWR("wallet", async () => {
    const existingWallets = await db.wallet.toArray();

    if (existingWallets.length === 0) {
      const newWallet = AElf.wallet.createNewWallet();
      await db.wallet.add({ privateKey: newWallet.privateKey });
      const res = await (
        await fetch(
          `https://faucet.aelf.dev/api/claim?walletAddress=${newWallet.address}`,
          { method: "POST" }
        )
      ).json();
    } else {
      return existingWallets[0].privateKey;
    }
  });

  if (!privateKey) return;

  const wallet = AElf.wallet.getWalletByPrivateKey(privateKey);

  return wallet;
}

function useChainStatus() {
  const { data } = useSWR("chainstatus", async () => {
    return await aelf.chain.getChainStatus();
  });

  return data as { GenesisContractAddress: string };
}

function useContract(address: string) {
  const wallet = useWallet();
  const { data } = useSWR(
    wallet && address ? `contract-${address}` : null,
    async () => {
      return await aelf.chain.contractAt(address, wallet);
    }
  );

  return data;
}

function useContractAddressByName(name: string) {
  const chainStatus = useChainStatus();
  const genesisContract = useContract(chainStatus.GenesisContractAddress);

  const { data } = useSWR(
    genesisContract ? `${name}-address` : null,
    async () => {
      return await genesisContract.GetContractAddressByName.call(
        AElf.utils.sha256(name)
      );
    }
  );

  return data;
}

function useTokenContractAddress() {
  return useContractAddressByName(`AElf.ContractNames.Token`);
}

export function useTokenContract() {
  const tokenContractAddress = useTokenContractAddress();
  return useContract(tokenContractAddress);
}

function useBalance() {
  const tokenContract = useTokenContract();
  const wallet = useWallet();
  const { data } = useSWR(
    tokenContract && wallet ? `balance` : null,
    async () => {
      return await tokenContract.GetBalance.call({
        symbol: "ELF",
        owner: wallet.address,
      });
    }
  );

  return data as {
    symbol: string;
    owner: string;
    balance: string;
  };
}

export function useBalanceInELF() {
  const balance = useBalance();
  return new BigNumber(balance.balance).dividedBy(10 ** 8).toFixed(5);
}

function useGenesisContract() {
  const chainstatus = useChainStatus();
  return useContract(chainstatus?.GenesisContractAddress);
}

export function useDeploy() {
  const genesisContract = useGenesisContract();

  const deploy = async (code: string) => {
    return (await genesisContract.DeployUserSmartContract({
      category: 0,
      code,
    })) as { TransactionId: string };
  };

  return deploy;
}

export function useTransactionResult() {
  return async (id: string) => {
    return await aelf.chain.getTxResult(id);
  };
}

let cached: Record<string, any> = {};

async function getProto(address: string) {
  const key = aelf.currentProvider.host + "_" + address;
  if (!cached[key])
    cached[key] = await aelf.chain.getContractFileDescriptorSet(address);
  return AElf.pbjs.Root.fromDescriptor(cached[key]);
}

export function useLogs() {
  return async (txId: string) => {
    try {
      const txResult = await aelf.chain.getTxResult(txId);

      const deserializeLogs = async () => {
        const services = await Promise.all(
          txResult.Logs.map(
            async ({ Address }: { Address: string }) => await getProto(Address)
          )
        );

        const deserializedLogs: Array<{ proposalId: string }> =
          await deserializeLog(txResult.Logs, services);

        return deserializedLogs.reduce((acc, cur) => ({ ...acc, ...cur }), {});
      };

      return await deserializeLogs();
    } catch (err: unknown) {
      return err;
    }
  };
}

export async function getProposalInfo(proposalId?: string) {
  const res = await fetch(`/api/get-proposal-info?id=${proposalId}`);
  const data: ProposalInfo = await res.json();

  return data;
}