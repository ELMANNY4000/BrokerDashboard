import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function AddFundsModal({ isOpen, onClose, user }: AddFundsModalProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("deposit");
  const [notes, setNotes] = useState("");
  const [sendEmail, setSendEmail] = useState(true);

  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
      setAmount("");
      setTransactionType("deposit");
      setNotes("");
      setSendEmail(true);
    }
  }, [isOpen]);

  const addFundsMutation = useMutation({
    mutationFn: async (data: {
      userId: number;
      amount: string;
      type: string;
      status: string;
      notes: string;
      sendEmail: boolean;
    }) => {
      const res = await apiRequest("POST", "/api/transactions", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      onClose();
      toast({
        title: "Funds Added",
        description: `Successfully added ${amount} to ${user?.fullName}'s account.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add funds. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive amount",
        variant: "destructive",
      });
      return;
    }

    // For withdrawals, make the amount negative
    const finalAmount = transactionType === "withdrawal" 
      ? -Math.abs(amountValue)
      : Math.abs(amountValue);

    addFundsMutation.mutate({
      userId: user.id,
      amount: finalAmount.toString(),
      type: transactionType,
      status: "completed",
      notes: notes,
      sendEmail,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Add Funds to User Account</h3>
          <button 
            className="text-slate-400 hover:text-slate-500"
            onClick={onClose}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">User</label>
            <div className="flex items-center p-2 border border-slate-300 rounded-lg bg-slate-50">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
                <span>{user?.fullName.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-slate-900">{user?.fullName}</div>
                <div className="text-xs text-slate-500">{user?.email}</div>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-500">$</span>
              </div>
              <input 
                type="number" 
                id="amount" 
                className="pl-7 w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
                placeholder="0.00" 
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="transactionType" className="block text-sm font-medium text-slate-700 mb-1">Transaction Type</label>
            <select 
              id="transactionType" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
            >
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="bonus">Bonus</option>
              <option value="adjustment">Adjustment</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
            <textarea 
              id="notes" 
              rows={2} 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
              placeholder="Add any relevant transaction notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>
          
          <div className="flex items-center mb-4">
            <input 
              type="checkbox" 
              id="sendEmail" 
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
            />
            <label htmlFor="sendEmail" className="ml-2 block text-sm text-slate-900">Send email notification to user</label>
          </div>
          
          <div className="flex justify-end gap-3">
            <button 
              type="button"
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
              disabled={addFundsMutation.isPending}
            >
              {addFundsMutation.isPending ? "Processing..." : "Add Funds"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
