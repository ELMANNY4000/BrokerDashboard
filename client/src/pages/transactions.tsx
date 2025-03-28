import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Transaction, User } from "@shared/schema";
import { TransactionTable } from "@/components/ui/transaction-table";

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Fetch transactions data
  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery<Transaction[]>({
    queryKey: ['/api/transactions'],
  });
  
  // Fetch users data for user information
  const { data: users = [], isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });
  
  // Filter transactions based on search query and date range
  const filteredTransactions = transactions.filter(transaction => {
    // Get user for this transaction
    const user = users.find(u => u.id === transaction.userId);
    const userFullName = user ? user.fullName : "";
    const userEmail = user ? user.email : "";
    
    // Check if transaction matches search query
    const matchesSearch = 
      transaction.id.toString().includes(searchQuery.toLowerCase()) || 
      userFullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Check if transaction is in date range
    let matchesDateRange = true;
    if (startDate && endDate) {
      const transactionDate = new Date(transaction.createdAt);
      const start = new Date(startDate);
      const end = new Date(endDate);
      // Set end date to end of day
      end.setHours(23, 59, 59, 999);
      
      matchesDateRange = transactionDate >= start && transactionDate <= end;
    }
    
    return matchesSearch && matchesDateRange;
  });
  
  // Combine transactions with user data for display
  const transactionsWithUserInfo = filteredTransactions.map(transaction => {
    const user = users.find(u => u.id === transaction.userId);
    return {
      ...transaction,
      userName: user?.fullName || "Unknown User",
      userEmail: user?.email || "",
      userInitials: user ? user.fullName.split(' ').map(n => n[0]).join('') : "??"
    };
  });
  
  const handleFilterClick = () => {
    // The filtering is already reactive based on state changes
    // This button is just for UX consistency with the design
  };
  
  if (isLoadingTransactions || isLoadingUsers) {
    return <div className="flex justify-center items-center h-64">Loading transactions data...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h3 className="text-lg font-semibold text-slate-800">Transaction History</h3>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search transactions..." 
                className="w-full md:w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
            </div>
            <div className="flex gap-2">
              <input 
                type="date" 
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="flex items-center">to</span>
              <input 
                type="date" 
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <button 
              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200"
              onClick={handleFilterClick}
            >
              Filter
            </button>
          </div>
        </div>
        
        <TransactionTable transactions={transactionsWithUserInfo} />
      </div>
    </div>
  );
}
