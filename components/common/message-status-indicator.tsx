import { Check, CheckCheck, Clock, XCircle } from "lucide-react";
import { tailwindCn } from "@/helpers";

export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

interface MessageStatusIndicatorProps {
  status: MessageStatus;
  className?: string;
}

export function MessageStatusIndicator({
  status,
  className,
}: MessageStatusIndicatorProps) {
  const icons = {
    sending: <Clock className="h-3 w-3 status-sent" />,
    sent: <Check className="h-3 w-3 status-sent" />,
    delivered: <CheckCheck className="h-3 w-3 status-delivered" />,
    read: <CheckCheck className="h-3 w-3 status-read" />,
    failed: <XCircle className="h-3 w-3 status-failed" />,
  };

  return (
    <div
      className={tailwindCn("inline-flex items-center", className)}
      aria-label={`Message ${status}`}
    >
      {icons[status]}
    </div>
  );
}
