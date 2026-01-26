import { Card, CardContent, CardHeader, CardTitle } from "@/components/common-elements/card";
import { Button } from "@/components/common-elements/button";
import { MessageSquare, Phone, Wallet, User } from "lucide-react";
import Link from "next/link";
import { EAppRoutes } from "@/enums";

export default function Dashboard() {
  return (
    <div className="space-y-6 pb-22">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your ConnectPay account.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-muted-foreground">Current balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Unread messages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calls</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Recent calls</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Complete</div>
            <p className="text-xs text-muted-foreground">Profile status</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href={EAppRoutes.MESSAGES}>
              <Button className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Start Messaging
              </Button>
            </Link>
            <Link href={EAppRoutes.CALLS}>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="mr-2 h-4 w-4" />
                Make a Call
              </Button>
            </Link>
            <Link href={EAppRoutes.WALLET}>
              <Button variant="outline" className="w-full justify-start">
                <Wallet className="mr-2 h-4 w-4" />
                Manage Wallet
              </Button>
            </Link>
            <Link href={EAppRoutes.PROFILE}>
              <Button variant="outline" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
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
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
