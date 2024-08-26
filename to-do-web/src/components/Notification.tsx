import React, { useState, useEffect } from "react";

interface NotificationProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Close after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white ${
        type === "success"
          ? "bg-green-500"
          : type === "error"
          ? "bg-red-500"
          : "bg-blue-500"
      }`}
    >
      <p>{message}</p>
    </div>
  );
};

export default Notification;
