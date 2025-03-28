import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User, EmailNotification, InsertEmailNotification } from "@shared/schema";
import { EmailForm } from "@/components/ui/email-form";
import { EmailHistory } from "@/components/ui/email-history";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function EmailNotifications() {
  const { toast } = useToast();
  
  // Fetch users data for recipient selection
  const { data: users = [], isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });
  
  // Fetch email notification history
  const { data: emailHistory = [], isLoading: isLoadingEmails } = useQuery<EmailNotification[]>({
    queryKey: ['/api/email-notifications'],
  });
  
  // Mutation for sending new email notification
  const sendEmailMutation = useMutation({
    mutationFn: async (emailData: InsertEmailNotification) => {
      const res = await apiRequest("POST", "/api/email-notifications", emailData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/email-notifications'] });
      toast({
        title: "Email Sent",
        description: "Your notification email has been sent successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Email Failed",
        description: error.message || "There was an error sending the email notification.",
        variant: "destructive",
      });
    }
  });
  
  const handleSendEmail = (emailData: InsertEmailNotification) => {
    sendEmailMutation.mutate(emailData);
  };
  
  if (isLoadingUsers || isLoadingEmails) {
    return <div className="flex justify-center items-center h-64">Loading email data...</div>;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
        <EmailForm 
          users={users} 
          onSendEmail={handleSendEmail} 
          isPending={sendEmailMutation.isPending}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <EmailHistory emailHistory={emailHistory} />
      </div>
    </div>
  );
}
