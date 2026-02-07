"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/common-elements/card";
import { Button } from "@/components/common-elements/button";
import { useState } from "react";
import { startCall, endCall } from "@/services/calls";
import { toast } from "sonner";
import { EnhancedEmptyState } from "@/components/common/enhanced-empty-state";
import { Phone, Video, PhoneOff, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/common-elements/alert";

export default function CallsPage() {
  const [currentCall, setCurrentCall] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock users for demo
  const mockUsers = [
    { id: "user1", name: "Alice Johnson", status: "online" },
    { id: "user2", name: "Bob Smith", status: "offline" },
    { id: "user3", name: "Charlie Brown", status: "online" },
  ];

  const handleStartCall = async (receiverId: string, type: "audio" | "video") => {
    setLoading(true);
    try {
      const response = await startCall(receiverId);
      if (response.success) {
        setCurrentCall(response.data.id);
        toast.success(`${type === "video" ? "Video" : "Voice"} call started!`);
      } else {
        toast.error(response.message || "Failed to start call");
      }
    } catch {
      toast.error("An error occurred while starting the call");
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
        toast.success("Call ended");
      } else {
        toast.error(response.message || "Failed to end call");
      }
    } catch {
      toast.error("An error occurred while ending the call");
    }
  };

  return (
    <div className="space-y-6 pb-mobile-safe">
      <div>
        <h1 className="heading-2xl">Calls</h1>
        <p className="text-muted-foreground mt-1">Make voice and video calls with your contacts</p>
      </div>

      {currentCall && (
        <Alert className="border-success bg-success-light dark:bg-success/20">
          <Phone className="h-4 w-4 text-success" aria-hidden="true" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <p className="font-medium text-success">Call in Progress</p>
              <p className="text-sm text-muted-foreground mt-1">You are currently on a call</p>
            </div>
            <Button 
              onClick={handleEndCall} 
              variant="destructive" 
              size="sm"
              className="transition-smooth hover-scale"
              aria-label="End call"
            >
              <PhoneOff className="mr-2 h-4 w-4" aria-hidden="true" />
              End Call
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" aria-hidden="true" />
            Start a Call
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Video className="h-4 w-4" aria-hidden="true" />
              <AlertDescription className="text-sm">
                WebRTC integration will be added for real-time voice and video calling functionality.
              </AlertDescription>
            </Alert>

            <div className="grid gap-3">
              {mockUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-md bg-card hover:bg-accent/50 transition-smooth"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        user.status === "online" ? "bg-success" : "bg-neutral-300"
                      }`}
                      aria-label={`${user.status} status`}
                    />
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">{user.status}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStartCall(user.id, "audio")}
                      disabled={loading || !!currentCall}
                      className="transition-smooth hover-scale"
                      aria-label={`Call ${user.name}`}
                    >
                      <Phone className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStartCall(user.id, "video")}
                      disabled={loading || !!currentCall}
                      className="transition-smooth hover-scale"
                      aria-label={`Video call ${user.name}`}
                    >
                      <Video className="h-4 w-4" aria-hidden="true" />
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
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" aria-hidden="true" />
            Call History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EnhancedEmptyState
            icon={Clock}
            title="No call history"
            description="Your recent voice and video calls will appear here once you start making calls."
          />
        </CardContent>
      </Card>
    </div>
  );
}
