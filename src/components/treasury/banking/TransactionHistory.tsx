
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
        <h3 className="text-lg font-medium text-blue-dark">Transaction History</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs h-8">
            <Filter className="h-3 w-3 mr-1" /> Filter
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-8">
            <Download className="h-3 w-3 mr-1" /> Export
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-studio-sand/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-studio-sand/20 bg-studio-sand/10">
                <th className="text-left px-4 py-3 text-xs font-medium text-blue-dark">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-blue-dark">Description</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-blue-dark">Counterparty</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-blue-dark">Amount</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-blue-dark">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-studio-sand/10 hover:bg-studio-sand/5">
                  <td className="px-4 py-3 text-sm text-blue-dark">{formatDate(transaction.date)}</td>
                  <td className="px-4 py-3 text-sm text-blue-dark">{transaction.description}</td>
                  <td className="px-4 py-3 text-sm text-blue-dark">{transaction.counterparty}</td>
                  <td className={`px-4 py-3 text-sm text-right ${transaction.type === 'incoming' ? 'text-green-600' : 'text-blue-dark'}`}>
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
