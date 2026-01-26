"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/common-elements/card";
import { Button } from "@/components/common-elements/button";
import { useState } from "react";
import { startCall, endCall } from "@/services/calls";
import toast from "react-hot-toast";

export default function CallsPage() {
  const [currentCall, setCurrentCall] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock users for demo
  const mockUsers = [
    { id: "user1", name: "Alice" },
    { id: "user2", name: "Bob" },
    { id: "user3", name: "Charlie" },
  ];

  const handleStartCall = async (receiverId: string) => {
    setLoading(true);
    try {
      const response = await startCall(receiverId);
      if (response.success) {
        setCurrentCall(response.data.id);
        toast.success("Call started!");
      } else {
        toast.error(response.message || "Failed to start call");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEndCall = async () => {
    if (!currentCall) return;

    try {
      const response = await endCall(currentCall);
      if (response.success) {
        setCurrentCall(null);
        toast.success("Call ended!");
      } else {
        toast.error(response.message || "Failed to end call");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="space-y-6 pb-22">
      <div>
        <h1 className="text-3xl font-bold">Calls</h1>
        <p className="text-muted-foreground">Make voice and video calls</p>
      </div>

      {currentCall && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">Call in Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700 mb-4">You are currently on a call</p>
            <Button onClick={handleEndCall} variant="destructive">
              End Call
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Start a Call</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Select a user to start a voice or video call. WebRTC integration will be added for actual calling functionality.
            </p>

            <div className="grid gap-2">
              {mockUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded">
                  <span>{user.name}</span>
                  <div className="space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStartCall(user.id)}
                      disabled={loading || !!currentCall}
                    >
                      📞 Call
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStartCall(user.id)}
                      disabled={loading || !!currentCall}
                    >
                      📹 Video
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Call History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No call history available</p>
        </CardContent>
      </Card>
    </div>
  );
}