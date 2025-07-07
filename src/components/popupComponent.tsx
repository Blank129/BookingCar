
import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, X } from 'lucide-react';

type PopupStatus = 'warning' | 'success' | 'error';

interface PopupProps {
  isOpen: boolean;
  status: PopupStatus;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const PopupComponent: React.FC<PopupProps> = ({
  isOpen,
  status,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy'
}) => {
  if (!isOpen) return null;

  const getStatusConfig = () => {
    switch (status) {
      case 'warning':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
          iconBg: 'bg-yellow-100',
          confirmBtn: 'bg-yellow-500 hover:bg-yellow-600 text-white'
        };
      case 'success':
        return {
          icon: <CheckCircle className="w-6 h-6 text-green-500" />,
          iconBg: 'bg-green-100',
          confirmBtn: 'bg-green-500 hover:bg-green-600 text-white'
        };
      case 'error':
        return {
          icon: <XCircle className="w-6 h-6 text-red-500" />,
          iconBg: 'bg-red-100',
          confirmBtn: 'bg-red-500 hover:bg-red-600 text-white'
        };
      default:
        return {
          icon: <AlertTriangle className="w-6 h-6 text-gray-500" />,
          iconBg: 'bg-gray-100',
          confirmBtn: 'bg-gray-500 hover:bg-gray-600 text-white'
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2]">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 relative">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className={`w-12 h-12 rounded-full ${statusConfig.iconBg} flex items-center justify-center mb-4`}>
          {statusConfig.icon}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          {description}
        </p>

        {/* Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${statusConfig.confirmBtn}`}
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};
