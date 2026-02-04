"use client";

import { Modal } from "@/components/modal";
import { Button } from "@/components/common-elements/button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDeleteForMe: () => void;
  onDeleteForEveryone: () => void;
}

export function DeleteMessageModal({ isOpen, onClose, onDeleteForMe, onDeleteForEveryone }: Props) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="!max-w-[428px] w-[90vw] scrollbar-hide bg-white dark:bg-dark-background-100 rounded-[16px] max-h-[90vh] overflow-y-auto p-6"
    >
      <div className="w-full flex flex-col items-center gap-4">
        <div className="text-center">
          <p className="text-lg font-bold mb-2">Delete message</p>
          <p className="text-gray-600 dark:text-dark-text text-sm">Do you want to delete this message for yourself or for everyone?</p>
        </div>
      </div>

      <div className="flex gap-3 pt-6">
        <Button
          type="button"
          onClick={() => {
            onDeleteForMe();
          }}
          className={`flex-1 h-[52px] cursor-pointer bg-amber-500 text-white hover:bg-amber-600`}
        >
          Delete for me
        </Button>
        <Button
          type="button"
          onClick={() => {
            onDeleteForEveryone();
          }}
          className={`flex-1 h-[52px] cursor-pointer text-white bg-[#FB2C36]`}
        >
          Delete for everyone
        </Button>
      </div>
    </Modal>
  );
}