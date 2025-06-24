export interface AccountInfo {
  accountNumber: string;
  routingNumber: string;
  balance: number;
  currency: string;
  type: "checking" | "savings" | "multi-currency";
  status: "active" | "paused" | "inactive";
  creationDate: string;
  lastActivity: string;
}

export interface Transaction {
  id: string;
  type: "incoming" | "outgoing";
  amount: number;
  date: string;
  description: string;
  status: "completed" | "pending" | "failed";
  counterparty: string;
}

export const transactionHistory: Transaction[] = [
  { 
    id: "tx1", 
    type: "incoming", 
    amount: 2500, 
    date: "2023-06-15T10:30:00Z", 
    description: "Commission payment",
    status: "completed",
    counterparty: "MarketplaceX"
  },
  { 
    id: "tx2", 
    type: "outgoing", 
    amount: 320.50, 
    date: "2023-06-12T15:45:00Z", 
    description: "API subscription renewal",
    status: "completed",
    counterparty: "CloudServices Inc."
  },
  { 
    id: "tx3", 
    type: "incoming", 
    amount: 1750, 
    date: "2023-06-05T09:15:00Z", 
    description: "Royalty payment",
    status: "completed",
    counterparty: "Content Network"
  },
  { 
    id: "tx4", 
    type: "outgoing", 
    amount: 89.99, 
    date: "2023-06-02T11:20:00Z", 
    description: "Data storage fee",
    status: "completed",
    counterparty: "DataVault Pro"
  },
  { 
    id: "tx5", 
    type: "outgoing", 
    amount: 1200, 
    date: "2023-06-01T16:30:00Z", 
    description: "Content creation service",
    status: "pending",
    counterparty: "CreativeMinds Agency"
  },
];

export const defaultAccountInfo: AccountInfo = {
  accountNumber: "4218-7643-9025-1103",
  routingNumber: "072541836",
  balance: 4539.51,
  currency: "USD",
  type: "checking",
  status: "active",
  creationDate: "2023-01-15",
  lastActivity: "2023-06-15T10:30:00Z"
};

export const formatCurrency = (amount: number, currency = "USD") => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getStatusColor = (status: string) => {
  switch(status) {
    case "completed":
      return "bg-green-500/30 text-green-300";
    case "pending":
      return "bg-yellow-500/30 text-yellow-300";
    case "failed":
      return "bg-red-500/30 text-red-300";
    default:
      return "bg-gray-500/30 text-gray-300";
  }
};