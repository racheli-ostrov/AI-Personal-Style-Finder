import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const styleAPI = {
  // Analyze a single clothing image
  analyzeImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post('/style/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Generate style profile from wardrobe
  generateProfile: async (wardrobeItems) => {
    const response = await api.post('/style/profile', { wardrobeItems });
    return response.data;
  },

  // Get recommendations for similar items
  getRecommendations: async (itemAnalysis) => {
    const response = await api.post('/style/recommendations', { itemAnalysis });
    return response.data;
  },
};

export const wardrobeAPI = {
  // Get all wardrobe items
  getAll: async () => {
    const response = await api.get('/wardrobe/');
    return response.data;
  },

  // Add item to wardrobe
  addItem: async (analysis, imageData) => {
    const response = await api.post('/wardrobe/', { analysis, imageData });
    return response.data;
  },

  // Delete item from wardrobe
  deleteItem: async (id) => {
    const response = await api.delete(`/wardrobe/${id}`);
    return response.data;
  },

  // Toggle favorite
  toggleFavorite: async (id) => {
    const response = await api.patch(`/wardrobe/${id}/favorite`);
    return response.data;
  },

  // Clear wardrobe
  clearAll: async () => {
    const response = await api.delete('/wardrobe/');
    return response.data;
  },
};

export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
