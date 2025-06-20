import api from './api';

export const cvService = {
  analyzeCV: async (formData) => {
    try {
      // Need to use FormData for file upload
      const response = await api.post('/cv/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to analyze CV' };
    }
  },

  getTemplates: async () => {
    try {
      const response = await api.get('/cv/templates');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch CV templates' };
    }
  },

  submitConsultingRequest: async (consultingData) => {
    try {
      const response = await api.post('/cv/consulting-request', consultingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to submit consulting request' };
    }
  },

  getUserCVs: async () => {
    try {
      const response = await api.get('/cv/user');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user CVs' };
    }
  }
};

export default cvService;