"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!);
    }

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, []);

  // Subscribe to receive_message events
  const onReceiveMessage = (callback: (data: any) => void) => {
    if (!socket) return;
    socket.off("receive_message"); // remove previous listener to prevent duplicates
    socket.on("receive_message", callback);
  };

  // Remove listener explicitly
  const offReceiveMessage = () => {
    if (!socket) return;
    socket.off("receive_message");
  };

  const sendMessage = (senderId: string, receiverId: string, message: string, replyToMessageId?: string | null) => {
    socket?.emit("send_message", {
      sender_id: senderId,
      receiver_id: receiverId,
      message,
       reply_to_message_id: replyToMessageId ?? null,
    });
  };

  // Emit an edit message request
  const emitEditMessage = (message_id: string, editor_id: string, new_message: string) => {
    socket?.emit("edit_message", { message_id, editor_id, new_message });
  };

  // Listen for message_edited events
  const onMessageEdited = (callback: (updatedMessage: any) => void) => {
    if (!socket) return;
    socket.off("message_edited");
    socket.on("message_edited", callback);
  };

  // Emit a delete message request
  const emitDeleteMessage = (message_id: string, requester_id: string, type: "me" | "everyone") => {
    socket?.emit("delete_message", { message_id, requester_id, type });
  };

  // Listen for message_deleted events
  const onMessageDeleted = (callback: (data: any) => void) => {
    if (!socket) return;
    socket.off("message_deleted");
    socket.on("message_deleted", callback);
  };

  // Listen for socket errors (emitted to the emitter)
  const onSocketError = (callback: (err: any) => void) => {
    if (!socket) return;
    socket.off("error");
    socket.on("error", callback);
  };

  return {
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
  };
};














// "use client";

// import { useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";
// import { useSession } from "./useSession";

// let socket: Socket | null = null;

// export const useSocket = () => {
//   const { session } = useSession();
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//     if (session?.token && !socket) {
//       socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5001", {
//         auth: {
//           token: session.token,
//         },
//       });

//       socket.on("connect", () => {
//         setIsConnected(true);
//       });

//       socket.on("disconnect", () => {
//         setIsConnected(false);
//       });
//     }

//     return () => {
//       if (socket) {
//         socket.disconnect();
//         socket = null;
//         setIsConnected(false);
//       }
//     };
//   }, [session]);

//   const sendMessage = (senderId: string, receiverId: string, message: string) => {
//     if (socket) {
//       socket.emit("send_message", { senderId, receiverId, message });
//     }
//   };

//   const onReceiveMessage = (callback: (data: any) => void) => {
//     if (socket) {
//       socket.on("receive_message", callback);
//     }
//   };

//   return { socket, isConnected, sendMessage, onReceiveMessage };
// };