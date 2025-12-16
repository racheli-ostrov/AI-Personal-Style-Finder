// Shopping recommendations service
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

export interface ShoppingRecommendation {
  store: string;
  emoji: string;
  url: string;
  query: string;
}

export interface ShoppingResponse {
  success: boolean;
  search_query: string;
  recommendations: ShoppingRecommendation[];
  error?: string;
}

export const getShoppingRecommendations = async (analysis: any): Promise<ShoppingResponse> => {
  const response = await axios.post(`${API_URL}/shopping/recommendations`, {
    analysis
  });
  return response.data;
};
