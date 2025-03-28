import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { UserTable } from "@/components/ui/user-table";
import { useToast } from "@/hooks/use-toast";

export default function Users() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Fetch users data
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });
  
  // Filter users based on search query and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleAddUserClick = () => {
    toast({
      title: "Not Implemented",
      description: "User creation form not implemented in this demo.",
    });
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading users data...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h3 className="text-lg font-semibold text-slate-800">All Users</h3>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search users..." 
                className="w-full md:w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
            </div>
            <select 
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
            <button 
              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200 flex items-center gap-2"
              onClick={handleAddUserClick}
            >
              <i className="fas fa-plus"></i> Add User
            </button>
          </div>
        </div>
        
        <UserTable 
          users={filteredUsers} 
          showPagination={true}
        />
      </div>
    </div>
  );
}
