"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/common-elements/card";
import { Button } from "@/components/common-elements/button";
import { MessageSquare, Phone, Wallet, User, TrendingUp } from "lucide-react";
import Link from "next/link";
import { EAppRoutes } from "@/enums";
import { DashboardCardSkeleton } from "@/components/common/loading-skeletons";
import { EnhancedEmptyState } from "@/components/common/enhanced-empty-state";
import { useEffect, useState } from "react";
import { useSession } from "@/hooks";

interface DashboardStats {
  walletBalance: number;
  unreadMessages: number;
  recentCalls: number;
  profileComplete: boolean;
}

export default function Dashboard() {
  const { session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      setLoading(true);
      // In a real app, fetch from API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStats({
        walletBalance: 0,
        unreadMessages: 0,
        recentCalls: 0,
        profileComplete: true,
      });
      setLoading(false);
    };

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-6 pb-mobile-safe">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-2xl">Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}!</h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your ConnectPay account.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
          </>
        ) : (
          <>
            <Card className="transition-smooth hover-lift cursor-pointer" role="button" tabIndex={0} aria-label="View wallet balance">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats?.walletBalance.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-success" />
                  Current balance
                </p>
              </CardContent>
            </Card>

            <Card className="transition-smooth hover-lift cursor-pointer" role="button" tabIndex={0} aria-label="View unread messages">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.unreadMessages}</div>
                <p className="text-xs text-muted-foreground mt-1">Unread messages</p>
              </CardContent>
            </Card>

            <Card className="transition-smooth hover-lift cursor-pointer" role="button" tabIndex={0} aria-label="View recent calls">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Calls</CardTitle>
                <Phone className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.recentCalls}</div>
                <p className="text-xs text-muted-foreground mt-1">Recent calls</p>
              </CardContent>
            </Card>

            <Card className="transition-smooth hover-lift cursor-pointer" role="button" tabIndex={0} aria-label="View profile">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.profileComplete ? "Complete" : "Incomplete"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Profile status</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href={EAppRoutes.MESSAGES}>
              <Button className="w-full justify-start transition-smooth hover-scale" aria-label="Start messaging">
                <MessageSquare className="mr-2 h-4 w-4" aria-hidden="true" />
                Start Messaging
              </Button>
            </Link>
            <Link href={EAppRoutes.CALLS}>
              <Button variant="outline" className="w-full justify-start transition-smooth hover-scale" aria-label="Make a call">
                <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
                Make a Call
              </Button>
            </Link>
            <Link href={EAppRoutes.WALLET}>
              <Button variant="outline" className="w-full justify-start transition-smooth hover-scale" aria-label="Manage wallet">
                <Wallet className="mr-2 h-4 w-4" aria-hidden="true" />
                Manage Wallet
              </Button>
            </Link>
            <Link href={EAppRoutes.PROFILE}>
              <Button variant="outline" className="w-full justify-start transition-smooth hover-scale" aria-label="Update profile">
                <User className="mr-2 h-4 w-4" aria-hidden="true" />
                Update Profile
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <EnhancedEmptyState
              icon={MessageSquare}
              title="No recent activity"
              description="Your recent messages, calls, and transactions will appear here."
              action={{
                label: "Start a conversation",
                onClick: () => (window.location.href = EAppRoutes.MESSAGES),
                variant: "outline",
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
