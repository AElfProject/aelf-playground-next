"use client";

import useSWR from "swr";
import { db } from "./db";
import AElf from "aelf-sdk";
import { useSettings } from "@/components/providers/settings-provider";

export function useWallet() {
  const { settings } = useSettings();
  const { data: privateKey } = useSWR("wallet", async () => {
    const existingWallets = await db.wallet.toArray();

    if (existingWallets.length === 0) {
      const newWallet = AElf.wallet.createNewWallet();
      await db.wallet.add({ privateKey: newWallet.privateKey });
      return newWallet.privateKey as string;
    } else {
      return existingWallets[0].privateKey;
    }
  });

  if (!privateKey) return;

  if (settings.localNode) {
    return new Wallet(
      "1111111111111111111111111111111111111111111111111111111111111111",
      settings.endpoint
    );
  }

  return new Wallet(privateKey, settings.endpoint);
}

class Wallet {
  privateKey;
  wallet;
  cached: Record<string, any> = {};
  aelf;

  constructor(privateKey: string, endpoint = "https://tdvw-test-node.aelf.io") {
    this.privateKey = privateKey;
    this.wallet = AElf.wallet.getWalletByPrivateKey(privateKey);
    this.aelf = new AElf(new AElf.providers.HttpProvider(endpoint));
  }

  private async getChainStatus() {
    return await this.aelf.chain.getChainStatus();
  }

  private getContract(address: string) {
    return this.aelf.chain.contractAt(address, this.wallet);
  }

  private async getGenesisContract() {
    const chainStatus = await this.getChainStatus();
    return await this.getContract(chainStatus.GenesisContractAddress);
  }

  async deploy(code: string, category = 0): Promise<{ TransactionId: string }> {
    const genesisContract = await this.getGenesisContract();

    return await genesisContract.DeployUserSmartContract({
      category: String(category),
      code,
    });
  }

  private async getContractAddressByName(name: string) {
    const genesisContract = await this.getGenesisContract();

    return await genesisContract.GetContractAddressByName.call(
      AElf.utils.sha256(name)
    );
  }

  private async getTokenContractAddress() {
    return await this.getContractAddressByName("AElf.ContractNames.Token");
  }

  async getTokenContract() {
    const address = await this.getTokenContractAddress();

    return this.getContract(address);
  }

  async transfer(
    to: string,
    amount: number,
    memo: string
  ): Promise<{ TransactionId: string }> {
    const tokenContract = await this.getTokenContract();

    return await tokenContract.Transfer({
      symbol: "ELF",
      to,
      amount: String(amount),
      memo,
    });
  }

  async auditTransfer(codeHash: string) {
    return await this.transfer(
      `ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx`,
      1,
      codeHash
    );
  }
}
