import api from './api';

export const cvService = {
  // Lấy tất cả CVs từ database
  getAllCVs: async () => {
    try {
      console.log('Calling API: GET /api/cv/all');
      const response = await api.get('/api/cv/all');
      console.log('API Response status:', response.status);
      console.log('API Response data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in getAllCVs:', error);
      console.error('Error response:', error.response);
      
      // Thử các endpoint khác có thể có
      try {
        console.log('Trying alternative endpoint: GET /api/cvs');
        const alternativeResponse = await api.get('/api/cvs');
        console.log('Alternative API Response:', alternativeResponse.data);
        return alternativeResponse.data;
      } catch (altError) {
        console.log('Alternative endpoint also failed, trying: GET /cvs');
        try {
          const thirdResponse = await api.get('/cvs');
          console.log('Third endpoint response:', thirdResponse.data);
          return thirdResponse.data;
        } catch (thirdError) {
          console.error('All endpoints failed');
          throw error.response?.data || { 
            message: error.message || 'Failed to fetch all CVs',
            status: error.response?.status || 500
          };
        }
      }
    }
  },

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
  },

  // === Methods for CV Database Operations ===

  // Lấy tất cả CVs từ database với multiple endpoints
  getAllCVsWithFallback: async () => {
    const endpoints = [
      '/api/cv/all',
      '/api/cvs/all',
      '/api/cvs',
      '/cvs',
      '/api/applications/cvs',
      '/applications/with-cvs'
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: GET ${endpoint}`);
        const response = await api.get(endpoint);
        console.log(`Success with ${endpoint}:`, response.data);
        
        // Chuẩn hóa response format
        if (response.data && Array.isArray(response.data)) {
          return { success: true, data: response.data };
        } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
          return response.data;
        } else if (response.data && response.data.cvs && Array.isArray(response.data.cvs)) {
          return { success: true, data: response.data.cvs };
        }
        
        return { success: true, data: response.data };
      } catch (error) {
        console.log(`Failed with ${endpoint}:`, error.response?.status || error.message);
        continue;
      }
    }
    
    throw new Error('All CV endpoints failed');
  },

  // Lấy CVs từ bảng applications (fallback)
  getCVsFromApplications: async () => {
    try {
      const response = await api.get('/api/applications/with-cv');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch CVs from applications' };
    }
  },

  // Lấy CV theo application ID từ bảng CVs
  getCVByApplicationId: async (applicationId) => {
    try {
      const response = await api.get(`/api/cvs/application/${applicationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch CV by application ID' };
    }
  },

  // Tải CV file từ bảng CVs  
  downloadCVFromDatabase: async (applicationId) => {
    try {
      const response = await api.get(`/api/cvs/download/${applicationId}`, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to download CV from database' };
    }
  },

  // Xem CV (preview) từ bảng CVs
  viewCVFromDatabase: async (applicationId) => {
    try {
      const response = await api.get(`/api/cvs/view/${applicationId}`, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to view CV from database' };
    }
  },

  // Lấy metadata của CV từ bảng CVs
  getCVMetadataFromDatabase: async (applicationId) => {
    try {
      const response = await api.get(`/api/cvs/metadata/${applicationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch CV metadata from database' };
    }
  }
};