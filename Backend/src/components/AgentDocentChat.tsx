import React, { useState, useRef, useEffect } from 'react';
import { AgentMessage, ExhibitItem } from '../types/museum';
import { OKF_PROCESSES, MUSEUM_EXHIBITS, MUSEUM_GALLERIES, queryKnowledgeBase } from '../data/museumData';
import { Bot, User, Send, Mic, MicOff, Volume2, VolumeX, Sparkles, Navigation, Layers, CheckCircle2 } from 'lucide-react';

interface AgentDocentChatProps {
  onNavigateToExhibit: (exhibit: ExhibitItem) => void;
  onNavigateToGallery: (galleryId: string) => void;
  onOpenBenchmark: () => void;
  currentExhibit: ExhibitItem | null;
}

export const AgentDocentChat: React.FC<AgentDocentChatProps> = ({
  onNavigateToExhibit,
  onNavigateToGallery,
  onOpenBenchmark,
  currentExhibit
}) => {
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: 'welcome_1',
      sender: 'agent',
      text: "Khulumkha! I am your Multimodal AI Museum Docent for the Bodo Handloom & Virtual Reality Heritage Gallery. You can ask me questions about traditional cotton ginning, eri silkworm rearing, spinning wheels, or looming techniques. You can also command me: 'Take me to the Sal loom' or 'Show me the sizing station'!",
      timestamp: 'Just now',
      suggestedPrompts: [
        "Take me to the Sal throw-shuttle loom",
        "How are seeds and dirt removed from raw cotton?",
        "Why is yarn coated in rice powder and wheat flour?",
        "What is the Baleb made of in looming?"
      ]
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Text to Speech
  const speakText = (text: string) => {
    if (!voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Remove markdown or technical symbols for cleaner speech
      const cleanText = text.replace(/[*#_`]/g, '').slice(0, 300);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech synthesis error handled gracefully
    }
  };

  // Speech Recognition (Web Speech API)
  const toggleListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition ||
                              (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your query!");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recognition = new (SpeechRecognition as any)();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        handleSendQuery(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSendQuery = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: AgentMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsProcessing(true);

    // Agentic Intent & Retrieval Analysis
    setTimeout(() => {
      processAgentResponse(query);
      setIsProcessing(false);
    }, 450);
  };

  const processAgentResponse = (query: string) => {
    const lower = query.toLowerCase();

    // 1. Tool intent: Benchmark Suite
    if (lower.includes('benchmark') || lower.includes('retrieval test') || lower.includes('evaluate questions')) {
      onOpenBenchmark();
      const response: AgentMessage = {
        id: `agent_${Date.now()}`,
        sender: 'agent',
        text: "Opening the OKF Ingestion Benchmark Suite! This runs live evaluation across the 15 benchmark questions from retrieval_questions.py against all 9 traditional Bodo handloom concepts.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTaken: {
          type: 'ran_benchmark',
          label: 'Executed: run_retrieval_benchmark()'
        }
      };
      setMessages(prev => [...prev, response]);
      speakText(response.text);
      return;
    }

    // 2. Tool intent: Direct Navigation Command to Exhibit
    let targetExhibit = MUSEUM_EXHIBITS.find(ex =>
      lower.includes(ex.name.toLowerCase()) ||
      lower.includes(ex.nativeName.toLowerCase()) ||
      (ex.modelType === 'loom' && lower.includes('loom')) && lower.includes(ex.id.includes('sal') ? 'sal' : '')
    );

    if (lower.includes('ginning') || lower.includes('neotha') || lower.includes('seed')) {
      targetExhibit = MUSEUM_EXHIBITS.find(e => e.id === 'exhibit_ginning_roller') || targetExhibit;
    } else if (lower.includes('spin') || lower.includes('zenther') || lower.includes('chwrkhi')) {
      targetExhibit = MUSEUM_EXHIBITS.find(e => e.id === 'exhibit_spinning_wheel') || targetExhibit;
    } else if (lower.includes('reeling') || lower.includes('cocoon') || lower.includes('steamed') || lower.includes('tharai')) {
      targetExhibit = MUSEUM_EXHIBITS.find(e => e.id === 'exhibit_reeling_basin') || targetExhibit;
    } else if (lower.includes('size') || lower.includes('sizing') || lower.includes('maidi') || lower.includes('rice powder')) {
      targetExhibit = MUSEUM_EXHIBITS.find(e => e.id === 'exhibit_sizing_station') || targetExhibit;
    } else if (lower.includes('warp') || lower.includes('creel') || lower.includes('bobbins') || lower.includes('ji swngnai')) {
      targetExhibit = MUSEUM_EXHIBITS.find(e => e.id === 'exhibit_warp_creel') || targetExhibit;
    } else if (lower.includes('beam') || lower.includes('phannai') || lower.includes('warp sheet')) {
      targetExhibit = MUSEUM_EXHIBITS.find(e => e.id === 'exhibit_beaming_frame') || targetExhibit;
    } else if (lower.includes('looming') || lower.includes('baleb') || lower.includes('nw khonnai') || lower.includes('nw hasung')) {
      targetExhibit = MUSEUM_EXHIBITS.find(e => e.id === 'exhibit_looming_bench') || targetExhibit;
    } else if (lower.includes('aronai') || lower.includes('scarf') || lower.includes('hajw agor')) {
      targetExhibit = MUSEUM_EXHIBITS.find(e => e.id === 'exhibit_aronai_textile') || targetExhibit;
    } else if (lower.includes('dokhona') || lower.includes('dress') || lower.includes('thaosi')) {
      targetExhibit = MUSEUM_EXHIBITS.find(e => e.id === 'exhibit_dokhona_textile') || targetExhibit;
    } else if (lower.includes('thati sal') || lower.includes('fly shuttle')) {
      targetExhibit = MUSEUM_EXHIBITS.find(e => e.id === 'exhibit_thati_sal_loom') || targetExhibit;
    } else if (lower.includes('sal') || lower.includes('throw shuttle') || lower.includes('traditional loom')) {
      targetExhibit = MUSEUM_EXHIBITS.find(e => e.id === 'exhibit_traditional_sal_loom') || targetExhibit;
    }

    // 3. Retrieval Scoring against OKF Knowledge Base
    const matches = queryKnowledgeBase(query);
    const topMatch = matches[0];
    const okfProc = OKF_PROCESSES.find(p => p.title.toLowerCase() === topMatch?.concept.toLowerCase());

    // Navigation trigger
    if (targetExhibit && (lower.includes('take me') || lower.includes('show me') || lower.includes('go to') || lower.includes('navigate'))) {
      onNavigateToExhibit(targetExhibit);
      const navReply: AgentMessage = {
        id: `agent_${Date.now()}`,
        sender: 'agent',
        text: `Navigating 3D camera to the ${targetExhibit.name} (${targetExhibit.nativeName}) in the ${MUSEUM_GALLERIES.find(g => g.id === targetExhibit.galleryId)?.name}. Here, you can examine the authentic apparatus up close!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTaken: {
          type: 'navigated',
          targetId: targetExhibit.id,
          label: `Tool: navigate_to_exhibit('${targetExhibit.id}')`
        },
        suggestedPrompts: [
          `What tools are used in ${targetExhibit.name}?`,
          "Tell me about the cultural significance",
          "Next exhibit in this gallery"
        ]
      };
      setMessages(prev => [...prev, navReply]);
      speakText(navReply.text);
      return;
    }

    // Knowledge Answer Generation with OKF Grounding
    let responseText = "";
    if (okfProc && topMatch.score > 2.0) {
      responseText = `Based on the OKF Knowledge Base (${okfProc.title} / ${okfProc.nativeTerm}):\n\n${okfProc.content}\n\nKey Traditional Implements: ${okfProc.toolsUsed.join(', ')}.`;
      if (targetExhibit) {
        onNavigateToExhibit(targetExhibit);
      }
    } else {
      responseText = `In traditional Bodo handloom culture, weaving encompasses 9 harmonious pre-weaving and weaving processes: Ginning (Neotha), Reeling (softening cocoons in Curcuma leaves), Sizing (Maidi rice starch coating), Spinning (Zenther wheel), Warping (Ji Swngnai), Winding, Beaming (Phannai), Looming (Nw Khonnai with Baleb sticks), and Weaving on the Sal and Thati Sal looms. Which stage would you like to explore?`;
    }

    const replyMsg: AgentMessage = {
      id: `agent_${Date.now()}`,
      sender: 'agent',
      text: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionTaken: okfProc ? {
        type: 'retrieved_knowledge',
        targetId: okfProc.id,
        label: `Retrieved OKF Concept: ${okfProc.title} (Match Score: ${topMatch.score})`
      } : undefined,
      suggestedPrompts: [
        "Take me to this station in 3D",
        "What are the ingredients for sizing?",
        "How long does the weaving process take?"
      ]
    };

    setMessages(prev => [...prev, replyMsg]);
    speakText(responseText);
  };

  return (
    <div className="flex flex-col h-[520px] md:h-[620px] bg-stone-900/90 backdrop-blur-md rounded-2xl border border-stone-800 shadow-2xl overflow-hidden">
      {/* Docent Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-stone-950/80 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-stone-950 shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-stone-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">Aronai AI Docent</h3>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-mono">
                Multimodal Agent
              </span>
            </div>
            <p className="text-[11px] text-stone-400">Grounded on verified Bodo Handloom OKF</p>
          </div>
        </div>

        {/* Audio Mute/Unmute */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-2 rounded-lg border transition-all text-xs flex items-center gap-1.5 ${
              voiceEnabled
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                : 'bg-stone-800/60 border-stone-700 text-stone-400 hover:bg-stone-800'
            }`}
            title={voiceEnabled ? 'Voice Narration: ON' : 'Voice Narration: MUTED'}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-[11px] hidden sm:inline">{voiceEnabled ? 'Voice ON' : 'Muted'}</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => {
          const isAgent = msg.sender === 'agent';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'} space-y-1.5`}
            >
              <div className="flex items-center gap-1.5 px-1 text-[11px] text-stone-400">
                {isAgent ? (
                  <>
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span className="font-semibold text-amber-300">Agentic Docent</span>
                  </>
                ) : (
                  <>
                    <User className="w-3 h-3 text-stone-400" />
                    <span>Visitor</span>
                  </>
                )}
                <span>• {msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                  isAgent
                    ? 'bg-stone-800/90 text-stone-100 border border-stone-700/80 shadow-md rounded-tl-sm'
                    : 'bg-amber-600 text-white shadow-md rounded-tr-sm font-medium'
                }`}
              >
                {msg.text}

                {/* Tool execution badge if present */}
                {msg.actionTaken && (
                  <div className="mt-2.5 pt-2 border-t border-stone-700/60 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{msg.actionTaken.label}</span>
                  </div>
                )}
              </div>

              {/* Quick suggestion prompt pills */}
              {msg.suggestedPrompts && (
                <div className="flex flex-wrap gap-1.5 pt-1 max-w-[90%]">
                  {msg.suggestedPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendQuery(p)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-800/60 hover:bg-amber-500/20 hover:border-amber-500/40 border border-stone-700/60 text-stone-300 hover:text-amber-300 transition-all text-left"
                    >
                      💬 {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isProcessing && (
          <div className="flex items-center gap-2 text-xs text-amber-400 bg-stone-800/50 p-2.5 rounded-xl border border-stone-700/50 w-fit animate-pulse">
            <Bot className="w-4 h-4 animate-bounce" />
            <span>Agent reasoning & retrieving OKF chunks...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar with Voice & Send */}
      <div className="p-3 bg-stone-950/90 border-t border-stone-800">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendQuery();
          }}
          className="flex items-center gap-2"
        >
          {/* Speech-to-text mic button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700 hover:text-white'
            }`}
            title={isListening ? "Listening... click to stop" : "Speak to Agent"}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder={isListening ? "Listening to your voice..." : "Ask the guide or type 'Take me to the loom'..."}
            className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-800 disabled:text-stone-600 text-stone-950 rounded-xl font-bold transition-all shadow shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500 px-1">
          <span>Supported: Voice queries, 3D navigation commands, OKF retrieval</span>
          <button
            type="button"
            onClick={onOpenBenchmark}
            className="text-amber-400 hover:underline flex items-center gap-1"
          >
            <Layers className="w-3 h-3" /> Benchmark Suite
          </button>
        </div>
      </div>
    </div>
  );
};
