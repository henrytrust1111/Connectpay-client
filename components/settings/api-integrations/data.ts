import toast from "react-hot-toast";

export const copyToClipboard = (text: string, label: string) => {
  navigator?.clipboard.writeText(text);
  toast.success(`${label} copied to clipboard`);
};
