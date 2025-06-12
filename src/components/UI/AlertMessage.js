import React from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const AlertMessage = ({ message, type, onClose }) => {
  const baseClasses = "p-4 rounded-md flex items-center justify-between shadow-lg";
  const typeClasses = {
    success: "bg-green-100 border border-green-400 text-green-700",
    error: "bg-red-100 border border-red-400 text-red-700",
    warning: "bg-yellow-100 border border-yellow-400 text-yellow-700",
  };
  const Icon = type === 'success' ? CheckCircle : type === 'error' ? AlertCircle : AlertCircle; // Sửa lại Icon cho warning

  return (
    <div className={`${baseClasses} ${typeClasses[type] || typeClasses.warning} fixed top-5 right-5 z-50 max-w-sm w-full`}>
      <div className="flex items-center">
        <Icon size={20} className="mr-2" />
        <span>{message}</span>
      </div>
      <button onClick={onClose} className="ml-4">
        <X size={20} />
      </button>
    </div>
  );
};

export default AlertMessage;