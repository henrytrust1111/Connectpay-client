import { ReactNode } from "react";
import AuthLogo from "@/components/auth/auth-logo";

const PageWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FAFAFA] dark:bg-dark-background-200">
      <div className="w-full pl-10 pt-4 bg-white border-b border-b-neutral-200 dark:bg-dark-background-200 dark:border-b-dark-border">
        <AuthLogo className="dark:bg-dark-background-200" />
      </div>
      <div className="w-full max-w-[536px] bg-[#FAFAFA] dark:bg-dark-background-200 pt-11 px-4 md:px-0 md:pt-26">
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
