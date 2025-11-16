export interface PreviewImage {
  blob: Blob;
  name: string;
  url: string;
}

export interface PreviewImagesState {
  remixImage: PreviewImage | null;
  additionalImage: PreviewImage | null;
}

export interface SearchResult {
  ipId?: string;
  title?: string;
  name?: string;
  description?: string;
  mediaUrl?: string;
  mediaType?: string;
  thumbnailUrl?: string;
  ownerAddress?: string;
  isDerivative?: boolean;
  score?: number;
  [key: string]: any;
}

export interface PopularItem {
  id: string;
  title: string;
  owner: string;
  preview: string;
}
