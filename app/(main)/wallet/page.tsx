"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/common-elements/card";
import { Button } from "@/components/common-elements/button";
import { useState, useEffect } from "react";
import { createWallet, getWalletBalance } from "@/services/wallet";
import toast from "react-hot-toast";

export default function WalletPage() {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasWallet, setHasWallet] = useState(false);

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const response = await getWalletBalance();
      if (response.success) {
        setBalance(response.data.balance);
        setHasWallet(true);
      } else if (response.status === 404) {
        setHasWallet(false);
      }
    } catch (error) {
      console.error("Failed to load balance:", error);
    }
  };

  const handleCreateWallet = async () => {
    setLoading(true);
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
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  console.log("type of balance",typeof balance)
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Wallet</h1>
        <p className="text-muted-foreground">Manage your ConnectPay wallet</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wallet Balance</CardTitle>
        </CardHeader>
        <CardContent>
          {hasWallet ? (
            <div className="space-y-4">
              <div className="text-4xl font-bold">${balance ? Number(balance).toFixed(2) : "0.00"}</div>
              <p className="text-muted-foreground">Current balance</p>
              <div className="pt-4">
                <p className="text-sm text-muted-foreground">
                  OnePipe integration will be available here for funding your wallet.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">You don&apos;t have a wallet yet.</p>
              <Button onClick={handleCreateWallet} disabled={loading}>
                {loading ? "Creating..." : "Create Wallet"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}