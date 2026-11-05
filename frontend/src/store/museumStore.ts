import { create } from 'zustand';
import { Artifact, Motif, DyeingStep, ProcessStage, AIChatMessage, NavigationAction } from '../types';
import { ARTIFACTS_DATA, MOTIFS_DATA, DYEING_STEPS, PROCESS_STAGES } from '../data/museumData';
import { ExpertiseLevel } from '../utils/constants';

interface MuseumState {
  // 3D & AR Viewer
  isViewer3DOpen: boolean;
  selected3DArtifact: Artifact | null;
  viewerModelType: 'bobbin' | 'loom' | 'shuttle' | 'spindle' | 'textile';
  open3DViewer: (artifact: Artifact, modelType?: 'bobbin' | 'loom' | 'shuttle' | 'spindle' | 'textile') => void;
  close3DViewer: () => void;

  // AR Modal
  isAROpen: boolean;
  arArtifact: Artifact | null;
  openAR: (artifact: Artifact) => void;
  closeAR: () => void;

  // VR Mode
  isVRMuseumOpen: boolean;
  pendingNavigationAction: NavigationAction | null;
  setPendingNavigationAction: (action: NavigationAction | null) => void;
  openVRMuseum: (navigationAction?: NavigationAction | null | unknown) => void;
  closeVRMuseum: () => void;

  // Search
  isSearchOpen: boolean;
  searchQuery: string;
  setSearchOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;

  // AI Assistant
  isAIPanelOpen: boolean;
  aiExpertise: ExpertiseLevel;
  currentAIContextArtifact: Artifact | null;
  aiMessages: AIChatMessage[];
  isAITyping: boolean;
  toggleAIPanel: () => void;
  openAIPanelWithContext: (artifact: Artifact | null, initialPrompt?: string) => void;
  closeAIPanel: () => void;
  setAIExpertise: (level: ExpertiseLevel) => void;
  sendAIMessage: (text: string) => Promise<void>;

  // Collection of Agor State
  selectedMotifId: string;
  setSelectedMotifId: (id: string) => void;
  getSelectedMotif: () => Motif;

  // Collection of Dyeing State
  selectedDyeingStepId: string;
  setSelectedDyeingStepId: (id: string) => void;
  getSelectedDyeingStep: () => DyeingStep;

  // Process Explorer State
  selectedProcessId: string;
  setSelectedProcessId: (id: string) => void;
  getSelectedProcess: () => ProcessStage;
}

