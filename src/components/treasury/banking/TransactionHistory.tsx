import React from "react";
import { Button } from "@/components/ui/button";
import { Filter, Download } from "lucide-react";
import { Transaction, formatCurrency, formatDate, getStatusColor, transactionHistory } from "./types";

interface TransactionHistoryProps {
  transactions?: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ 
  transactions = transactionHistory 
}) => {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white animate-text-glow">Transaction History</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs h-8 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
            <Filter className="h-3 w-3 mr-1" /> Filter
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-8 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
            <Download className="h-3 w-3 mr-1" /> Export
          </Button>
        </div>
      </div>
      
      <div className="glass-card rounded-xl overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20 bg-white/5">
                <th className="text-left px-4 py-3 text-xs font-medium text-white text-shadow-sm">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white text-shadow-sm">Description</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white text-shadow-sm">Counterparty</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-white text-shadow-sm">Amount</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-white text-shadow-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-sm text-white text-shadow-sm">{formatDate(transaction.date)}</td>
                  <td className="px-4 py-3 text-sm text-white text-shadow-sm">{transaction.description}</td>
                  <td className="px-4 py-3 text-sm text-white text-shadow-sm">{transaction.counterparty}</td>
                  <td className={`px-4 py-3 text-sm text-right ${transaction.type === 'incoming' ? 'text-green-400' : 'text-white'} text-shadow-sm`}>
                    {transaction.type === 'incoming' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;