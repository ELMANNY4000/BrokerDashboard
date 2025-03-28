import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Transaction } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { StatsCard } from "@/components/ui/stats-card";
import { UserTable } from "@/components/ui/user-table";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();
  
  // Fetch users data
  const { data: users = [], isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });
  
  // Fetch transactions data
  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery<Transaction[]>({
    queryKey: ['/api/transactions'],
  });
  
  // Calculate stats
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'active').length;
  const inactiveUsers = users.filter(user => user.status === 'inactive').length;
  
  const totalTransactions = transactions.reduce((total, transaction) => {
    return total + parseFloat(transaction.amount);
  }, 0);
  
  // Get the 4 most recent users
  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);
  
  if (isLoadingUsers || isLoadingTransactions) {
    return <div className="flex justify-center items-center h-64">Loading dashboard data...</div>;
  }
  
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Users" 
          value={totalUsers}
          icon="users"
          change={12}
          iconBgColor="bg-primary-100"
          iconColor="text-primary-500"
        />
        
        <StatsCard 
          title="New Users" 
          value={users.filter(user => {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            return new Date(user.createdAt) > oneMonthAgo;
          }).length}
          icon="user-plus"
          change={18}
          iconBgColor="bg-green-100"
          iconColor="text-green-500"
        />
        
        <StatsCard 
          title="Total Transactions" 
          value={`$${Math.abs(totalTransactions).toFixed(2)}`}
          icon="money-bill-wave"
          change={7.2}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-500"
        />
        
        <StatsCard 
          title="Active Users" 
          value={activeUsers}
          icon="user-check"
          change={-3}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-500"
        />
      </div>
      
      {/* User Growth Chart and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800">User Growth</h3>
            <select className="text-sm text-slate-600 border border-slate-300 rounded-md px-2 py-1">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between px-2">
            <div className="flex flex-col items-center">
              <div className="bg-primary-500 w-8 rounded-t-md" style={{ height: '40%' }}></div>
              <span className="text-xs mt-1 text-slate-600">Mon</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary-500 w-8 rounded-t-md" style={{ height: '65%' }}></div>
              <span className="text-xs mt-1 text-slate-600">Tue</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary-500 w-8 rounded-t-md" style={{ height: '50%' }}></div>
              <span className="text-xs mt-1 text-slate-600">Wed</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary-500 w-8 rounded-t-md" style={{ height: '80%' }}></div>
              <span className="text-xs mt-1 text-slate-600">Thu</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary-500 w-8 rounded-t-md" style={{ height: '75%' }}></div>
              <span className="text-xs mt-1 text-slate-600">Fri</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary-500 w-8 rounded-t-md" style={{ height: '45%' }}></div>
              <span className="text-xs mt-1 text-slate-600">Sat</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary-500 w-8 rounded-t-md" style={{ height: '30%' }}></div>
              <span className="text-xs mt-1 text-slate-600">Sun</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500 flex-shrink-0">
                <i className="fas fa-user-plus text-sm"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">New user registered</p>
                <p className="text-xs text-slate-500">Emma Watson • 5 mins ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 flex-shrink-0">
                <i className="fas fa-money-bill-wave text-sm"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">Funds added to account</p>
                <p className="text-xs text-slate-500">James Smith • 12 mins ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 flex-shrink-0">
                <i className="fas fa-envelope text-sm"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">Email notification sent</p>
                <p className="text-xs text-slate-500">To 23 users • 25 mins ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 flex-shrink-0">
                <i className="fas fa-cog text-sm"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">System update completed</p>
                <p className="text-xs text-slate-500">Version 2.4.1 • 1 hour ago</p>
              </div>
            </div>
          </div>
          <button 
            className="mt-4 text-primary-500 hover:text-primary-700 text-sm font-medium"
            onClick={() => toast({ title: "Coming Soon", description: "This feature is not yet implemented." })}
          >
            View All Activities
          </button>
        </div>
      </div>
      
      {/* Recent Users */}
      <UserTable 
        users={recentUsers} 
        title="Recent Users" 
        showViewAllButton={true} 
        viewAllLink="/users"
      />
    </div>
  );
}
