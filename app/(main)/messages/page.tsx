"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common-elements/card";
import { Button } from "@/components/common-elements/button";
import { Input } from "@/components/common-elements/input";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { useSession } from "@/hooks";

// Load emoji picker dynamically (no SSR)
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });
import { useSocket } from "@/hooks/useSocket";
import { getChats, editMessage, deleteMessage } from "@/services/messages";
import { getUsers, IUser } from "@/services/user";
import { toast } from "sonner";
import { MessageActionsModal } from "@/components/modal/message-actions-modal";
import { DeleteMessageModal } from "@/components/modal/delete-message-modal";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string | null;
  created_at: string;
  reply_id?: string | null;
  reply_message?: string | null;
  reply_sender_id?: string | null;
  edited?: boolean;
  is_deleted?: boolean;
}

export default function MessagesPage() {
  const { session } = useSession();
  const {
    socket,
    isConnected,
    sendMessage,
    onReceiveMessage,
    offReceiveMessage,
    emitEditMessage,
    onMessageEdited,
    emitDeleteMessage,
    onMessageDeleted,
    onSocketError,
  } = useSocket();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);

  // WhatsApp-style mobile navigation: on mobile, show either contacts OR message window
  const [viewingMessage, setViewingMessage] = useState(false);

  // Action modal (reply/edit/delete)
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionModalMessage, setActionModalMessage] = useState<Message | null>(null);

  // Delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Editing state (editing in input area)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  // Reference to the scrollable chat container so we can scroll to bottom
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  // When opening a chat, mark this so we can jump to bottom without visible scrolling
  const isInitialLoadRef = useRef(false);



  // Emoji picker state and ref
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

  // Handle responsive behavior - reset viewing state on desktop
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined" && window.innerWidth >= 768) {
        // On desktop, show both columns
        setViewingMessage(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleEmojiClick = (emojiData: any) => {
    // emojiData.emoji contains the character in current package versions
    const char = (emojiData && (emojiData.emoji ?? emojiData.unified)) || "";
    setNewMessage((prev) => prev + char);
    setShowEmojiPicker(false);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!showEmojiPicker) return;
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

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

  /* ---------------- SOCKET: edits & deletes ---------------- */
  useEffect(() => {
    if (!socket || !session?.user?.id) return;

    onMessageEdited((updated: Message) => {
      // Only update if message belongs to current conversation
      if (updated.sender_id === selectedUser || updated.receiver_id === selectedUser) {
        setMessages((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      }
    });

    onMessageDeleted((data: any) => {
      // For everyone: update the message row (server returns message object)
      if (data.forEveryone) {
        const updated: Message = data.message || { id: data.id, sender_id: "", receiver_id: "", message: null, created_at: new Date().toISOString(), is_deleted: true } as Message;
        setMessages((prev) => prev.map((m) => (m.id === data.id ? { ...m, ...updated } : m)));
      } else {
        // Deleted for me — only remove if it was deleted for current user
        if (data.deletedFor === session.user.id) {
          setMessages((prev) => prev.filter((m) => m.id !== data.id));
        }
      }
    });

    onSocketError((err: any) => {
      toast.error(err?.message || "Socket error");
    });
  }, [socket, session?.user?.id, selectedUser]);

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
    if (res.success) {
      setMessages(res.data || []);
      // mark as initial load so the effect will jump to bottom without visible scroll
      isInitialLoadRef.current = true;
    }
    setLoading(false);
  };

  /* ---------------- SEND MESSAGE ---------------- */
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !session?.user?.id) return;

    // If editing, submit edit instead
    if (editingMessageId) {
      await submitEditById(editingMessageId);
      return;
    }

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

  /* ---------------- EDIT & DELETE ---------------- */
  const startEdit = (msg: Message) => {
    // Put message text in the input area (WhatsApp-like)
    setEditingMessageId(msg.id);
    setNewMessage(msg.message ?? "");
    // Focus input
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setNewMessage("");
  };

  const submitEditById = async (id: string) => {
    const msg = messages.find((m) => m.id === id);
    if (!msg || !editingMessageId) return cancelEdit();
    if (!newMessage.trim() || !session?.user?.id) return cancelEdit();

    const oldText = msg.message;
    // Optimistic update
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, message: newMessage, edited: true } : m)));
    cancelEdit();

    try {
      if (isConnected && socket) {
        const onEdited = (updated: Message) => {
          if (updated.id === id) {
            setMessages((prev) => prev.map((m) => (m.id === id ? updated : m)));
            socket.off("message_edited", onEdited);
            socket.off("error", onError);
          }
        };

        const onError = (err: any) => {
          if (err?.message) toast.error(err.message);
          // Revert
          setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, message: oldText, edited: false } : m)));
          socket.off("message_edited", onEdited);
          socket.off("error", onError);
        };

        socket.once("message_edited", onEdited);
        socket.once("error", onError);
        emitEditMessage(id, session.user.id, newMessage);
      } else {
        const res = await editMessage(id, newMessage);
        if (!res.success) throw new Error(res.message || "Failed to edit message");
        setMessages((prev) => prev.map((m) => (m.id === id ? res.data : m)));
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to edit message");
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, message: oldText, edited: false } : m)));
    }
  };

  const handleDelete = async (msg: Message, type: "me" | "everyone") => {
    if (!msg || !msg.id) {
      toast.error("Message ID not found");
      return;
    }

    const messageId = msg.id;

    try {
      if (isConnected && socket) {
        // Optimistic: remove locally for 'me', replace for everyone
        if (type === "me") setMessages((prev) => prev.filter((m) => m.id !== messageId));
        else setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, message: null, is_deleted: true } : m)));

        // set up temporary success and error handlers
        const onErr = (err: any) => {
          toast.error(err?.message || "Failed to delete message");
          // Reload messages to revert optimistic update
          if (selectedUser) loadMessages(selectedUser);
          socket.off("error", onErr);
        };

        socket.once("error", onErr);
        emitDeleteMessage(messageId, session.user.id, type);
        // Close modals after emitting deletion
        setTimeout(() => {
          setActionModalOpen(false);
          setDeleteModalOpen(false);
        }, 300);
        toast.success("Message deleted");
      } else {
        const res = await deleteMessage(messageId, type);
        if (!res.success) throw new Error(res.message || "Failed to delete");
        if (res.data.forEveryone) {
          const updated = res.data.message || { id: messageId, message: null, is_deleted: true };
          setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, ...updated } : m)));
        } else {
          setMessages((prev) => prev.filter((m) => m.id !== messageId));
        }
        // Close modals after successful deletion
        setActionModalOpen(false);
        setDeleteModalOpen(false);
        toast.success("Message deleted");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete message");
    }
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

  /* ---------------- SCROLL TO BOTTOM ---------------- */
  const scrollToBottom = (smooth = false) => {
    const el = chatContainerRef.current;
    if (!el) return;
    const top = el.scrollHeight - el.clientHeight;
    el.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
  };

  // Auto-scroll to bottom when messages change (new messages or after sending)
  useEffect(() => {
    if (!chatContainerRef.current) return;

    if (isInitialLoadRef.current) {
      // When opening a chat, jump to the bottom instantly (no visible scrolling)
      scrollToBottom(false);
      isInitialLoadRef.current = false;
      return;
    }

    // For subsequent incoming/sent messages, smooth scroll
    scrollToBottom(true);
  }, [messages.length]);

  /* ---------------- LONG PRESS, CLICK (desktop) & SWIPE (mobile) ---------------- */
  // Swipe refs and thresholds
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const swipedRef = useRef(false);
  const SWIPE_THRESHOLD = 60; // px to the right
  const SWIPE_MAX_VERTICAL = 30; // allow small Y drift

  // Desktop click should open actions modal immediately (pointer: fine)
  const handleClick = (msg: Message) => {
    if (typeof window === "undefined") return;
    try {
      if (window.matchMedia && window.matchMedia("(pointer: fine)").matches) {
        setActionModalMessage(msg);
        setActionModalOpen(true);
      }
    } catch (e) {
      // fallback: do nothing
    }
  };

  const handlePressStart = (msg: Message) => {
    // Start long-press timer (works for mouse+touch)
    longPressTimer.current = setTimeout(() => {
      setActionModalMessage(msg);
      setActionModalOpen(true);
    }, 500);
  };

  const handlePressEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  // Touch handlers to detect right-swipe to reply
  const onTouchStartHandler = (msg: Message, e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartXRef.current = t.clientX;
    touchStartYRef.current = t.clientY;
    swipedRef.current = false;
    // also start long-press behavior
    handlePressStart(msg);
  };

  const onTouchMoveHandler = (msg: Message, e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStartXRef.current;
    const dy = t.clientY - (touchStartYRef.current ?? 0);

    // Detect right swipe
    if (dx > SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_MAX_VERTICAL && !swipedRef.current) {
      swipedRef.current = true;
      // Cancel long press
      handlePressEnd();
      // Trigger reply behavior
      setReplyTo(msg);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const onTouchEndHandler = () => {
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    swipedRef.current = false;
    handlePressEnd();
  };

  return (
    <div className="space-y-6 pb-24">
      {/* RESPONSIVE WHATSAPP-STYLE LAYOUT */}
      <div className="grid md:grid-cols-3 gap-6 px-6">
        
        {/* CONTACTS SIDEBAR - Hidden on mobile when viewing message, shown on desktop */}
        <div className={`${viewingMessage ? "hidden" : "block"} md:block md:col-span-1 h-[72vh]`}>
          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle>Contacts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 overflow-y-auto flex-1">
              {users.map((u) => (
                <Button
                  key={u.id}
                  className="w-full justify-start"
                  variant={selectedUser === u.id ? "default" : "outline"}
                  onClick={() => {
                    setSelectedUser(u.id);
                    setMessages([]);
                    loadMessages(u.id);
                    // On mobile, navigate to message window
                    setViewingMessage(true);
                  }}
                >
                  {u.name}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* MESSAGE WINDOW - Shown on mobile when viewing message, always shown on desktop */}
        <div className={`${viewingMessage ? "block" : "hidden"} md:block md:col-span-2 h-[72vh]`}>
          <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center gap-4 pb-3">
              {/* Back button - only visible on mobile */}
              {viewingMessage && (
                <button
                  onClick={() => {
                    setViewingMessage(false);
                    setSelectedUser(null);
                    setMessages([]);
                  }}
                  className="md:hidden text-2xl hover:bg-gray-100 dark:hover:bg-dark-background-200 rounded p-1"
                  aria-label="Back to contacts"
                >
                  ← 
                </button>
              )}
              <CardTitle className="flex-1">
                {selectedUser
                  ? `Chat with ${users.find((u) => u.id === selectedUser)?.name}`
                  : "Select a user"}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col flex-1 overflow-hidden">
              <div
                ref={chatContainerRef}
                className="h-72 overflow-y-auto border rounded p-4 space-y-2 flex-1"
              >
                {loading ? (
                  <p>Loading…</p>
                     ) : !selectedUser ? (
                  <p className="text-muted-foreground">Select a contact to start chatting</p>
                ) : messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <p className="font-semibold">No messages yet</p>
                      <p className="text-sm">Say hi 👋</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      ref={(el) => {
                        messageRefs.current[msg.id] = el;
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setActionModalMessage(msg);
                        setActionModalOpen(true);
                      }}
                      onClick={() => handleClick(msg)}
                      onMouseDown={() => handlePressStart(msg)}
                      onMouseUp={handlePressEnd}
                      onMouseLeave={handlePressEnd}
                      onTouchStart={(e) => onTouchStartHandler(msg, e)}
                      onTouchMove={(e) => onTouchMoveHandler(msg, e)}
                      onTouchEnd={onTouchEndHandler}
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

                      {/* Message body / deleted placeholder */}
                      {msg.is_deleted ? (
                        <p className="italic text-muted-foreground">Message deleted</p>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <p>{msg.message}</p>
                            {msg.edited && (
                              <span className="text-[10px] text-muted-foreground">(edited)</span>
                            )}
                          </div>

                          {/* Actions (only sender) */}
                          {msg.sender_id === session?.user?.id && !msg.is_deleted && (
                            <div className="flex gap-2 mt-1">
                              <button className="text-xs text-blue-600" onClick={() => { startEdit(msg); }}>Edit</button>
                              <button className="text-xs text-red-600" onClick={() => { setActionModalMessage(msg); setDeleteModalOpen(true); }}>Delete</button>
                              <button className="text-xs text-gray-600" onClick={() => { setActionModalMessage(msg); setActionModalOpen(true); }}>More</button>
                            </div>
                          )}
                        </>
                      )}

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

              {/* EDITING PREVIEW (in input area) */}
              {editingMessageId && (
                <div className="border-l-4 border-green-500 bg-green-50 dark:bg-dark-background-200 dark:border-green-400 dark:text-white p-2 mt-2 flex justify-between text-sm items-center">
                  <span className="truncate">Editing message</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { cancelEdit(); }} className="text-sm text-red-500">Cancel</button>
                  </div>
                </div>
              )}

              {/* INPUT */}
              <div className="flex gap-2 mt-2 items-end relative">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker((s) => !s)}
                    className="text-2xl p-1 rounded hover:bg-gray-100 dark:hover:bg-dark-background-200"
                  >
                    😊
                  </button>

                  {showEmojiPicker && (
                    <div ref={emojiPickerRef} className="absolute bottom-12 left-0 z-50">
                      <EmojiPicker onEmojiClick={(e) => handleEmojiClick(e)} />
                    </div>
                  )}
                </div>

                <Input
                  ref={inputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message…"
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>{editingMessageId ? "Save" : "Send"}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Notifications moved to main header */}

      {/* Message actions modal */}
      <MessageActionsModal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        messageText={actionModalMessage?.message}
        onReply={() => {
          if (actionModalMessage) {
            setReplyTo(actionModalMessage);
            // Focus the input so user can start typing immediately
            setTimeout(() => inputRef.current?.focus(), 50);
          }
        }}
        onEdit={() => {
          if (actionModalMessage) startEdit(actionModalMessage);
        }}
        onDelete={() => {
          setDeleteModalOpen(true);
        }}
      />

      <DeleteMessageModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDeleteForMe={() => {
          if (actionModalMessage) {
            handleDelete(actionModalMessage, "me");
          }
        }}
        onDeleteForEveryone={() => {
          if (actionModalMessage) {
            handleDelete(actionModalMessage, "everyone");
          }
        }}
      />
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
// import { toast } from "sonner";

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
