import { SidebarProvider } from "@/components/common-elements/sidebar";
import { MainHeader } from "@/components/layouts/main-header";
import { MainSidebar } from "@/components/layouts/main-sidebar";
import { MobileNavbar } from "@/components/layouts/mobile-navbar";
import { InitializeUserData } from "@/components/layouts/initialize-user-data";
import React, { ReactNode } from "react";

export default function MainWrapper({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider className="flex min-h-screen font-inter overflow-x-auto text-admin-text">
      <InitializeUserData />
      <MainSidebar />
      <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-hidden">
        <MainHeader />
        <div className="pt-19 md:pt-5 h-full bg-[#FAFAFA] dark:bg-[#111928]">
          {children}
        </div>
      </div>
      <MobileNavbar />
    </SidebarProvider>
  );
}
