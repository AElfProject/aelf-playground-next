type TransactionParty = {
  name: string | null;
  address: string;
  addressType: number;
  isManager: boolean;
  isProducer: boolean;
};

export type Transaction = {
  transactionId: string;
  blockHeight: number;
  method: string;
  status: number;
  from: TransactionParty;
  to: TransactionParty;
  timestamp: number;
  transactionValue: string;
  transactionFee: string;
  blockTime: string;
  chainIds: string[];
};
export type Transactions = Array<Transaction>;
