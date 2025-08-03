// src/components/treasury/financials/types.ts
export interface FinancialMetric {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
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

export interface RoyaltyStatement {
  id: string;
  source: 'Spotify' | 'ASCAP' | 'Apple Music' | 'YouTube Music';
  artist: string;
  period: string;
  amount: number;
  status: 'processed' | 'discrepancy' | 'pending';
  uploadDate: string;
}

export interface SplitSheetCollaborator {
  name: string;
  role: string;
  split: number;
}

export interface SplitSheet {
  id: string;
  songTitle: string;
  primaryArtist: string;
  status: 'approved' | 'draft' | 'pending';
  collaborators: SplitSheetCollaborator[];
}

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};