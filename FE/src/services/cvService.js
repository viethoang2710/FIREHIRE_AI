import api from './api';

export const cvService = {
  createCV: async (cvData) => {
    try {
      const response = await api.post('/cv', cvData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create CV' };
    }
  },

  updateCV: async (cvId, cvData) => {
    try {
      const response = await api.put(`/cv/${cvId}`, cvData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update CV' };
    }
  },

  getCVById: async (cvId) => {
    try {
      const response = await api.get(`/cv/${cvId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch CV' };
    }
  },

  deleteCV: async (cvId) => {
    try {
      const response = await api.delete(`/cv/${cvId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete CV' };
    }
  },

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