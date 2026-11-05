import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

export interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  placeholder = 'Ask about Bodo handloom heritage...',
  disabled = false
}) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically when mounted
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center w-full">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-label="Ask about Bodo handloom heritage"
        className="w-full pl-4 pr-11 py-2.5 text-xs sm:text-sm bg-white rounded-xl border border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#185ADB] focus:border-transparent transition-all shadow-xs disabled:bg-stone-50 disabled:text-stone-400"
      />
      <button
        type="submit"
        disabled={!input.trim() || disabled}
        aria-label="Send question"
        className="absolute right-1.5 p-1.5 rounded-lg bg-[#171513] text-white hover:bg-[#2C2825] disabled:opacity-40 disabled:hover:bg-[#171513] transition-all cursor-pointer disabled:cursor-not-allowed shadow-xs"
      >
        <Send className="w-4 h-4 text-[#FFE600]" />
      </button>
    </form>
  );
};
