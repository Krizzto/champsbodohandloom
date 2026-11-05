import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Upload,
  FileText,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Copy,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Download,
  Eye,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { DyeingStep, DyeingProcessMetadata } from '../../types';
import { useContentStore } from '../../store/contentStore';
import { INITIAL_DYEING_STEPS } from '../../data/dyeing';

interface DyeingProcessManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DyeingProcessManagerModal: React.FC<DyeingProcessManagerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { siteContent, dyeingSteps, saveDyeingProcess, setCustomImage, removeCustomImage, customImages } =
    useContentStore();
  const dyeingSection = siteContent.dyeingSection;

  // Active view tab inside manager: 'edit' | 'upload' | 'preview'
  const [activeTab, setActiveTab] = useState<'edit' | 'upload' | 'preview'>('edit');

  // Working draft state
  const [draftHeading, setDraftHeading] = useState(dyeingSection.heading || 'Collection of');
  const [draftHighlightWord, setDraftHighlightWord] = useState(dyeingSection.highlightWord || 'dyeing');
  const [draftSubtitle, setDraftSubtitle] = useState(
    dyeingSection.subtitle || 'One of the most important creative and lucrative arts of the Bodos is colouring the thread.'
  );
  const [draftDescription, setDraftDescription] = useState(dyeingSection.description || '');

  // Working draft stages
  const [draftStages, setDraftStages] = useState<DyeingStep[]>(() => {
    return dyeingSteps.map((step, idx) => ({
      ...step,
      order: idx + 1,
      stage: `Stage ${idx + 1} of ${dyeingSteps.length}`,
      processFlow: step.processFlow ? [...step.processFlow] : [],
      ingredients: step.ingredients ? [...step.ingredients] : [],
      toolsUsed: step.toolsUsed ? [...step.toolsUsed] : [],
      materials: step.materials ? [...step.materials] : [],
    }));
  });

  // Working draft metadata
  const [draftMetadata, setDraftMetadata] = useState<DyeingProcessMetadata>({
    sourceDocumentName: dyeingSection.sourceDocumentName || 'Dyeing — Bodo Knowledge Repository.pdf',
    sourceDocumentId: dyeingSection.sourceDocumentId || 'BOD-DYE-2024-V1',
    uploadDate: dyeingSection.uploadDate || '2024-10-05',
    lastUpdated: dyeingSection.lastUpdated || new Date().toISOString().split('T')[0],
    contentEditor: dyeingSection.contentEditor || 'Bodo Cultural Heritage Guild',
    referenceInfo: dyeingSection.referenceInfo || 'Authoritative Bodo Knowledge Repository Document on Thread Colouring & Mordanting',
    version: dyeingSection.version || 1,
  });

  // Document upload state
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Success message after save
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Reset working state to current saved store
  const syncFromStore = () => {
    setDraftHeading(dyeingSection.heading || 'Collection of');
    setDraftHighlightWord(dyeingSection.highlightWord || 'dyeing');
    setDraftSubtitle(dyeingSection.subtitle || '');
    setDraftDescription(dyeingSection.description || '');
    setDraftStages(
      dyeingSteps.map((step, idx) => ({
        ...step,
        order: idx + 1,
        stage: `Stage ${idx + 1} of ${dyeingSteps.length}`,
        processFlow: step.processFlow ? [...step.processFlow] : [],
        ingredients: step.ingredients ? [...step.ingredients] : [],
        toolsUsed: step.toolsUsed ? [...step.toolsUsed] : [],
        materials: step.materials ? [...step.materials] : [],
      }))
    );
    setDraftMetadata({
      sourceDocumentName: dyeingSection.sourceDocumentName || 'Dyeing — Bodo Knowledge Repository.pdf',
      sourceDocumentId: dyeingSection.sourceDocumentId || 'BOD-DYE-2024-V1',
      uploadDate: dyeingSection.uploadDate || '2024-10-05',
      lastUpdated: dyeingSection.lastUpdated || new Date().toISOString().split('T')[0],
      contentEditor: dyeingSection.contentEditor || 'Bodo Cultural Heritage Guild',
      referenceInfo: dyeingSection.referenceInfo || '',
      version: dyeingSection.version || 1,
    });
  };

  // Stage Manipulation Functions
  const handleStageChange = (index: number, updates: Partial<DyeingStep>) => {
    setDraftStages((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  const handleAddStage = () => {
    const newIndex = draftStages.length + 1;
    const newStage: DyeingStep = {
      id: `stage-${Date.now()}`,
      order: newIndex,
      stage: `Stage ${newIndex} of ${newIndex}`,
      title: `Stage ${newIndex} Title`,
      subtitle: '',
      bodoTitle: '',
      description: 'Enter detailed process description from source documentation.',
      ingredients: [],
      toolsUsed: [],
      botanicalSource: 'Traditional natural materials',
      colorOutcome: 'Dyed thread outcome',
      colorHex: '#C5BAAF',
      traditionalWisdom: 'Traditional craft observation.',
      craftPrinciple: '',
      processFlow: ['Initial step action', 'Secondary step action'],
      materials: ['Material 1'],
      sourceType: 'editor-entered',
    };

    setDraftStages((prev) => {
      const next = [...prev, newStage].map((s, idx, arr) => ({
        ...s,
        order: idx + 1,
        stage: `Stage ${idx + 1} of ${arr.length}`,
      }));
      return next;
    });
  };

  const handleDeleteStage = (index: number) => {
    if (draftStages.length <= 1) {
      alert('The dyeing process must have at least one stage.');
      return;
    }
    if (window.confirm(`Delete "${draftStages[index].title}"?`)) {
      setDraftStages((prev) => {
        const next = prev.filter((_, idx) => idx !== index).map((s, idx, arr) => ({
          ...s,
          order: idx + 1,
          stage: `Stage ${idx + 1} of ${arr.length}`,
        }));
        return next;
      });
    }
  };

  const handleDuplicateStage = (index: number) => {
    const source = draftStages[index];
    const duplicate: DyeingStep = {
      ...source,
      id: `stage-${Date.now()}`,
      title: `${source.title} (Copy)`,
      processFlow: [...(source.processFlow || [])],
      ingredients: [...(source.ingredients || [])],
      toolsUsed: [...(source.toolsUsed || [])],
      materials: [...(source.materials || [])],
      sourceType: 'editor-entered',
    };

    setDraftStages((prev) => {
      const next = [...prev.slice(0, index + 1), duplicate, ...prev.slice(index + 1)].map((s, idx, arr) => ({
        ...s,
        order: idx + 1,
        stage: `Stage ${idx + 1} of ${arr.length}`,
      }));
      return next;
    });
  };

  const handleMoveStage = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === draftStages.length - 1)) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    setDraftStages((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next.map((s, idx, arr) => ({
        ...s,
        order: idx + 1,
        stage: `Stage ${idx + 1} of ${arr.length}`,
      }));
    });
  };

  // Array item helpers (sequence, ingredients, tools)
  const handleArrayItemChange = (
    stageIndex: number,
    field: 'processFlow' | 'ingredients' | 'toolsUsed' | 'materials',
    itemIndex: number,
    value: string
  ) => {
    setDraftStages((prev) => {
      const next = [...prev];
      const stage = { ...next[stageIndex] };
      const list = [...(stage[field] || [])];
      list[itemIndex] = value;
      stage[field] = list;
      next[stageIndex] = stage;
      return next;
    });
  };

  const handleAddArrayItem = (
    stageIndex: number,
    field: 'processFlow' | 'ingredients' | 'toolsUsed' | 'materials'
  ) => {
    setDraftStages((prev) => {
      const next = [...prev];
      const stage = { ...next[stageIndex] };
      stage[field] = [...(stage[field] || []), ''];
      next[stageIndex] = stage;
      return next;
    });
  };

  const handleRemoveArrayItem = (
    stageIndex: number,
    field: 'processFlow' | 'ingredients' | 'toolsUsed' | 'materials',
    itemIndex: number
  ) => {
    setDraftStages((prev) => {
      const next = [...prev];
      const stage = { ...next[stageIndex] };
      stage[field] = (stage[field] || []).filter((_, i) => i !== itemIndex);
      next[stageIndex] = stage;
      return next;
    });
  };

  // Image Upload Handler for individual stage
  const handleStageImageUpload = (stageId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setCustomImage(`dyeing-step-${stageId}`, dataUrl);
        setDraftStages((prev) =>
          prev.map((s) => (s.id === stageId ? { ...s, image: dataUrl, imageUrl: dataUrl } : s))
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const handleStageImageRemove = (stageId: string) => {
    removeCustomImage(`dyeing-step-${stageId}`);
    setDraftStages((prev) =>
      prev.map((s) => (s.id === stageId ? { ...s, image: undefined, imageUrl: undefined } : s))
    );
  };

  // Document Text / File Extraction Parser
  const parseDocumentContent = (text: string, filename: string) => {
    setIsExtracting(true);
    setUploadError(null);
    setUploadStatus(null);

    try {
      // 1. Try JSON format first
      if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
        try {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            // Array of stages
            const formatted = parsed.map((s, idx, arr) => ({
              id: s.id || `stage-${idx + 1}`,
              order: idx + 1,
              stage: `Stage ${idx + 1} of ${arr.length}`,
              title: s.title || `Stage ${idx + 1}`,
              subtitle: s.subtitle || s.bodoTitle || '',
              bodoTitle: s.bodoTitle || s.subtitle || '',
              description: s.description || '',
              ingredients: s.ingredients || s.materials || [],
              toolsUsed: s.toolsUsed || s.tools || [],
              botanicalSource: s.botanicalSource || 'Documented botanical sources',
              colorOutcome: s.colorOutcome || '',
              colorHex: s.colorHex || '#A64B2A',
              traditionalWisdom: s.traditionalWisdom || s.craftPrinciple || '',
              craftPrinciple: s.craftPrinciple || s.traditionalWisdom || '',
              processFlow: s.processFlow || s.sequence || [],
              materials: s.materials || s.ingredients || [],
              image: s.image || s.imageUrl,
              sourceType: 'source-document' as const,
            }));
            setDraftStages(formatted);
            setDraftMetadata((prev) => ({
              ...prev,
              sourceDocumentName: filename,
              uploadDate: new Date().toISOString().split('T')[0],
              version: (prev.version || 1) + 1,
            }));
            setUploadStatus(`Extracted ${formatted.length} stages from JSON structure!`);
            setActiveTab('edit');
            setIsExtracting(false);
            return;
          } else if (parsed.stages && Array.isArray(parsed.stages)) {
            // Full process document object
            if (parsed.title) setDraftHeading(parsed.title);
            if (parsed.subtitle) setDraftSubtitle(parsed.subtitle);
            if (parsed.description || parsed.introduction)
              setDraftDescription(parsed.description || parsed.introduction);

            const formatted = parsed.stages.map((s: any, idx: number, arr: any[]) => ({
              id: s.id || `stage-${idx + 1}`,
              order: idx + 1,
              stage: `Stage ${idx + 1} of ${arr.length}`,
              title: s.title || `Stage ${idx + 1}`,
              subtitle: s.subtitle || s.bodoTitle || '',
              bodoTitle: s.bodoTitle || s.subtitle || '',
              description: s.description || '',
              ingredients: s.ingredients || s.materials || [],
              toolsUsed: s.toolsUsed || s.tools || [],
              botanicalSource: s.botanicalSource || 'Documented natural sources',
              colorOutcome: s.colorOutcome || '',
              colorHex: s.colorHex || '#A64B2A',
              traditionalWisdom: s.traditionalWisdom || s.craftPrinciple || '',
              craftPrinciple: s.craftPrinciple || s.traditionalWisdom || '',
              processFlow: s.processFlow || s.sequence || [],
              materials: s.materials || s.ingredients || [],
              image: s.image || s.imageUrl,
              sourceType: 'source-document' as const,
            }));
            setDraftStages(formatted);
            setDraftMetadata((prev) => ({
              ...prev,
              sourceDocumentName: filename,
              uploadDate: new Date().toISOString().split('T')[0],
              version: (prev.version || 1) + 1,
            }));
            setUploadStatus(`Extracted process and ${formatted.length} stages from document!`);
            setActiveTab('edit');
            setIsExtracting(false);
            return;
          }
        } catch {
          // If JSON parse fails, fallback to natural language text parsing
        }
      }

      // 2. Natural Language / Document Text Parsing
      const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

      // Detect Title / Intro
      let extractedTitle = '';
      let extractedIntro = '';
      const stageChunks: { title: string; lines: string[] }[] = [];
      let currentChunk: { title: string; lines: string[] } | null = null;

      const stageRegex = /^(?:STAGE|Stage|STEP|Step)\s*([0-9]+)[:.\s—–-]*([^\n]*)/i;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(stageRegex);

        if (match) {
          if (currentChunk) {
            stageChunks.push(currentChunk);
          }
          currentChunk = {
            title: match[2].trim() || `Stage ${match[1]}`,
            lines: [],
          };
        } else if (currentChunk) {
          currentChunk.lines.push(line);
        } else {
          // Lines before first stage
          if (!extractedTitle && line.toLowerCase().includes('dyeing')) {
            extractedTitle = line.replace(/^[#*=\s]+|[#*=\s]+$/g, '');
          } else if (!extractedIntro && line.length > 20) {
            extractedIntro += (extractedIntro ? ' ' : '') + line;
          }
        }
      }

      if (currentChunk) {
        stageChunks.push(currentChunk);
      }

      if (stageChunks.length === 0) {
        // Fallback: look for numbered sections 1. 2. 3.
        const numberedRegex = /^([1-9])\.\s*(.+)/;
        let currentNumChunk: { title: string; lines: string[] } | null = null;

        for (const line of lines) {
          const numMatch = line.match(numberedRegex);
          if (numMatch) {
            if (currentNumChunk) stageChunks.push(currentNumChunk);
            currentNumChunk = { title: numMatch[2], lines: [] };
          } else if (currentNumChunk) {
            currentNumChunk.lines.push(line);
          }
        }
        if (currentNumChunk) stageChunks.push(currentNumChunk);
      }

      if (stageChunks.length > 0) {
        if (extractedTitle) setDraftHeading(extractedTitle);
        if (extractedIntro) setDraftDescription(extractedIntro);

        const newStages: DyeingStep[] = stageChunks.map((chunk, idx, arr) => {
          const bodyLines = chunk.lines;
          const sequence: string[] = [];
          const materials: string[] = [];
          const tools: string[] = [];
          let desc = '';
          let wisdom = '';

          for (const l of bodyLines) {
            const lower = l.toLowerCase();
            if (lower.startsWith('materials:') || lower.startsWith('material:')) {
              materials.push(...l.replace(/^[^:]+:\s*/, '').split(/[,;•]/).map((s) => s.trim()).filter(Boolean));
            } else if (lower.startsWith('tools:') || lower.startsWith('vessels:')) {
              tools.push(...l.replace(/^[^:]+:\s*/, '').split(/[,;•]/).map((s) => s.trim()).filter(Boolean));
            } else if (lower.startsWith('wisdom:') || lower.startsWith('principle:') || lower.startsWith('note:')) {
              wisdom = l.replace(/^[^:]+:\s*/, '');
            } else if (/^[0-9]+[.)]\s+|^[•\-\*]\s+/.test(l)) {
              sequence.push(l.replace(/^[0-9]+[.)]\s+|^[•\-\*]\s+/, ''));
            } else {
              desc += (desc ? ' ' : '') + l;
            }
          }

          return {
            id: `stage-${idx + 1}-${Date.now()}`,
            order: idx + 1,
            stage: `Stage ${idx + 1} of ${arr.length}`,
            title: chunk.title || `Stage ${idx + 1}`,
            subtitle: '',
            bodoTitle: '',
            description: desc || 'Documented stage process.',
            ingredients: materials.length > 0 ? materials : ['Yarn', 'Natural materials'],
            toolsUsed: tools.length > 0 ? tools : ['Vessel', 'Stirring rod'],
            botanicalSource: 'Documented botanical extraction',
            colorOutcome: 'Natural dye outcome',
            colorHex: '#A64B2A',
            traditionalWisdom: wisdom || 'Follow traditional temperature and turning cycles.',
            craftPrinciple: wisdom,
            processFlow: sequence.length > 0 ? sequence : ['Immersion', 'Curing'],
            materials: materials,
            sourceType: 'source-document' as const,
          };
        });

        setDraftStages(newStages);
        setDraftMetadata((prev) => ({
          ...prev,
          sourceDocumentName: filename,
          uploadDate: new Date().toISOString().split('T')[0],
          version: (prev.version || 1) + 1,
        }));
        setUploadStatus(`Successfully extracted ${newStages.length} stages from "${filename}". Review and edit your draft below.`);
        setActiveTab('edit');
      } else {
        setUploadError(
          'Could not automatically detect stage headings. Please format the text with "Stage 1:", "Stage 2:", etc., or manually paste into the editor fields below.'
        );
      }
    } catch (err: any) {
      setUploadError(`Failed to parse document: ${err.message || 'Unknown format'}`);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const isText = file.name.endsWith('.txt') || file.name.endsWith('.json') || file.type.includes('text');

    if (isText) {
      reader.onload = (event) => {
        const text = event.target?.result as string;
        parseDocumentContent(text, file.name);
      };
      reader.readAsText(file);
    } else {
      // For PDF / Word / binary files: read as arrayBuffer or text attempt
      reader.onload = (event) => {
        try {
          const buffer = event.target?.result as ArrayBuffer;
          // Extract readable ASCII strings from binary PDF/Word buffer
          const bytes = new Uint8Array(buffer);
          let extracted = '';
          let currentWord = '';
          for (let i = 0; i < bytes.length; i++) {
            const b = bytes[i];
            if ((b >= 32 && b <= 126) || b === 10 || b === 13) {
              currentWord += String.fromCharCode(b);
            } else {
              if (currentWord.length > 3) {
                extracted += currentWord + ' ';
              }
              currentWord = '';
            }
          }
          if (extracted.length > 50) {
            parseDocumentContent(extracted, file.name);
          } else {
            setUploadError(
              `The document "${file.name}" binary format could not be directly parsed in-browser. Please copy and paste its text content into the box below.`
            );
          }
        } catch {
          setUploadError(`Could not read binary file. Please copy the text into the text area.`);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Save & Publish Handler
  const handleSaveAndPublish = () => {
    saveDyeingProcess({
      heading: draftHeading,
      highlightWord: draftHighlightWord,
      subtitle: draftSubtitle,
      description: draftDescription,
      steps: draftStages,
      metadata: draftMetadata,
    });

    setSaveSuccessMessage('Dyeing process successfully saved & published to the live interactive view!');
    setTimeout(() => {
      setSaveSuccessMessage(null);
      onClose();
    }, 1500);
  };

  // Reset to the 5 documented stages from Bodo Knowledge Repository
  const handleResetToDocumentedDefaults = () => {
    if (window.confirm('Reset the dyeing process to the 5 documented stages from "Dyeing — Bodo Knowledge Repository.pdf"?')) {
      setDraftStages(
        INITIAL_DYEING_STEPS.map((s, idx) => ({
          ...s,
          order: idx + 1,
          stage: `Stage ${idx + 1} of ${INITIAL_DYEING_STEPS.length}`,
        }))
      );
      setDraftHeading('Collection of');
      setDraftHighlightWord('dyeing');
      setDraftSubtitle('One of the most important creative and lucrative arts of the Bodos is colouring the thread.');
      setDraftDescription(
        'Bodo handloom traditionally uses colourful yarn, and yarn may be dyed using natural or synthetic colours. Documented materials include yarn, alum (fitkaari) as a mordant, and colours obtained from natural materials such as barks, leaves, and roots to produce vivid shades including red, yellow, reddish yellow, green, black, and blue.'
      );
      setDraftMetadata({
        sourceDocumentName: 'Dyeing — Bodo Knowledge Repository.pdf',
        sourceDocumentId: 'BOD-DYE-2024-V1',
        uploadDate: '2024-10-05',
        lastUpdated: new Date().toISOString().split('T')[0],
        contentEditor: 'Bodo Cultural Heritage Guild',
        referenceInfo: 'Authoritative Bodo Knowledge Repository Document on Thread Colouring & Mordanting',
        version: 1,
      });
      setSaveSuccessMessage('Reset to documented repository defaults. Click Save & Publish to apply.');
    }
  };

  // Export JSON backup
  const handleExportJSON = () => {
    const data = {
      title: draftHeading,
      highlightWord: draftHighlightWord,
      subtitle: draftSubtitle,
      description: draftDescription,
      metadata: draftMetadata,
      stages: draftStages,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bodo-dyeing-process-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-5xl max-h-[92vh] bg-[#FAF8F5] text-[#171513] rounded-2xl shadow-2xl border border-stone-300 flex flex-col overflow-hidden"
      >
        {/* Header Bar */}
        <div className="px-6 py-4 bg-[#171513] text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <Sliders className="w-5 h-5 text-[#FFE600]" />
            <div>
              <h2 className="text-lg sm:text-xl font-editorial font-bold text-white flex items-center gap-2">
                <span>Manage Dyeing Process</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFE600]/20 text-[#FFE600] border border-[#FFE600]/40 font-mono font-normal">
                  Data-Driven Module
                </span>
              </h2>
              <p className="text-xs text-stone-300 font-sans">
                Upload documented dyeing methodology or customize stages, sequence, materials, and imagery.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2.5 bg-white border-b border-stone-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'edit'
                  ? 'bg-[#171513] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Process Editor ({draftStages.length} Stages)</span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'upload'
                  ? 'bg-[#171513] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document (PDF / DOCX / TXT / JSON)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-100 flex items-center gap-1 cursor-pointer"
              title="Export JSON backup"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>

            <button
              onClick={handleResetToDocumentedDefaults}
              className="px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-medium text-amber-800 hover:bg-amber-50 flex items-center gap-1 cursor-pointer"
              title="Reset to 5 documented stages from repository"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Reset to Defaults</span>
            </button>
          </div>
        </div>

        {/* Notification Banner */}
        <AnimatePresence>
          {saveSuccessMessage && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-emerald-600 text-white text-xs px-6 py-2.5 flex items-center gap-2 font-medium"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{saveSuccessMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'upload' ? (
            /* UPLOAD SOURCE DOCUMENT TAB */
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-white p-6 rounded-xl border border-stone-300 shadow-sm space-y-4">
                <div className="border-b border-stone-200 pb-3">
                  <h3 className="text-base font-bold font-editorial text-[#171513]">
                    Upload Dyeing Source Document
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    Upload an authoritative Bodo dyeing document (PDF, DOCX, TXT, or JSON). The system will extract the documented stages into an editable draft for review before saving.
                  </p>
                </div>

                {/* Upload Drag & Drop Area */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 hover:border-[#8B2635] bg-[#FAF8F5] rounded-xl p-8 text-center cursor-pointer transition-colors space-y-2 group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt,.json,text/plain,application/json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-stone-200 flex items-center justify-center mx-auto text-stone-600 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-[#8B2635]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-800">
                      Click to choose document or drag and drop here
                    </span>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Supported formats: PDF, DOCX, TXT, JSON
                    </p>
                  </div>
                  <span className="inline-block px-3 py-1 bg-white border border-stone-200 rounded-full text-[10px] font-mono text-stone-600 font-semibold">
                    Source Document → Create Draft → Review → Save
                  </span>
                </div>

                {uploadStatus && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{uploadStatus}</span>
                  </div>
                )}

                {uploadError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-800">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}
              </div>

              {/* Paste Text Alternative */}
              <div className="bg-white p-6 rounded-xl border border-stone-300 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-[#171513]">
                  Or Paste Document Text Directly
                </h3>
                <p className="text-xs text-stone-500">
                  If your PDF or document text is open in another viewer, copy and paste the stages here:
                </p>
                <textarea
                  rows={8}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste document text here, e.g.:&#10;&#10;Stage 1: Preparation of Yarn for Dyeing&#10;Alum (Fitkaari) is dissolved in a pot of boiling water...&#10;&#10;Stage 2: Extraction of Dyes&#10;Natural colouring materials are gathered...&#10;&#10;Stage 3: Straining the Dyed Potion&#10;The extracted dye liquid is prepared before yarn is introduced..."
                  className="w-full p-3 text-xs font-mono rounded-lg border border-stone-300 focus:outline-none focus:border-[#171513] bg-[#FAF8F5]"
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (pastedText.trim()) {
                        parseDocumentContent(pastedText, 'Pasted-Document-Text.txt');
                      }
                    }}
                    disabled={!pastedText.trim() || isExtracting}
                    className="px-4 py-2 rounded-lg bg-[#171513] hover:bg-stone-800 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FFE600]" />
                    <span>Extract Stages into Draft</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* PROCESS EDITOR TAB */
            <div className="space-y-6">
              {/* Section 1: Overview & Provenance Information */}
              <div className="bg-white p-5 rounded-xl border border-stone-300 shadow-xs space-y-4">
                <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold font-editorial text-[#171513]">
                      Dyeing Process Overview & Provenance
                    </h3>
                    <p className="text-xs text-stone-500">
                      Define the module title, introduction, and document provenance metadata.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full border border-amber-300">
                      Total Stages: {draftStages.length}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Section Title Prefix
                    </label>
                    <input
                      type="text"
                      value={draftHeading}
                      onChange={(e) => setDraftHeading(e.target.value)}
                      placeholder="Collection of"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#171513]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Highlight Word
                    </label>
                    <input
                      type="text"
                      value={draftHighlightWord}
                      onChange={(e) => setDraftHighlightWord(e.target.value)}
                      placeholder="dyeing"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#171513]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Subtitle / Quote Intro
                  </label>
                  <input
                    type="text"
                    value={draftSubtitle}
                    onChange={(e) => setDraftSubtitle(e.target.value)}
                    placeholder="One of the most important creative and lucrative arts of the Bodos is colouring the thread."
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#171513]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Process Introduction Description
                  </label>
                  <textarea
                    rows={2}
                    value={draftDescription}
                    onChange={(e) => setDraftDescription(e.target.value)}
                    placeholder="Bodo handloom traditionally uses colourful yarn, and yarn may be dyed using natural or synthetic colours..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#171513]"
                  />
                </div>

                {/* Provenance Metadata Fields */}
                <div className="pt-3 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#FAF8F5] p-3 rounded-lg border border-stone-200/80">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                      Source Document
                    </label>
                    <input
                      type="text"
                      value={draftMetadata.sourceDocumentName || ''}
                      onChange={(e) =>
                        setDraftMetadata((prev) => ({ ...prev, sourceDocumentName: e.target.value }))
                      }
                      placeholder="Dyeing — Bodo Knowledge Repository.pdf"
                      className="w-full px-2.5 py-1 text-xs rounded border border-stone-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                      Document Accession ID
                    </label>
                    <input
                      type="text"
                      value={draftMetadata.sourceDocumentId || ''}
                      onChange={(e) =>
                        setDraftMetadata((prev) => ({ ...prev, sourceDocumentId: e.target.value }))
                      }
                      placeholder="BOD-DYE-2024-V1"
                      className="w-full px-2.5 py-1 text-xs rounded border border-stone-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                      Content Editor / Guild
                    </label>
                    <input
                      type="text"
                      value={draftMetadata.contentEditor || ''}
                      onChange={(e) =>
                        setDraftMetadata((prev) => ({ ...prev, contentEditor: e.target.value }))
                      }
                      placeholder="Bodo Cultural Heritage Guild"
                      className="w-full px-2.5 py-1 text-xs rounded border border-stone-300 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Stages List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold font-editorial text-[#171513]">
                    Documented Process Stages ({draftStages.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddStage}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#171513] text-white hover:bg-stone-800 text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#FFE600]" />
                    <span>Add New Stage</span>
                  </button>
                </div>

                {draftStages.map((stage, idx) => {
                  const stageCustomImage = customImages[`dyeing-step-${stage.id}`] || stage.image;
                  const total = draftStages.length;

                  return (
                    <div
                      key={stage.id}
                      className="bg-white p-5 sm:p-6 rounded-xl border border-stone-300 shadow-xs space-y-4 relative group/card"
                    >
                      {/* Stage Card Header & Management Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-[#171513] text-[#FFE600] text-xs font-mono font-bold">
                            Stage {idx + 1} of {total}
                          </span>
                          <span className="text-xs text-stone-500">
                            {stage.sourceType === 'source-document'
                              ? '• Source Document'
                              : '• Editor-Entered'}
                          </span>
                        </div>

                        {/* Order & Card Actions */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleMoveStage(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 rounded border border-stone-200 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-stone-600"
                            title="Move stage up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleMoveStage(idx, 'down')}
                            disabled={idx === total - 1}
                            className="p-1.5 rounded border border-stone-200 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-stone-600"
                            title="Move stage down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDuplicateStage(idx)}
                            className="p-1.5 rounded border border-stone-200 hover:bg-stone-100 cursor-pointer text-stone-600"
                            title="Duplicate stage"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteStage(idx)}
                            disabled={total <= 1}
                            className="p-1.5 rounded border border-red-200 hover:bg-red-50 text-red-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ml-1"
                            title="Delete stage"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Stage Form Content */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                        {/* Left Inputs Column */}
                        <div className="md:col-span-8 space-y-3.5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-stone-700 mb-1">
                                Stage Title
                              </label>
                              <input
                                type="text"
                                value={stage.title}
                                onChange={(e) => handleStageChange(idx, { title: e.target.value })}
                                placeholder="e.g. Preparation of Yarn for Dyeing"
                                className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#171513]"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-stone-700 mb-1">
                                Bodo Script / Subtitle
                              </label>
                              <input
                                type="text"
                                value={stage.bodoTitle || stage.subtitle || ''}
                                onChange={(e) =>
                                  handleStageChange(idx, { bodoTitle: e.target.value, subtitle: e.target.value })
                                }
                                placeholder="e.g. खुन साजायनाय (Mordanting with Alum)"
                                className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#171513]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Stage Description
                            </label>
                            <textarea
                              rows={3}
                              value={stage.description}
                              onChange={(e) => handleStageChange(idx, { description: e.target.value })}
                              placeholder="Detail the documented steps and craft logic..."
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#171513]"
                            />
                          </div>

                          {/* Stage Sequence / Key Actions */}
                          <div className="p-3 bg-[#FAF8F5] rounded-lg border border-stone-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                                Stage Sequence / Key Actions
                              </span>
                              <button
                                type="button"
                                onClick={() => handleAddArrayItem(idx, 'processFlow')}
                                className="text-[11px] font-semibold text-[#8B2635] hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Action</span>
                              </button>
                            </div>

                            <div className="space-y-1.5">
                              {(stage.processFlow || []).map((action, actionIdx) => (
                                <div key={actionIdx} className="flex items-center gap-2">
                                  <span className="w-4 h-4 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-[9px] shrink-0">
                                    {actionIdx + 1}
                                  </span>
                                  <input
                                    type="text"
                                    value={action}
                                    onChange={(e) =>
                                      handleArrayItemChange(idx, 'processFlow', actionIdx, e.target.value)
                                    }
                                    placeholder="Action description..."
                                    className="flex-1 px-2.5 py-1 text-xs rounded border border-stone-300 bg-white focus:outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveArrayItem(idx, 'processFlow', actionIdx)}
                                    className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                                    title="Remove action"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Materials & Tools */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            {/* Materials */}
                            <div className="p-3 bg-[#FAF8F5] rounded-lg border border-stone-200 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                                  Materials & Ingredients
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleAddArrayItem(idx, 'ingredients')}
                                  className="text-[11px] font-semibold text-[#8B2635] hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Add</span>
                                </button>
                              </div>
                              <div className="space-y-1">
                                {(stage.ingredients || []).map((mat, matIdx) => (
                                  <div key={matIdx} className="flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      value={mat}
                                      onChange={(e) =>
                                        handleArrayItemChange(idx, 'ingredients', matIdx, e.target.value)
                                      }
                                      className="flex-1 px-2 py-0.5 text-xs rounded border border-stone-300 bg-white"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveArrayItem(idx, 'ingredients', matIdx)}
                                      className="text-stone-400 hover:text-red-600 p-0.5 cursor-pointer"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Tools */}
                            <div className="p-3 bg-[#FAF8F5] rounded-lg border border-stone-200 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                                  Tools & Vessels
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleAddArrayItem(idx, 'toolsUsed')}
                                  className="text-[11px] font-semibold text-[#8B2635] hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Add</span>
                                </button>
                              </div>
                              <div className="space-y-1">
                                {(stage.toolsUsed || []).map((tool, toolIdx) => (
                                  <div key={toolIdx} className="flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      value={tool}
                                      onChange={(e) =>
                                        handleArrayItemChange(idx, 'toolsUsed', toolIdx, e.target.value)
                                      }
                                      className="flex-1 px-2 py-0.5 text-xs rounded border border-stone-300 bg-white"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveArrayItem(idx, 'toolsUsed', toolIdx)}
                                      className="text-stone-400 hover:text-red-600 p-0.5 cursor-pointer"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Craft Principle / Important Note */}
                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Craft Principle / Important Note
                            </label>
                            <input
                              type="text"
                              value={stage.traditionalWisdom || stage.craftPrinciple || ''}
                              onChange={(e) =>
                                handleStageChange(idx, {
                                  traditionalWisdom: e.target.value,
                                  craftPrinciple: e.target.value,
                                })
                              }
                              placeholder="e.g. Alum acts as a mordant and helps the yarn fibres bond more effectively..."
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#171513]"
                            />
                          </div>
                        </div>

                        {/* Right Image Management Column */}
                        <div className="md:col-span-4 flex flex-col items-center justify-between p-4 bg-[#FAF8F5] rounded-xl border border-stone-200">
                          <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-2">
                            Stage Image
                          </span>

                          <div className="w-full aspect-4/3 rounded-lg overflow-hidden bg-white border border-stone-300 relative group/img flex items-center justify-center">
                            {stageCustomImage ? (
                              <img
                                src={stageCustomImage}
                                alt={stage.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-center p-3 text-stone-400">
                                <ImageIcon className="w-8 h-8 mx-auto mb-1 text-stone-300" />
                                <span className="text-[10px] block">No image uploaded</span>
                                <span className="text-[9px] text-stone-400">Uses craft illustration</span>
                              </div>
                            )}
                          </div>

                          <div className="w-full mt-3 space-y-2">
                            <label className="block w-full text-center px-3 py-1.5 rounded-lg bg-white border border-stone-300 hover:bg-stone-50 text-xs font-semibold text-stone-800 cursor-pointer shadow-2xs">
                              <span>{stageCustomImage ? 'Replace Image' : 'Upload Image'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handleStageImageUpload(stage.id, f);
                                }}
                                className="hidden"
                              />
                            </label>

                            {stageCustomImage && (
                              <button
                                type="button"
                                onClick={() => handleStageImageRemove(stage.id)}
                                className="w-full px-3 py-1 rounded text-[11px] text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                Remove Image
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Bottom Add Stage Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleAddStage}
                    className="w-full py-3 rounded-xl border-2 border-dashed border-stone-300 hover:border-[#171513] text-stone-600 hover:text-stone-900 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer bg-white"
                  >
                    <Plus className="w-4 h-4 text-[#8B2635]" />
                    <span>Add New Stage to Process</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="px-6 py-3.5 bg-white border-t border-stone-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-stone-500">
            <span>{draftStages.length} stages configured</span>
            <span className="mx-2">•</span>
            <span>Version {draftMetadata.version || 1}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveAndPublish}
              className="px-5 py-2 rounded-lg bg-[#171513] hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#FFE600]" />
              <span>Save & Publish Process</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
