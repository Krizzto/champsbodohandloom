import React from 'react';
import { HelpCircle, ChevronRight } from 'lucide-react';
import { SUGGESTED_QUESTIONS } from '../../utils/constants';

export interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
  className?: string;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  onSelectQuestion,
  className = ''
}) => {
  // Enforce a maximum of 4 suggested questions
  const questions = SUGGESTED_QUESTIONS.slice(0, 4);

  return (
    <div className={`space-y-2 text-left ${className}`}>
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
        <HelpCircle className="w-3.5 h-3.5 text-[#185ADB]" />
        <span>Suggested Questions</span>
      </div>

      <div className="flex flex-col gap-1.5">
        {questions.map((question, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectQuestion(question)}
            className="flex items-center justify-between text-left px-3 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 hover:border-stone-300 text-xs text-stone-800 transition-all cursor-pointer group shadow-2xs"
          >
            <span className="line-clamp-2 pr-2 font-medium">{question}</span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </button>
        ))}
      </div>
    </div>
  );
};
