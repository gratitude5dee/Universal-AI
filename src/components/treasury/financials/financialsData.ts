// src/components/treasury/financials/financialsData.ts
import { RevenueStream, Expense, TeamMember, Deal, RoyaltyStatement, SplitSheet } from './types';
import { Music, Mic, ShoppingBag, Tv, FileText, Clapperboard } from 'lucide-react';

export const revenueStreamsData: RevenueStream[] = [
    { name: "Streaming", icon: Music, color: "text-green-400", total: 4250.75, transactions: [{id: 's1', source: 'Spotify', amount: 2800.50, date: '2024-07-28'}] },
    { name: "Gigs", icon: Mic, color: "text-purple-400", total: 7500.00, transactions: [{id: 'g1', source: 'Brooklyn Steel', amount: 5000, date: '2024-07-25'}] },
    { name: "Merch", icon: ShoppingBag, color: "text-blue-400", total: 2130.50, transactions: [{id: 'm1', source: 'Online Store', amount: 850, date: '2024-07-22'}] },
    { name: "Sync & Licensing", icon: Tv, color: "text-orange-400", total: 15000.00, transactions: [{id: 'sl1', source: 'Netflix Show', amount: 10000, date: '2024-07-20'}] },
    { name: "Beats", icon: FileText, color: "text-pink-400", total: 800.00, transactions: [{id: 'b1', source: 'BeatStars', amount: 400, date: '2024-07-18'}] },
    { name: "Studio Time", icon: Clapperboard, color: "text-yellow-400", total: 1200.00, transactions: [{id: 'st1', source: 'Local Artist Booking', amount: 600, date: '2024-07-15'}] },
];

export const expenseData: Expense[] = [
    { id: 'e1', category: 'Payroll', description: 'Manager Commission', amount: 2968.13, date: '2024-07-30' },
    { id: 'e2', category: 'Marketing', description: 'Social Media Ads', amount: 1500, date: '2024-07-25' },
    { id: 'e3', category: 'Production', description: 'Mastering for "The Tape"', amount: 850, date: '2024-07-20' },
];

export const payrollData: TeamMember[] = [
    { id: 'p1', name: 'Alex - Manager', role: 'Manager', paymentType: 'split', rate: '15%', nextPayment: '2024-08-01' },
    { id: 'p2', name: 'Sam - Mixing Engineer', role: 'Engineer', paymentType: 'salary', rate: '$3,000/mo', nextPayment: '2024-08-15' },
];

export const dealData: Deal[] = [
    { id: 'd1', project: 'Indie Film "Neon Sunset"', type: 'Sync', amount: 12500, status: 'Paid', dueDate: '2024-07-15' },
    { id: 'd2', project: 'Aura Headphones Campaign', type: 'Brand Partnership', amount: 25000, status: 'Pending', dueDate: '2024-08-10' },
];

export const royaltyStatementsData: RoyaltyStatement[] = [
  { id: 'rs1', source: 'Spotify', artist: 'Luna Echo', period: 'Q4 2024', amount: 12450.32, status: 'processed', uploadDate: '2025-01-06' },
  { id: 'rs2', source: 'ASCAP', artist: 'Phoenix Rising', period: 'Q4 2024', amount: 8920.15, status: 'discrepancy', uploadDate: '2025-01-03' },
  { id: 'rs3', source: 'Apple Music', artist: 'Luna Echo', period: 'Q4 2024', amount: 7635.88, status: 'processed', uploadDate: '2025-01-04' },
];

export const splitSheetsData: SplitSheet[] = [
  {
    id: 'ss1',
    songTitle: 'Midnight Dreams',
    primaryArtist: 'Luna Echo',
    status: 'approved',
    collaborators: [
      { name: 'Luna Echo', role: 'Artist/Writer', split: 60 },
      { name: 'Mike Producer', role: 'Producer/Writer', split: 30 },
      { name: 'Sarah Keys', role: 'Co-Writer', split: 10 },
    ],
  },
];