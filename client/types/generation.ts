export type ToggleMode = "image" | "video";
export type ResultType = "image" | "video" | null;

export interface GenerationOptions {
  prompt: string;
  image?: {
    imageBytes: string;
    mimeType: string;
  };
  resolution?: string;
  aspectRatio?: string;
  remixType?: "paid" | "free" | null;
}

export interface Generation {
  id: string;
  type: ResultType;
  url: string;
  prompt?: string;
  timestamp?: number;
}

export interface CreationContextType {
  resultUrl: string | null;
  setResultUrl: (url: string | null) => void;
  resultType: ResultType;
  setResultType: (type: ResultType) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  loadingMessage: string;
  setLoadingMessage: (message: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
}
