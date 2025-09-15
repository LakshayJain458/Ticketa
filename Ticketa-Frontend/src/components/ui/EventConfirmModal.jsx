import React from "react";

const EventConfirmModal = ({ open, eventTitle, onCancel, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 rounded-lg max-w-md w-full p-6 border border-gray-800">
        <h3 className="text-lg font-semibold mb-2">Open Scanner</h3>
        <p className="text-sm text-gray-300 mb-4">Open scanner for <span className="font-semibold">{eventTitle}</span>?</p>

        <div className="flex gap-3 justify-end">
          <button
            className="px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white"
            onClick={onConfirm}
          >
            Open Scanner
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventConfirmModal;
