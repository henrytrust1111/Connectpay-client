"use client";

import { Modal } from "@/components/modal";
import { Button } from "@/components/common-elements/button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  danger = true,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="!max-w-[428px] w-[90vw] scrollbar-hide bg-white rounded-[16px] max-h-[90vh] overflow-y-auto"
    >
      <div className="w-full flex flex-col items-center gap-4">
        <div className="text-center">
          <p className="text-lg font-bold mb-2">{title}</p>
          <p className="text-gray-600 dark:text-dark-text text-sm">{description}</p>
        </div>
      </div>

      <div className="flex gap-3 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1 h-[52px] font-bold shadow-[15px] border-b-2 border-gray-300 dark:bg-dark-background-50"
        >
          {cancelLabel}
        </Button>
        <Button
          type="button"
          onClick={() => {
            onConfirm();
            // onClose();
          }}
          className={`flex-1 h-[52px] cursor-pointer text-white ${
            danger ? "bg-[#FB2C36] hover:bg-red-700" : "bg-primary"
          }`}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
