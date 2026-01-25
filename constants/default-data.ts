import { EAppRoutes } from "@/enums";
import {
  LayoutDashboard,
  User,
  Wallet,
  MessageSquare,
  Phone,
  Settings,
} from "lucide-react";
// Default public pages that do not require authentication
export const DEFAULT_PUBLIC_PAGES = [
  EAppRoutes.HOME,
  EAppRoutes.LOGIN,
  EAppRoutes.SIGNUP,
  EAppRoutes.FORGOT_PASSWORD,
  EAppRoutes.PASSWORD_RESET_MESSAGE,
  EAppRoutes.VERIFICATION_MESSAGE,
  EAppRoutes.VERIFY_TOKEN,
  EAppRoutes.RESET_PASSWORD,
  EAppRoutes.PAYMENT_SUCCESS,
  EAppRoutes.PAYMENT_CANCEL,
  EAppRoutes.PAYMENT_FAILED,
  EAppRoutes.RESET_EMAIL_FAILED,
  EAppRoutes.RESET_EMAIL_SUCCESS,
  EAppRoutes.RESET_EMAIL_ALERT,
];

export const defaultAuth = {
  token: "",
  expires: 0,
  user: {
    id: "",
    name: "",
    email: "",
    phone: "",
  },
};

export const menu = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    link: EAppRoutes.DASHBOARD,
  },
  {
    name: "Profile",
    icon: User,
    link: EAppRoutes.PROFILE,
  },
  {
    name: "Wallet",
    icon: Wallet,
    link: EAppRoutes.WALLET,
  },
  {
    name: "Messages",
    icon: MessageSquare,
    link: EAppRoutes.MESSAGES,
  },
  {
    name: "Calls",
    icon: Phone,
    link: EAppRoutes.CALLS,
  },
  {
    name: "Settings",
    icon: Settings,
    link: EAppRoutes.SETTINGS,
  },
];

export const DEFAULT_DOMAIN_VALUE = "All Domains";
