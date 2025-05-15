import { create } from 'zustand';

type AnalysisStatus = 'idle' | 'analyzing' | 'completed' | 'error';

interface DocumentInfo {
  title: string;
  type: string;
  date: string;
  parties: string[];
  length: {
    pages: number;
    words: number;
  };
}

interface RiskSummary {
  overallRisk: 'high' | 'medium' | 'low' | 'none';
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  noRiskCount: number;
}

interface AppState {
  // Document state
  currentFile: File | null;
  documentInfo: DocumentInfo | null;
  analysisStatus: AnalysisStatus;
  analysisProgress: number;
  riskSummary: RiskSummary | null;
  
  // Actions
  setCurrentFile: (file: File | null) => void;
  setAnalysisStatus: (status: AnalysisStatus) => void;
  setAnalysisProgress: (progress: number) => void;
  resetAnalysis: () => void;
}

export const useStore = create<AppState>((set) => ({
  // Initial state
  currentFile: null,
  documentInfo: null,
  analysisStatus: 'idle',
  analysisProgress: 0,
  riskSummary: null,
  
  // Actions
  setCurrentFile: (file) => set({ currentFile: file }),
  
  setAnalysisStatus: (status) => set({ analysisStatus: status }),
  
  setAnalysisProgress: (progress) => set({ analysisProgress: progress }),
  
  resetAnalysis: () => set({
    analysisStatus: 'idle',
    analysisProgress: 0,
    documentInfo: null,
    riskSummary: null,
  }),
}));