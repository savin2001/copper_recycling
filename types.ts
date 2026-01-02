export interface LogEntry {
  id: string;
  supplier: string;
  date: string;
  rating: number; // 1-10
  verdict: string;
  fullReport: string;
  thumbnail?: string;
}

export interface AnalysisRequest {
  image: File;
  supplier: string;
  notes: string;
}

export interface AnalysisResult {
  markdown: string;
  rating: number;
  verdict: string;
}