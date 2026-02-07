"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/common-elements/card";
import { Button } from "@/components/common-elements/button";
import { useState, useEffect } from "react";
import { createWallet, getWalletBalance } from "@/services/wallet";
import { toast } from "sonner";
import { DashboardCardSkeleton } from "@/components/common/loading-skeletons";
import { EnhancedEmptyState } from "@/components/common/enhanced-empty-state";
import { Wallet, CreditCard } from "lucide-react";

export default function WalletPage() {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [hasWallet, setHasWallet] = useState(false);

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    setLoading(true);
    try {
      const response = await getWalletBalance();
      if (response.success) {
        setBalance(response.data.balance);
        setHasWallet(true);
      } else if (response.status === 404) {
        setHasWallet(false);
      }
    } catch (error) {
      toast.error("Failed to load wallet balance");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWallet = async () => {
    setCreating(true);
    try {
      const response = await createWallet();
      if (response.success) {
        toast.success("Wallet created successfully!");
        setHasWallet(true);
        setBalance(0);
      } else {
        toast.error(response.message || "Failed to create wallet");
      }
    } catch {
      toast.error("An error occurred while creating wallet");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 pb-mobile-safe">
      <div>
        <h1 className="heading-2xl">Wallet</h1>
        <p className="text-muted-foreground mt-1">Manage your ConnectPay wallet and payments</p>
      </div>

      {loading ? (
        <DashboardCardSkeleton />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" aria-hidden="true" />
              Wallet Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasWallet ? (
              <div className="space-y-6">
                <div>
                  <div className="heading-3xl text-primary-700 dark:text-primary-400">
                    ${balance ? Number(balance).toFixed(2) : "0.00"}
                  </div>
                  <p className="text-muted-foreground mt-1">Current balance</p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 border border-dashed">
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground mt-1" aria-hidden="true" />
                    <div>
                      <h4 className="font-medium text-sm mb-1">Payment Integration</h4>
                      <p className="text-sm text-muted-foreground">
                        OnePipe integration will be available here for funding your wallet securely.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <EnhancedEmptyState
                icon={Wallet}
                title="No wallet yet"
                description="Create a wallet to start managing your payments and transactions on ConnectPay."
                action={{
                  label: creating ? "Creating..." : "Create Wallet",
                  onClick: handleCreateWallet,
                }}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
