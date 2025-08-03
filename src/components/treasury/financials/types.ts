// src/components/treasury/financials/types.ts
export interface FinancialMetric {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
}

export interface RevenueStream {
  name: "Streaming" | "Gigs" | "Merch" | "Sync & Licensing" | "Beats" | "Studio Time";
  icon: React.ElementType;
  color: string;
  total: number;
  transactions: {
    id: string;
    source: string;
    amount: number;
    date: string;
  }[];
}

export interface Expense {
    id: string;
    category: "Payroll" | "Marketing" | "Production" | "Travel" | "Software";
    description: string;
    amount: number;
    date: string;
}

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    paymentType: 'split' | 'salary';
    rate: string;
    nextPayment: string;
}

export interface Deal {
    id: string;
    project: string;
    type: "Sync" | "Brand Partnership" | "License";
    amount: number;
    status: "Pending" | "Paid" | "Negotiating";
    dueDate: string;
}

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};