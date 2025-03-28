import { useState } from "react";
import { Transaction } from "@shared/schema";

interface TransactionWithUserInfo extends Transaction {
  userName: string;
  userEmail: string;
  userInitials: string;
}

interface TransactionTableProps {
  transactions: TransactionWithUserInfo[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;
  
  // Calculate pagination
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };
  
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'bonus':
        return 'bg-blue-100 text-blue-800';
      case 'withdrawal':
        return 'bg-amber-100 text-amber-800';
      case 'adjustment':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };
  
  const formatAmount = (amount: string) => {
    const parsedAmount = parseFloat(amount);
    const isNegative = parsedAmount < 0;
    const amountClass = isNegative ? 'text-red-600' : 'text-green-600';
    const formattedAmount = `${isNegative ? '' : '+'}$${Math.abs(parsedAmount).toFixed(2)}`;
    
    return <div className={`text-sm font-semibold ${amountClass}`}>{formattedAmount}</div>;
  };
  
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  Transaction ID <i className="fas fa-sort text-slate-400"></i>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  User <i className="fas fa-sort text-slate-400"></i>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  Date <i className="fas fa-sort text-slate-400"></i>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  Amount <i className="fas fa-sort text-slate-400"></i>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {currentTransactions.length > 0 ? (
              currentTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">#{transaction.id.toString().padStart(7, '0')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 text-xs">
                        <span>{transaction.userInitials}</span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-slate-900">{transaction.userName}</div>
                        <div className="text-xs text-slate-500">{transaction.userEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-500">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatAmount(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeColor(transaction.type)}`}>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(transaction.status)}`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-slate-500">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-500">
            Showing {indexOfFirstTransaction + 1} to {Math.min(indexOfLastTransaction, transactions.length)} of {transactions.length} transactions
          </div>
          <div className="flex gap-2">
            <button 
              className={`px-3 py-1 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Calculate page numbers to show
              let pageNum = i + 1;
              if (totalPages > 5) {
                if (currentPage > 3) {
                  pageNum = currentPage - 3 + i;
                }
                if (currentPage > totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                }
              }
              
              if (pageNum <= totalPages) {
                return (
                  <button 
                    key={pageNum}
                    className={`px-3 py-1 border border-slate-300 rounded ${
                      currentPage === pageNum 
                        ? 'bg-primary-500 text-white' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              }
              return null;
            })}
            
            <button 
              className={`px-3 py-1 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
