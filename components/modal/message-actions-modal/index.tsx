"use client";

import { Modal } from "@/components/modal";
import { Button } from "@/components/common-elements/button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  messageText?: string | null;
  onReply: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function MessageActionsModal({ isOpen, onClose, messageText, onReply, onEdit, onDelete }: Props) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="!max-w-[360px] w-[90vw] bg-white dark:bg-dark-background-100 rounded-lg p-4"
    >
      <div className="space-y-3">
        <div className="text-sm text-gray-700 dark:text-dark-text">{messageText}</div>
        <div className="flex flex-col gap-2 pt-2">
          <Button variant="outline" onClick={() => { onReply(); onClose(); }} className="justify-start">
            Reply
          </Button>
          <Button variant="outline" onClick={() => { onEdit(); onClose(); }} className="justify-start">
            Edit
          </Button>
          <Button variant="destructive" onClick={() => { onDelete(); onClose(); }} className="justify-start">
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}