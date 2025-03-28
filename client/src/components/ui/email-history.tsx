import { formatDistanceToNow } from "date-fns";
import { EmailNotification } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface EmailHistoryProps {
  emailHistory: EmailNotification[];
}

export function EmailHistory({ emailHistory }: EmailHistoryProps) {
  const { toast } = useToast();
  
  // Sort email history by date (newest first)
  const sortedEmails = [...emailHistory].sort(
    (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  );
  
  const getRecipientsText = (notification: EmailNotification): string => {
    switch (notification.recipientType) {
      case "all":
        return "All users";
      case "active":
        return "All active users";
      case "inactive":
        return "All inactive users";
      case "custom":
        if (notification.recipientIds) {
          const count = notification.recipientIds.split(",").length;
          return count === 1 ? "1 specific user" : `${count} specific users`;
        }
        return "Custom recipients";
      default:
        return "Unknown recipients";
    }
  };
  
  const handleViewAllClick = () => {
    toast({
      title: "Coming Soon",
      description: "Full email history view is not implemented in this demo."
    });
  };
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Email History</h3>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {sortedEmails.length > 0 ? (
          sortedEmails.map((email, index) => (
            <div key={email.id} className={`${index !== sortedEmails.length - 1 ? 'border-b border-slate-200 pb-4' : 'pb-2'}`}>
              <div className="flex justify-between mb-1">
                <h4 className="font-medium text-slate-800">{email.subject}</h4>
                <span className="text-xs text-slate-500">
                  {formatDistanceToNow(new Date(email.sentAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-1">
                Sent to: {getRecipientsText(email)}
              </p>
              <div className="flex items-center gap-2">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Delivered
                </span>
                <span className="text-xs text-slate-500">
                  Open rate: {email.openRate || 0}%
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-slate-500 py-4">
            No email history found
          </div>
        )}
      </div>
      <button 
        className="mt-4 text-primary-500 hover:text-primary-700 text-sm font-medium"
        onClick={handleViewAllClick}
      >
        View Full Email History
      </button>
    </div>
  );
}
