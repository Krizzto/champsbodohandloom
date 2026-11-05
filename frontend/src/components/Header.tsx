import React, { useState } from 'react';
import { Search, Sparkles, Menu, X } from 'lucide-react';
import { BodoLogo } from './CulturalVisuals';
import { useMuseumStore } from '../store/museumStore';

interface HeaderProps {
  onNavigate?: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setSearchOpen, setSearchQuery, toggleAIPanel } = useMuseumStore();
  const [localSearch, setLocalSearch] = useState('');

  const navLinks = [
    { label: 'home', id: 'hero' },
    { label: 'About', id: 'about' },
    { label: 'Resources', id: 'agor' },
    { label: 'Contribution', id: 'weaver' },
    { label: 'Media', id: 'museum' },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      setSearchOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-4">
          <BodoLogo className="w-10 h-10" />
          <div className="hidden sm:block">
            <span className="text-xs uppercase tracking-widest font-semibold text-stone-500 block font-editorial">
              Digital Heritage Archive
            </span>
            <span className="text-sm font-bold text-stone-900 tracking-tight font-editorial">
              Bodoland Territorial Region
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.id)}
              className="px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:text-black rounded-full hover:bg-stone-200/60 transition-colors cursor-pointer capitalize font-editorial"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Global Search and Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger */}
          <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search motifs, tools, weavers..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-48 lg:w-64 pl-8 pr-3 py-1.5 text-xs rounded-full bg-stone-100 border border-stone-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#171513] focus:bg-white transition-all font-editorial"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
          </form>

          {/* Search icon button for mobile */}
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Open search dialog"
            className="sm:hidden p-2 rounded-full text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Quick AI Trigger */}
          <button
            onClick={toggleAIPanel}
            aria-label="Open AI Assistant"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-[#185ADB] text-white hover:bg-[#1242A6] transition-all shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFE600]" />
            <span className="hidden lg:inline">Bodo AI</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-200 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-stone-200 px-6 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.id)}
                className="w-full text-left px-4 py-2.5 text-xs font-medium rounded-full bg-white border border-stone-200 text-stone-800"
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="pt-2 flex items-center justify-end border-t border-stone-200">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                toggleAIPanel();
              }}
              className="text-xs text-[#185ADB] font-semibold underline"
            >
              Ask AI Guide
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