export const useMuseumStore = create<MuseumState>((set, get) => ({
  // 3D Viewer
  isViewer3DOpen: false,
  selected3DArtifact: null,
  viewerModelType: 'textile',
  open3DViewer: (artifact, modelType = 'textile') =>
    set({
      isViewer3DOpen: true,
      selected3DArtifact: artifact,
      viewerModelType: modelType,
    }),
  close3DViewer: () =>
    set({
      isViewer3DOpen: false,
      selected3DArtifact: null,
    }),

  // AR Modal
  isAROpen: false,
  arArtifact: null,
  openAR: (artifact) =>
    set({
      isAROpen: true,
      arArtifact: artifact,
    }),
  closeAR: () =>
    set({
      isAROpen: false,
      arArtifact: null,
    }),

  // VR Museum
  isVRMuseumOpen: false,
  pendingNavigationAction: null,
  setPendingNavigationAction: (action) => set({ pendingNavigationAction: action }),
  openVRMuseum: (actionOrEvent?: unknown) =>
    set({
      isVRMuseumOpen: true,
      pendingNavigationAction:
        actionOrEvent && typeof actionOrEvent === 'object' && 'exhibitId' in actionOrEvent
          ? (actionOrEvent as NavigationAction)
          : null,
    }),
  closeVRMuseum: () => set({ isVRMuseumOpen: false, pendingNavigationAction: null }),

  // Search
  isSearchOpen: false,
  searchQuery: '',
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  // AI Cultural Assistant
  isAIPanelOpen: false,
  aiExpertise: 'basic',
  currentAIContextArtifact: null,
  isAITyping: false,
  aiMessages: [
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Khulumkha (Hello)! I am your Bodo Cultural Heritage Guide. Ask me anything about traditional Bodo handloom, sacred Agor motifs, natural forest dyes, or the master weavers of Assam.',
      timestamp: 'Just now',
    },
  ],
  toggleAIPanel: () => set((state) => ({ isAIPanelOpen: !state.isAIPanelOpen })),
  openAIPanelWithContext: (artifact, initialPrompt) => {
    set((state) => {
      const messages = [...state.aiMessages];
      if (artifact) {
        messages.push({
          id: `ctx-${Date.now()}`,
          sender: 'assistant',
          text: `You are now examining **${artifact.name}** (${artifact.bodoName || 'traditional heritage'}). Would you like to know about its craftsmanship, cultural meaning, or related weaving stages?`,
          timestamp: 'Just now',
          relatedArtifacts: artifact.relatedProcesses,
        });
      }
      return {
        isAIPanelOpen: true,
        currentAIContextArtifact: artifact,
        aiMessages: messages,
      };
    });

    if (initialPrompt) {
      get().sendAIMessage(initialPrompt);
    }
  },
  closeAIPanel: () => set({ isAIPanelOpen: false }),
  setAIExpertise: (level: ExpertiseLevel) => set({ aiExpertise: level }),
  sendAIMessage: async (text: string) => {
    const userMsg: AIChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    set((state) => ({
      aiMessages: [...state.aiMessages, userMsg],
      isAITyping: true,
    }));

    const { currentAIContextArtifact, aiExpertise } = get();
    const effectiveExpertise: ExpertiseLevel =
      aiExpertise === 'intermediate' ? 'intermediate' : 'basic';

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text,
          expertise: effectiveExpertise,
          expertiseLevel: effectiveExpertise,
          contextArtifactId: currentAIContextArtifact?.id,
        }),
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();

      const assistantMsg: AIChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || 'Response recorded.',
        timestamp: 'Just now',
        sources: Array.isArray(data.sources)
          ? data.sources.map((s: { title: string; section?: string }) => ({
              title: s.title,
              author: s.section || 'OKF Archive',
            }))
          : [],
        navigation: data.navigationAction || null,
        graphContextSummary: Array.isArray(data.graphContext?.entities)
          ? data.graphContext.entities.map((e: { name: string; type: string }) => `${e.name} (${e.type})`)
          : [],
        insufficientEvidence: Boolean(data.insufficientEvidence),
      };

      set((state) => ({
        aiMessages: [...state.aiMessages, assistantMsg],
        isAITyping: false,
      }));
    } catch {
      const fallbackMsg: AIChatMessage = {
        id: `asst-err-${Date.now()}`,
        sender: 'assistant',
        text: `Consulting archival documentation for: "${text}". Traditional Bodo textile craftsmanship includes 9 sequential stages from ginning (Khun Saynay) to weaving (Daonay).`,
        timestamp: 'Just now',
      };
      set((state) => ({
        aiMessages: [...state.aiMessages, fallbackMsg],
        isAITyping: false,
      }));
    }
  },

  // Agor state
  selectedMotifId: 'hajw-agor',
  setSelectedMotifId: (id) => set({ selectedMotifId: id }),
  getSelectedMotif: () => {
    const { selectedMotifId } = get();
    return MOTIFS_DATA.find((m) => m.id === selectedMotifId) || MOTIFS_DATA[0];
  },

  // Dyeing state
  selectedDyeingStepId: 'stage-1-preparation',
  setSelectedDyeingStepId: (id) => set({ selectedDyeingStepId: id }),
  getSelectedDyeingStep: () => {
    const { selectedDyeingStepId } = get();
    return DYEING_STEPS.find((s) => s.id === selectedDyeingStepId) || DYEING_STEPS[0];
  },

  // Process state
  selectedProcessId: 'ginning',
  setSelectedProcessId: (id) => set({ selectedProcessId: id }),
  getSelectedProcess: () => {
    const { selectedProcessId } = get();
    return PROCESS_STAGES.find((p) => p.id === selectedProcessId) || PROCESS_STAGES[0];
  },
}));
