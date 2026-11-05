import React from 'react';
import { heritageStats } from '../../data/culturalData';
import { Sparkles, GitBranch, MapPin, ShieldCheck } from 'lucide-react';

export const HeritageStats: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-[#FFE600]" />;
      case 'GitBranch': return <GitBranch className="w-5 h-5 text-[#185ADB]" />;
      case 'MapPin': return <MapPin className="w-5 h-5 text-[#8B2635]" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      default: return <Sparkles className="w-5 h-5 text-[#FFE600]" />;
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-[#F4EFE6] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {heritageStats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 font-sans">
                  {stat.label}
                </span>
                <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center">
                  {getIcon(stat.icon)}
                </div>
              </div>

              <div className="text-2xl sm:text-3xl font-bold font-editorial text-stone-900">
                {stat.value}
              </div>

              <p className="text-xs text-stone-600 font-editorial leading-tight">
                {stat.subtext}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
