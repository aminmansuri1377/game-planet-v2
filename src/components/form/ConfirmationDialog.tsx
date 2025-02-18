import React from "react";

function ConfirmationDialog({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg">
        <p>Are you accept this order?</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onConfirm}
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationDialog;
