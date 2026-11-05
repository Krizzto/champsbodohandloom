import React, { useState, useRef, useEffect } from 'react';
import { ChatHeader } from './ChatHeader';
import { ExpertiseSelector, ExpertiseLevel } from './ExpertiseSelector';
import { ChatMessage, ChatMessageProps } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { SuggestedQuestions } from './SuggestedQuestions';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEYS, DEFAULT_EXPERTISE } from '../../utils/constants';
import { Sparkles, Trash2 } from 'lucide-react';
import { queryHeritageKnowledge } from '../../services/heritageKnowledge';
import { useMuseumStore } from '../../store/museumStore';

export interface ChatPanelProps {
  onClose?: () => void;
  onQuerySubmit?: (payload: { query: string; expertise: ExpertiseLevel }) => void;
  className?: string;
}

const TOPIC_CHIPS = [
  'Traditional weaving',
  'Handloom tools',
  'Textiles and traditional garments',
  'Agor motifs',
  'Natural dyes and materials',
  'Cultural practices',
  'Weaving processes'
];

export const ChatPanel: React.FC<ChatPanelProps> = ({
  onClose,
  onQuerySubmit,
  className = ''
}) => {
  const setAIExpertise = useMuseumStore((state) => state.setAIExpertise);

  // Store user expertise level in localStorage; defaults to 'basic'
  const [expertise, setExpertise] = useLocalStorage<ExpertiseLevel>(
    LOCAL_STORAGE_KEYS.EXPERTISE_LEVEL,
    DEFAULT_EXPERTISE
  );

  const handleExpertiseChange = (newLevel: ExpertiseLevel) => {
    setExpertise(newLevel);
    setAIExpertise(newLevel);
  };

  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [isAnswering, setIsAnswering] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAnswering]);

  const handleSend = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || isAnswering) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Append user message
    const userMsg: ChatMessageProps = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp
    };

    // 2. Append temporary loading indicator
    const loadingMsgId = `loading-${Date.now()}`;
    const loadingMsg: ChatMessageProps = {
      id: loadingMsgId,
      role: 'assistant',
      content: '',
      timestamp,
      isLoading: true
    };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setIsAnswering(true);

    // Notify external handler if provided
    if (onQuerySubmit) {
      onQuerySubmit({ query: trimmed, expertise });
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: trimmed,
          expertise,
          expertiseLevel: expertise,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();

      const sourceStrings: string[] = Array.isArray(data.sources)
        ? data.sources.map((s: { title: string; section?: string; sourceFile?: string }) =>
            s.title ? `${s.title}${s.section ? ` · ${s.section}` : ''}` : s.sourceFile || 'Archival record'
          )
        : [];

      const graphSummaries: string[] = Array.isArray(data.graphContext?.entities)
        ? data.graphContext.entities.slice(0, 4).map((e: { name: string; type: string }) => `${e.name} [${e.type}]`)
        : [];

      const assistantMsg: ChatMessageProps = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.answer || 'Information retrieved from knowledge graph.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: sourceStrings,
        navigation: data.navigationAction || null,
        graphContextSummary: graphSummaries,
        insufficientEvidence: Boolean(data.insufficientEvidence),
        expertiseLevel: data.expertiseLevel || data.expertise || expertise,
      };

      setMessages((prev) =>
        prev.map((msg) => (msg.id === loadingMsgId ? assistantMsg : msg))
      );
    } catch {
      // Offline fallback to local repository knowledge
      try {
        const fallback = queryHeritageKnowledge(trimmed, expertise);
        const assistantMsg: ChatMessageProps = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: fallback.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: fallback.sources,
          expertiseLevel: expertise,
        };

        setMessages((prev) =>
          prev.map((msg) => (msg.id === loadingMsgId ? assistantMsg : msg))
        );
      } catch {
        const errorMsg: ChatMessageProps = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Unable to retrieve heritage documentation at this moment. Please check connectivity or backend.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
        };

        setMessages((prev) =>
          prev.map((msg) => (msg.id === loadingMsgId ? errorMsg : msg))
        );
      }
    } finally {
      setIsAnswering(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
  };

  return (
    <div className={`flex flex-col h-full bg-[#FAF8F5] text-[#171513] overflow-hidden ${className}`}>
      {/* 1. Header with Title, Subtitle, and Close button */}
      <ChatHeader onClose={onClose} />

      {/* 2. Compact Expertise Selector (Basic vs Intermediate) */}
      <div className="px-4 py-2.5 sm:px-5 sm:py-3 bg-white border-b border-stone-200 shrink-0">
        <ExpertiseSelector selectedLevel={expertise} onSelect={handleExpertiseChange} />
      </div>

      {/* 3. Conversation & Message Scroll Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5 space-y-4"
      >
        {messages.length === 0 ? (
          /* Welcome / Initial State */
          <div className="flex flex-col py-2 sm:py-3 space-y-4">
            {/* Header intro */}
            <div className="text-center space-y-1.5">
              <div className="inline-flex w-11 h-11 rounded-2xl bg-[#FFE600]/25 border border-[#FFE600]/80 items-center justify-center text-[#185ADB] shadow-2xs mb-0.5">
                <Sparkles className="w-5 h-5 fill-[#FFE600] text-[#185ADB]" />
              </div>
              <h3 className="text-xl font-bold font-editorial text-stone-900 leading-snug">
                Explore Bodo Handloom Heritage
              </h3>
              <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                Ask questions about traditional weaving, handloom tools, textiles, motifs, and cultural practices.
              </p>
            </div>

            {/* Key Topics Chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Heritage Topics
              </span>
              <div className="flex flex-wrap gap-1.5">
                {TOPIC_CHIPS.map((topic, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(`Tell me about ${topic}`)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer shadow-2xs"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Suggested Questions */}
            <SuggestedQuestions
              onSelectQuestion={handleSend}
              className="pt-2"
            />
          </div>
        ) : (
          <div className="space-y-3.5">
            {/* History utility bar */}
            <div className="flex items-center justify-between pb-1 text-[11px] text-stone-500 border-b border-stone-200/60">
              <span>{messages.filter((m) => m.role === 'user').length} question(s) asked</span>
              <button
                type="button"
                onClick={handleClearHistory}
                className="flex items-center gap-1 text-stone-500 hover:text-rose-700 transition-colors cursor-pointer"
                title="Clear conversation history"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear chat</span>
              </button>
            </div>

            {messages.map((msg) => (
              <ChatMessage key={msg.id} {...msg} />
            ))}
          </div>
        )}
      </div>

      {/* 4. Fixed Bottom Input Area */}
      <div className="p-3.5 sm:p-4 bg-white border-t border-stone-200 shrink-0">
        <ChatInput
          onSend={handleSend}
          disabled={isAnswering}
          placeholder="Ask about Bodo handloom heritage..."
        />
      </div>
    </div>
  );
};
