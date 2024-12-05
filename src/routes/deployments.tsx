"use client";

import { useWallet } from "@/data/wallet";
import { TableCell, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { useContractList } from "@/data/graphql";
import "./deployment.scss";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/common-table";

export function Component() {
  const wallet = useWallet();
  const { data, loading } = useContractList(wallet?.wallet.address);

  const tableData = useMemo(() => {
    if (data) {
      return data.contractList.items.map((i) => ({
        time: i.metadata.block.blockTime,
        address: i.address,
      }));
    }
    return null;
  }, [data]);

  const columns = [
    { accessorKey: "time", header: "Date and time", isSorting: true },
    { accessorKey: "address", header: "Contract Address", isSorting: false },
  ];

  return (
    <div className="container px-4 py-12 md:px-6 lg:py-16">
      <h1 className="text-2xl mb-2">Past deployments</h1>
      {loading ? (
        <div>Loading...</div>
      ) : tableData ? (
        <div className="mb-2">
          <DataTable
            data={tableData}
            columns={columns}
            filterPlaceholder="Search Address"
            searchKey="address"
          />
        </div>
      ) : (
        <TableRow>
          <TableCell>Loading...</TableCell>
        </TableRow>
      )}
      <h1 className="text-2xl mb-2">Wallet information</h1>
      <p className="mt-3">
        Wallet address:{" "}
        <ViewAddressOnExplorer address={wallet?.wallet.address} />
      </p>
      <p className="mt-2">Privatekey:</p>
      <ViewPrivatekey privateKey={wallet?.wallet.privateKey} />
    </div>
  );
}

function ViewPrivatekey({ privateKey }: { privateKey: string }) {
  const [isVisibleKey, setIsVisibleKey] = useState(false);

  const toggleKey = () => setIsVisibleKey((prev: boolean) => !prev);

  return (
    <div className="flex gap-4 private-key py-2 px-4 mt-1 rounded-xl border-solid border-2 border-grey-900">
      <p className={isVisibleKey ? "key-visible" : ""}>{privateKey}</p>
      <EyeIcon
        className={`cursor-pointer ${isVisibleKey ? "hidden" : ""}`}
        onClick={toggleKey}
      />
      <EyeOffIcon
        className={`cursor-pointer ${!isVisibleKey ? "hidden" : ""}`}
        onClick={toggleKey}
      />
    </div>
  );
}

function ViewAddressOnExplorer({ address }: { address: string }) {
  return (
    <Link
      className="hover:underline"
      to={`https://testnet.aelfscan.io/tDVW/address/ELF_${address}_tDVW`}
      title="View on aelf Explorer"
      target="_blank"
      rel="noopener noreferrer"
    >
      AELF_{address}_tDVW
    </Link>
  );
}
