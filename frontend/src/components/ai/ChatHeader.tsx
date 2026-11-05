import React from 'react';
import { Sparkles, X } from 'lucide-react';

export interface ChatHeaderProps {
  onClose?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5 border-b border-stone-200 bg-white">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#185ADB] flex items-center justify-center text-white shadow-xs shrink-0">
          <Sparkles className="w-4 h-4 text-[#FFE600] fill-[#FFE600]" />
        </div>
        <div>
          <h2 className="text-base font-bold font-editorial text-stone-900 leading-tight">
            Bodo Heritage AI
          </h2>
          <p className="text-xs text-stone-500 font-editorial">
            Knowledge Assistant
          </p>
        </div>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Assistant"
          className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
