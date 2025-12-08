// Shared TypeScript interfaces for the application

export interface WardrobeItemAnalysis {
  clothing_type?: string;
  itemType?: string;
  style: string;
  colors?: string[];
  occasions?: string[];
  season?: string;
  description?: string;
  formality?: string;
}

export interface WardrobeItem {
  id: string;
  imageUrl?: string;
  imageData?: string;
  analysis: WardrobeItemAnalysis;
  isFavorite?: boolean;
  favorite?: boolean;
  timestamp?: string;
}

export interface Notification {
  message: string;
  type: 'info' | 'success' | 'error';
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
  };
}
