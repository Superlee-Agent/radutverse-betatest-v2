export interface License {
  licenseTermsId?: string;
  terms?: {
    derivativesAllowed?: boolean;
    derivativesAttribution?: boolean;
    commercialUse?: boolean;
    [key: string]: any;
  };
  derivativesAllowed?: boolean;
  derivativesAttribution?: boolean;
  commercialUse?: boolean;
  [key: string]: any;
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
  licenses?: License[];
  [key: string]: any;
}

export interface OwnerDomainInfo {
  domain: string | null;
  loading: boolean;
}

export interface RemixTypeInfo {
  type: "paid" | "free";
  hasAttribution: boolean;
}

export interface PopularItem {
  id: string;
  title: string;
  owner: string;
  preview: string;
}

export interface PreviewImage {
  blob: Blob;
  name: string;
  url: string;
}

export interface PreviewImagesState {
  remixImage: PreviewImage | null;
  additionalImage: PreviewImage | null;
}
