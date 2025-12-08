import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to get current user ID from localStorage
const getUserId = () => {
  const user = localStorage.getItem('user');
  if (!user) return null;
  try {
    return JSON.parse(user).id;
  } catch {
    return null;
  }
};

// Helper to ensure user is authenticated
const requireAuth = () => {
  const userId = getUserId();
  if (!userId) {
    throw new Error('AUTH_REQUIRED');
  }
  return userId;
};

export const styleAPI = {
  // Analyze a single clothing image
  analyzeImage: async (imageFile) => {
    const userId = requireAuth();
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('userId', userId);
    
    const response = await api.post('/style/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Generate style profile from wardrobe
  generateProfile: async (wardrobeItems) => {
    const userId = requireAuth();
    const response = await api.post('/style/profile', { wardrobeItems, userId });
    return response.data;
  },

  // Get recommendations for similar items
  getRecommendations: async (itemAnalysis) => {
    const userId = requireAuth();
    const response = await api.post('/style/recommendations', { itemAnalysis, userId });
    return response.data;
  },
};

export const wardrobeAPI = {
  // Get all wardrobe items
  getAll: async () => {
    const userId = requireAuth();
    const response = await api.get('/wardrobe/', {
      params: { userId }
    });
    return response.data;
  },

  // Add item to wardrobe
  addItem: async (analysis, imageData) => {
    const userId = requireAuth();
    const response = await api.post('/wardrobe/', { analysis, imageData, userId });
    return response.data;
  },

  // Delete item from wardrobe
  deleteItem: async (id) => {
    const userId = requireAuth();
    const response = await api.delete(`/wardrobe/${id}`, {
      params: { userId }
    });
    return response.data;
  },

  // Toggle favorite
  toggleFavorite: async (id) => {
    const userId = requireAuth();
    const response = await api.patch(`/wardrobe/${id}/favorite`, {}, {
      params: { userId }
    });
    return response.data;
  },

  // Clear wardrobe
  clearAll: async () => {
    const userId = requireAuth();
    const response = await api.delete('/wardrobe/', {
      params: { userId }
    });
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
