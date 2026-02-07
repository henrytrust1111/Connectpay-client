import { toast } from "sonner";

export const copyToClipboard = (text: string, label: string) => {
  navigator?.clipboard.writeText(text);
  toast.success(`${label} copied to clipboard`);
};
