import React from 'react';
import { User, Sparkles, BookOpen, AlertTriangle, Compass, Box, Layers, ShieldCheck } from 'lucide-react';
import { NavigationAction } from '../../types';
import { useMuseumStore } from '../../store/museumStore';

export interface ChatMessageProps {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  sources?: string[];
  navigation?: NavigationAction | null;
  graphContextSummary?: string[];
  insufficientEvidence?: boolean;
  expertiseLevel?: 'basic' | 'intermediate';
  isLoading?: boolean;
  isError?: boolean;
}

/**
 * Helper to parse inline markdown (bolding **text** and italics *text*)
 */
function renderInlineFormatted(text: string, isUser: boolean) {
  const parts: React.ReactNode[] = [];
  // Match **bold** or *italic*
  const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      const boldText = token.slice(2, -2);
      parts.push(
        <strong
          key={`${match.index}-b`}
          className={isUser ? 'font-semibold text-white' : 'font-semibold text-stone-900'}
        >
          {boldText}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      const italicText = token.slice(1, -1);
      parts.push(
        <em key={`${match.index}-i`} className="italic opacity-90">
          {italicText}
        </em>
      );
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

/**
 * Formats multi-paragraph assistant/user messages with bullet lists and paragraphs
 */
function FormattedContent({ content, isUser }: { content: string; isUser: boolean }) {
  const paragraphs = content.split(/\n\n+/);

  return (
    <div className="space-y-2.5 text-xs sm:text-sm leading-relaxed">
      {paragraphs.map((para, pIdx) => {
        const lines = para.split('\n');
        const isBulletList = lines.every((line) => line.trim().startsWith('•') || line.trim().startsWith('-') || /^\d+\./.test(line.trim()));

        if (isBulletList) {
          return (
            <ul key={pIdx} className="space-y-1.5 pl-1">
              {lines.map((line, lIdx) => {
                const cleanLine = line.replace(/^[•\-]\s*/, '').replace(/^\d+\.\s*/, '');
                return (
                  <li key={lIdx} className="flex items-start gap-2">
                    <span
                      className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                        isUser ? 'bg-[#FFE600]' : 'bg-[#185ADB]'
                      }`}
                    />
                    <span className="flex-1">
                      {renderInlineFormatted(cleanLine, isUser)}
                    </span>
                  </li>
                );
              })}
            </ul>
          );
        }

        return (
          <p key={pIdx} className="whitespace-pre-line">
            {renderInlineFormatted(para, isUser)}
          </p>
        );
      })}
    </div>
  );
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  content,
  timestamp,
  sources,
  navigation,
  graphContextSummary,
  insufficientEvidence,
  expertiseLevel,
  isLoading = false,
  isError = false,
}) => {
  const isUser = role === 'user';
  const { openVRMuseum } = useMuseumStore();

  const handleNavigateClick = () => {
    if (navigation) {
      openVRMuseum(navigation);
    }
  };

  return (
    <div className={`flex gap-2.5 text-sm ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-[#185ADB] flex items-center justify-center shrink-0 text-white shadow-xs mt-0.5">
          <Sparkles className="w-4 h-4 text-[#FFE600] fill-[#FFE600]" />
        </div>
      )}

      <div
        className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-3.5 sm:p-4 space-y-2 transition-all ${
          isUser
            ? 'bg-[#171513] text-[#FAF8F5] rounded-tr-xs'
            : isError
            ? 'bg-rose-50 border border-rose-200 text-rose-900 rounded-tl-xs'
            : 'bg-white border border-stone-200 text-stone-900 rounded-tl-xs shadow-xs'
        }`}
      >
        {/* Header row */}
        <div className="flex items-center justify-between gap-3 border-b pb-1.5 mb-1.5 border-current/10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-75">
              {isUser ? 'You' : 'Bodo Heritage AI'}
            </span>
            {!isUser && expertiseLevel && (
              <span
                className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full border ${
                  expertiseLevel === 'intermediate'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {expertiseLevel === 'intermediate' ? 'Intermediate' : 'Basic'}
              </span>
            )}
          </div>
          {timestamp && (
            <span className="text-[10px] opacity-60 font-mono">{timestamp}</span>
          )}
        </div>

        {/* Loading state indicator */}
        {isLoading ? (
          <div className="flex items-center gap-2 py-1.5 text-xs text-stone-500">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-[#185ADB] animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 rounded-full bg-[#185ADB] animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 rounded-full bg-[#185ADB] animate-bounce" />
            </div>
            <span className="italic font-medium text-[11px]">Consulting Bodo heritage archive & knowledge graph...</span>
          </div>
        ) : isError ? (
          <div className="flex items-start gap-2 text-xs text-rose-800">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Unable to process inquiry</p>
              <p className="mt-0.5 text-rose-700">{content}</p>
            </div>
          </div>
        ) : (
          <>
            {insufficientEvidence && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-amber-50 border border-amber-200 text-[11px] text-amber-800 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Source Grounding Check: Unsubstantiated claims abstained</span>
              </div>
            )}
            <FormattedContent content={content} isUser={isUser} />
          </>
        )}

        {/* 3D Exhibit Navigation Action Card */}
        {!isLoading && navigation && (
          <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-stone-900 to-[#185ADB] text-white space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FFE600]">
                <Compass className="w-3.5 h-3.5" />
                <span>Virtual Museum Navigation</span>
              </div>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
                {navigation.targetRoom || 'Village'}
              </span>
            </div>
            <p className="text-xs text-stone-200">
              Direct viewpoint to <strong>{navigation.exhibitName}</strong> in the 3D Heritage Village.
            </p>
            <button
              type="button"
              onClick={handleNavigateClick}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#FFE600] text-stone-950 hover:bg-yellow-400 font-bold text-xs transition-colors cursor-pointer shadow-xs"
            >
              <Box className="w-3.5 h-3.5 text-stone-900" />
              <span>EXPLORE {navigation.exhibitName.toUpperCase()} IN 3D</span>
            </button>
          </div>
        )}

        {/* Graph Context Entities / Relationships */}
        {!isLoading && graphContextSummary && graphContextSummary.length > 0 && (
          <div className="pt-2 border-t border-stone-200/60 text-xs text-stone-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[10px] uppercase text-stone-500 tracking-wider">
              <Layers className="w-3 h-3 text-[#8B2635]" />
              <span>Knowledge Graph Context</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {graphContextSummary.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-stone-100 border border-stone-200 text-[10px] text-stone-700 font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Sources / Citations in compact secondary style */}
        {!isLoading && sources && sources.length > 0 && (
          <div className="pt-2 border-t border-stone-200/80 text-xs text-stone-600 space-y-1 mt-2">
            <div className="flex items-center gap-1.5 font-bold text-[10px] uppercase text-stone-500 tracking-wider">
              <BookOpen className="w-3 h-3 text-[#185ADB]" />
              <span>Cultural Citations</span>
            </div>
            <ul className="space-y-0.5 text-[11px] text-stone-500 italic pl-1">
              {sources.map((src, idx) => (
                <li key={idx} className="truncate">
                  • {src}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center shrink-0 text-stone-700 mt-0.5">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
