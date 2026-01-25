"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAvatarInitials, tailwindCn } from "@/helpers";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/common-elements/sidebar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/common-elements/avatar";
import dynamic from "next/dynamic";
const LogoImage = dynamic(
  () =>
    import("@/components/auth/auth-logo/logo-image").then(
      (mod) => mod.LogoImage
    ),
  {
    ssr: false,
  }
);
import { EAppRoutes } from "@/enums";
import { menu } from "@/constants";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks";
import { Button } from "@/components/common-elements/button";
import { useTheme } from "next-themes";

export const MainSidebar = () => {
  const { logout, session } = useSession();
  const { theme } = useTheme();
  const pathname = usePathname();

  const router = useRouter();

  const goHome = () => {
    router.push(EAppRoutes.HOME);
  };

  const handleLogout = async () => {
    logout();
  };

  return (
    <Sidebar
      className=" border-l border-l-neutral-200 dark:border-l-[#374151] [&_[data-sidebar=sidebar]]:bg-white dark:[&_[data-sidebar=sidebar]]:bg-[#1F2A37]"
      // collapsible='icon'
    >
      <SidebarContent>
        <SidebarHeader className="justify-center items-center h-24 border-b border-b-neutral-200 dark:border-b-[#374151]">
          <div
            onClick={goHome}
            className="relative h-10 w-[102.54px] md:h-[39.31px] cursor-pointer"
          >
            <LogoImage
              theme={theme}
              className="my-auto h-full w-auto hidden md:block"
            />
          </div>
        </SidebarHeader>

        <SidebarGroup className="p-7.5 pt-0">
          <SidebarGroupContent>
            <SidebarMenu className="mt-9.5 gap-2">
              {menu.map((item) => {
                const isActive = pathname?.includes(item.link);
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={tailwindCn(
                        "py-2.5 px-4 text-body dark:text-white font-semibold h-14 text-base",
                        {
                          "data-[active=true]:bg-primary-900 dark:data-[active=true]:bg-primary-600 data-[active=true]:text-white":
                            isActive,
                        }
                      )}
                    >
                      <Link prefetch={false} href={item.link}>
                        <item.icon className=" [&_*]:stroke-[2] " />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter
        className={tailwindCn(
          "flex flex-col justify-end items-center mb-7.5 px-7.5"
        )}
      >
        <div className=" flex items-center space-x-3 text-secondary w-full px-4">
          <Avatar className="h-12 w-12 ">
            <AvatarImage src={session?.user?.imageUrl || undefined} />
            <AvatarFallback className=" bg-primary-700 dark:bg-primary-400 text-white">
              {getAvatarInitials(session?.user?.name || "")}
            </AvatarFallback>
          </Avatar>
          <p className=" line-clamp-1 truncate">
            {session?.user?.name || "no name"}
          </p>
        </div>
        <Button
          onClick={handleLogout}
          variant="ghost"
          className=" space-x-2 w-full justify-start p-4 text-secondary dark:hover:bg-[#111928] h-auto"
          size="lg"
        >
          <LogOut className="!h-6 !w-6 [&_*]:stroke-[2]" /> Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
