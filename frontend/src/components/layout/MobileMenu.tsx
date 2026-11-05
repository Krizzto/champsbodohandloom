import React from 'react';
import { X, Sparkles, Box, Compass } from 'lucide-react';
import { navItems } from '../../data/navigation';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  currentPath,
  onNavigate
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex flex-col bg-[#FAF8F5]">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FFE600] flex items-center justify-center font-bold text-xs text-[#171513]">
            BD
          </div>
          <span className="font-bold text-sm text-stone-900 font-editorial">
            Bodo Handloom Museum
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="p-2 rounded-lg text-stone-500 hover:text-black hover:bg-stone-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-2">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.path);
                onClose();
              }}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-[#171513] text-[#FAF8F5] shadow-xs'
                  : 'bg-white hover:bg-stone-100 text-stone-800 border border-stone-200'
              }`}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-mono ${
                    isActive ? 'bg-[#FFE600] text-[#171513]' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-6 border-t border-stone-200 bg-white space-y-3">
        <div className="flex items-center gap-2 text-xs text-stone-600">
          <Sparkles className="w-4 h-4 text-[#185ADB]" />
          <span>Cultural Heritage Digital Archive</span>
        </div>
        <p className="text-[11px] text-stone-400 font-editorial">
          Preserving living weaving, Agor geometries, and tools of Northeast India.
        </p>
      </div>
    </div>
  );
};
