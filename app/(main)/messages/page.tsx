"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common-elements/card";
import { Button } from "@/components/common-elements/button";
import { Input } from "@/components/common-elements/input";
import { useState, useEffect, useRef } from "react";
import { useSession } from "@/hooks";
import { useSocket } from "@/hooks/useSocket";
import { getChats } from "@/services/messages";
import { getUsers, IUser } from "@/services/user";
import toast from "react-hot-toast";
import { registerServiceWorker } from "@/utils/registerSW";
import { subscribeToPush } from "@/utils/push";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  reply_id?: string | null;
  reply_message?: string | null;
  reply_sender_id?: string | null;
}

export default function MessagesPage() {
  const { session } = useSession();
  const { isConnected, sendMessage, onReceiveMessage, offReceiveMessage } =
    useSocket();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);

  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  /* ---------------- SOCKET ---------------- */
  useEffect(() => {
    if (!isConnected || !session?.user?.id) return;

    const handler = (data: Message) => {
      if (data.sender_id === session.user.id) return;

      if (
        data.sender_id === selectedUser ||
        data.receiver_id === selectedUser
      ) {
        setMessages((prev) => [...prev, data]);
      } else {
        toast.success("New message received");
      }
    };

    onReceiveMessage(handler);
    return () => offReceiveMessage();
  }, [isConnected, selectedUser]);

  /* ---------------- USERS ---------------- */
  useEffect(() => {
    getUsers().then((res) => {
      if (res.success) setUsers(res.data || []);
    });
  }, []);

  /* ---------------- CHAT HISTORY ---------------- */
  const loadMessages = async (userId: string) => {
    setLoading(true);
    const res = await getChats(userId);
    if (res.success) setMessages(res.data || []);
    setLoading(false);
  };

  /* ---------------- SEND MESSAGE ---------------- */
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser || !session?.user?.id) return;

    sendMessage(session.user.id, selectedUser, newMessage, replyTo?.id ?? null);

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sender_id: session.user.id,
        receiver_id: selectedUser,
        message: newMessage,
        created_at: new Date().toISOString(),
        reply_id: replyTo?.id ?? null,
        reply_message: replyTo?.message ?? null,
        reply_sender_id: replyTo?.sender_id ?? null,
      },
    ]);

    setNewMessage("");
    setReplyTo(null);
  };

  /* ---------------- SCROLL TO ORIGINAL ---------------- */
  const scrollToMessage = (id?: string | null) => {
    if (!id) return;
    const el = messageRefs.current[id];
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("bg-yellow-200");
    setTimeout(() => el.classList.remove("bg-yellow-200"), 1200);
  };

  /* ---------------- LONG PRESS ---------------- */
  const handlePressStart = (msg: Message) => {
    longPressTimer.current = setTimeout(() => {
      setReplyTo(msg);
    }, 500);
  };

  const handlePressEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  return (
    <div className="space-y-6 pb-24">
      <h1 className="text-3xl font-bold">Messages</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* CONTACTS */}
        <Card>
          <CardHeader>
            <CardTitle>Contacts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {users.map((u) => (
              <Button
                key={u.id}
                className="w-full justify-start"
                variant={selectedUser === u.id ? "default" : "outline"}
                onClick={() => {
                  setSelectedUser(u.id);
                  setMessages([]);
                  loadMessages(u.id);
                }}
              >
                {u.name}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* CHAT */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedUser
                ? `Chat with ${users.find((u) => u.id === selectedUser)?.name}`
                : "Select a user"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="h-72 overflow-y-auto border rounded p-4 space-y-2">
              {loading ? (
                <p>Loading…</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    ref={(el) => {
                      messageRefs.current[msg.id] = el;
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setReplyTo(msg);
                    }}
                    onMouseDown={() => handlePressStart(msg)}
                    onMouseUp={handlePressEnd}
                    onMouseLeave={handlePressEnd}
                    className={`p-2 rounded max-w-xs space-y-1 transition-all break-words ${
                      msg.sender_id === session?.user?.id
                        ? "bg-blue-100 text-black dark:bg-blue-900 dark:text-white ml-auto"
                        : "bg-gray-100 text-black dark:bg-dark-background-100 dark:text-white mr-auto"
                    }`}
                  >
                    {msg.reply_id && (
                      <div
                        onClick={() => scrollToMessage(msg.reply_id)}
                        className="border-l-4 border-blue-500 bg-white dark:bg-dark-background-200 dark:border-blue-400 dark:text-white p-1 text-xs cursor-pointer"
                      >
                        {msg.reply_message}
                      </div>
                    )}

                    <p>{msg.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* REPLY PREVIEW */}
            {replyTo && (
              <div className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400 dark:text-white p-2 mt-2 flex justify-between text-sm">
                <span className="truncate">Replying to: {replyTo.message}</span>
                <button
                  onClick={() => setReplyTo(null)}
                  className="text-red-500"
                >
                  ✕
                </button>
              </div>
            )}

            {/* INPUT */}
            <div className="flex gap-2 mt-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message…"
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button
        onClick={async () => {
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            await registerServiceWorker();
            await subscribeToPush(session.token);
            toast.success("Notifications enabled 🎉");
          }
        }}
      >
        Enable Notifications
      </Button>

    </div>
  );
}






















// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/common-elements/card";
// import { Button } from "@/components/common-elements/button";
// import { Input } from "@/components/common-elements/input";
// import { useState, useEffect } from "react";
// import { useSession } from "@/hooks";
// import { useSocket } from "@/hooks/useSocket";
// import { getChats } from "@/services/messages";
// import { getUsers, IUser } from "@/services/user";
// import toast from "react-hot-toast";

// interface Message {
//   id: string;
//   sender_id: string;
//   receiver_id: string;
//   message: string;
//   created_at: string;

//    // quoted reply fields (optional, flat, SAFE)
//   reply_id: string | null;
//   reply_message: string | null;
//   reply_sender_id: string | null;
// }

// export default function MessagesPage() {
//   const { session } = useSession();
//   const { isConnected, sendMessage, onReceiveMessage, offReceiveMessage } = useSocket();

//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [selectedUser, setSelectedUser] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [users, setUsers] = useState<IUser[]>([]);
//   const [usersLoading, setUsersLoading] = useState(true);

//   /**
//    * Socket listener
//    */
//   useEffect(() => {
//     if (!isConnected || !session?.user?.id) return;

//     const handler = (data: Message) => {
//       // Ignore messages sent by me (prevents duplicates)
//       if (data.sender_id === session.user.id) return;

//       // Only append if message belongs to the current chat
//       if (
//         data.sender_id === selectedUser ||
//         data.receiver_id === selectedUser
//       ) {
//         setMessages((prev) => [...prev, data]);
//       } else {
//         toast.success("New message received");
//       }
//     };

//     onReceiveMessage(handler);

//     return () => {
//       offReceiveMessage();
//     };
//   }, [isConnected, selectedUser, session?.user?.id, onReceiveMessage, offReceiveMessage]);

//   /**
//    * Fetch users
//    */
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await getUsers();
//         if (response.success && response.data) {
//           setUsers(response.data);
//         } else {
//           toast.error(response.message || "Failed to fetch users");
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error("Failed to fetch users");
//       } finally {
//         setUsersLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   /**
//    * Load chat history
//    */
//   const loadMessages = async (userId: string) => {
//     setLoading(true);
//     try {
//       const response = await getChats(userId);
//       if (response.success) {
//         setMessages(response.data || []);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to load messages");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /**
//    * Select user to chat with
//    */
//   const handleUserSelect = (userId: string) => {
//     setSelectedUser(userId);
//     setMessages([]); // clear previous chat
//     loadMessages(userId);
//   };

//   /**
//    * Send message
//    */
//   const handleSendMessage = () => {
//     if (!newMessage.trim() || !selectedUser || !session?.user?.id) return;

//     // Optimistic UI update
//     setMessages((prev) => [
//       ...prev,
//       {
//         id: crypto.randomUUID(),
//         sender_id: session.user.id,
//         receiver_id: selectedUser,
//         message: newMessage,
//         created_at: new Date().toISOString(),
//       },
//     ]);

//     sendMessage(session.user.id, selectedUser, newMessage);
//     setNewMessage("");
//   };

//   return (
//     <div className="space-y-6 pb-22">
//       <div>
//         <h1 className="text-3xl font-bold">Messages</h1>
//         <p className="text-muted-foreground">
//           Chat with other users in real-time
//         </p>
//       </div>

//       <div className="grid gap-6 md:grid-cols-3">
//         {/* CONTACTS */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Contacts</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-2">
//               {usersLoading ? (
//                 <p className="text-muted-foreground">Loading users...</p>
//               ) : users.length === 0 ? (
//                 <p className="text-muted-foreground">No users found</p>
//               ) : (
//                 users.map((user) => (
//                   <Button
//                     key={user.id}
//                     variant={selectedUser === user.id ? "default" : "outline"}
//                     className="w-full justify-start"
//                     onClick={() => handleUserSelect(user.id)}
//                   >
//                     {user.name}
//                   </Button>
//                 ))
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* CHAT */}
//         <Card className="md:col-span-2">
//           <CardHeader>
//             <CardTitle>
//               {selectedUser
//                 ? `Chat with ${users.find((u) => u.id === selectedUser)?.name}`
//                 : "Select a user to start chatting"}
//             </CardTitle>
//             <div className="text-sm text-muted-foreground">
//               Status: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
//             </div>
//           </CardHeader>

//           <CardContent>
//             {selectedUser ? (
//               <div className="space-y-4">
//                 <div className="h-64 overflow-y-auto border rounded p-4 space-y-2">
//                   {loading ? (
//                     <p>Loading messages...</p>
//                   ) : messages.length === 0 ? (
//                     <p>No messages yet</p>
//                   ) : (
//                     messages
//                       .slice()
//                       .sort(
//                         (a, b) =>
//                           new Date(a.created_at).getTime() -
//                           new Date(b.created_at).getTime()
//                       )
//                       .map((msg) => (
//                         <div
//                           key={msg.id}
//                           className={`p-2 rounded max-w-xs ${
//                             msg.sender_id === session?.user?.id
//                               ? "bg-blue-100 ml-auto"
//                               : "bg-gray-100 mr-auto"
//                           }`}
//                         >
//                           <p className="text-sm">{msg.message}</p>
//                           <p className="text-xs text-muted-foreground">
//                             {msg.created_at
//                               ? new Date(msg.created_at).toLocaleTimeString()
//                               : "Just now"}
//                           </p>
//                         </div>
//                       ))
//                   )}
//                 </div>

//                 <div className="flex gap-2">
//                   <Input
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     placeholder="Type a message..."
//                     disabled={!isConnected}
//                     onKeyDown={(e) =>
//                       e.key === "Enter" && handleSendMessage()
//                     }
//                   />
//                   <Button
//                     onClick={handleSendMessage}
//                     disabled={!newMessage.trim() || !isConnected}
//                   >
//                     Send
//                   </Button>
//                 </div>
//               </div>
//             ) : (
//               <p className="text-muted-foreground">
//                 Select a contact to start a conversation
//               </p>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
