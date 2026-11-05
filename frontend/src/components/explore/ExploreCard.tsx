import React from 'react';
import { ProcessStep } from '../../data/processes';
import { Wrench, Layers, CheckCircle2, Box } from 'lucide-react';
import { Button } from '../ui/Button';

export interface ExploreCardProps {
  process: ProcessStep;
  totalSteps: number;
  onOpen3D?: (toolName: string) => void;
}

export const ExploreCard: React.FC<ExploreCardProps> = ({
  process,
  totalSteps,
  onOpen3D
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#A64B2A] bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 font-sans">
            STAGE {process.stepNumber} OF {totalSteps}
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-stone-900 mt-2">
            {process.name}
          </h3>
          <p className="text-xs text-stone-500 font-medium">{process.bodoName}</p>
        </div>

        {onOpen3D && process.tools.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpen3D(process.tools[0])}
            icon={<Box className="w-3.5 h-3.5 text-[#FFE600]" />}
          >
            Inspect Tool in 3D
          </Button>
        )}
      </div>

      <p className="text-base text-stone-800 font-editorial leading-relaxed">
        {process.detailedProcess}
      </p>

      {/* Cultural significance note */}
      <div className="p-4 rounded-xl bg-[#FAF8F5] border-l-4 border-[#8B2635] space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
          Indigenous Meaning & Community Context
        </span>
        <p className="text-xs sm:text-sm text-stone-600 font-editorial italic">
          {process.culturalImportance}
        </p>
      </div>

      {/* Tools & Materials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-stone-700 text-[10px]">
            <Wrench className="w-3.5 h-3.5 text-[#A64B2A]" />
            <span>Tools & Implements</span>
          </div>
          <ul className="space-y-1 text-stone-600">
            {process.tools.map((tool, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#185ADB]" />
                <span>{tool}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-stone-700 text-[10px]">
            <Layers className="w-3.5 h-3.5 text-[#185ADB]" />
            <span>Materials Consumed</span>
          </div>
          <ul className="space-y-1 text-stone-600">
            {process.materials.map((mat, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B2635]" />
                <span>{mat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
