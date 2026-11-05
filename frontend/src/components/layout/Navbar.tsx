import React, { useState } from 'react';
import { Menu, Sparkles, Box, Compass } from 'lucide-react';
import { navItems } from '../../data/navigation';
import { MobileMenu } from './MobileMenu';

export interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/92 backdrop-blur-md border-b border-stone-200/90 transition-all select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-[#171513] border border-[#FFE600] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <span className="font-editorial font-bold text-xs text-[#FFE600]">बद</span>
              </div>
              <div>
                <span className="block font-bold tracking-tight text-sm sm:text-base text-stone-900 font-editorial leading-tight">
                  BODO HANDLOOM
                </span>
                <span className="block text-[10px] tracking-widest uppercase text-stone-500 font-sans font-semibold">
                  DIGITAL MUSEUM
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.path)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-[#171513] text-[#FAF8F5] border-[#171513] shadow-xs'
                      : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200 shadow-2xs'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {item.label}
                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full uppercase font-mono ${
                          isActive ? 'bg-[#FFE600] text-[#171513]' : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: Quick Access to AI and Mobile Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('/ai')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#185ADB] hover:bg-[#1242A6] text-white text-xs font-semibold shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              title="Open AI Knowledge Assistant (Frontend UI)"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFE600] fill-[#FFE600]" />
              <span>AI Guide</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile navigation"
              className="md:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-200 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        currentPath={currentPath}
        onNavigate={onNavigate}
      />
    </>
  );
};
