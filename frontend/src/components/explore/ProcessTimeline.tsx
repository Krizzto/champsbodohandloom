import React, { useState } from 'react';
import { processes, ProcessStep } from '../../data/processes';
import { ExploreCard } from './ExploreCard';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export interface ProcessTimelineProps {
  onOpen3D?: (toolName: string) => void;
}

export const ProcessTimeline: React.FC<ProcessTimelineProps> = ({ onOpen3D }) => {
  const [activeStepId, setActiveStepId] = useState<string>(processes[0].id);

  const currentStep = processes.find((p) => p.id === activeStepId) || processes[0];
  const currentIndex = processes.findIndex((p) => p.id === currentStep.id);

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + processes.length) % processes.length;
    setActiveStepId(processes[prevIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % processes.length;
    setActiveStepId(processes[nextIdx].id);
  };

  return (
    <div className="space-y-8">
      {/* Horizontal Interactive Timeline Stepper */}
      <div className="relative">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-2 no-scrollbar">
          {processes.map((step, idx) => {
            const isSelected = step.id === currentStep.id;
            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => setActiveStepId(step.id)}
                  className={`relative shrink-0 flex flex-col items-center px-4 py-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#171513] text-white border-[#171513] shadow-md -translate-y-1'
                      : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200 shadow-2xs'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-1.5 ${
                      isSelected ? 'bg-[#FFE600] text-black' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {step.stepNumber}
                  </span>
                  <span className="text-xs font-bold whitespace-nowrap">{step.name}</span>
                  <span className="text-[10px] opacity-75 font-editorial truncate max-w-[85px]">
                    {step.bodoName.split(' ')[0]}
                  </span>
                </button>

                {idx < processes.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-stone-300 shrink-0 hidden sm:block" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Active Stage Deep-Dive Card */}
      <div className="relative">
        <ExploreCard
          process={currentStep}
          totalSteps={processes.length}
          onOpen3D={onOpen3D}
        />

        {/* Navigation arrow controls */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={handlePrev}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Stage</span>
          </button>

          <span className="text-xs text-stone-500 font-editorial">
            Stage {currentIndex + 1} of {processes.length}
          </span>

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#171513] text-white text-xs font-semibold hover:bg-stone-800 cursor-pointer shadow-xs"
          >
            <span>Next Stage</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
