"use client";

import useSWR from "swr";
import { db } from "./db";
import AElf from "aelf-sdk";

const aelf = new AElf(
  new AElf.providers.HttpProvider("https://tdvw-test-node.aelf.io")
);

export function useWallet() {
  const { data: privateKey } = useSWR("wallet", async () => {
    const existingWallets = await db.wallet.toArray();

    if (existingWallets.length === 0) {
      const newWallet = AElf.wallet.createNewWallet();
      await db.wallet.add({ privateKey: newWallet.privateKey });
      try {
        await(
          await fetch(
            `https://faucet.aelf.dev/api/claim?walletAddress=${newWallet.address}`,
            { method: "POST" }
          )
        ).json();
      } catch (err) {}
      return newWallet.privateKey as string;
    } else {
      return existingWallets[0].privateKey;
    }
  });

  if (!privateKey) return;

  return new Wallet(privateKey);
}

class Wallet {
  privateKey;
  wallet;
  cached: Record<string, any> = {};

  constructor(privateKey: string) {
    this.privateKey = privateKey;
    this.wallet = AElf.wallet.getWalletByPrivateKey(privateKey);
  }

  private async getChainStatus() {
    return await aelf.chain.getChainStatus();
  }

  private getContract(address: string) {
    return aelf.chain.contractAt(address, this.wallet);
  }

  private async getGenesisContract() {
    const chainStatus = await this.getChainStatus();
    return await this.getContract(chainStatus.GenesisContractAddress);
  }

  async deploy(code: string): Promise<{ TransactionId: string }> {
    const genesisContract = await this.getGenesisContract();

    return await genesisContract.DeployUserSmartContract({
      category: 0,
      code,
    });
  }
}