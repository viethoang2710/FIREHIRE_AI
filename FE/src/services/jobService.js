import api from './api';

export const jobService = {
  getAllJobs: async (params = {}) => {
    try {
      const response = await api.get('/jobs', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch jobs' };
    }
  },

  getJobById: async (id) => {
    try {
      const response = await api.get(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch job details' };
    }
  },

  getJobsByLocation: async (locationSlug, params = {}) => {
    try {
      const response = await api.get(`/jobs/location/${locationSlug}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch jobs by location' };
    }
  },

  getJobsByIndustry: async (industrySlug, params = {}) => {
    try {
      const response = await api.get(`/jobs/industry/${industrySlug}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch jobs by industry' };
    }
  },

  getHotLatestJobs: async (params = {}) => {
    try {
      const response = await api.get('/jobs/hot-latest', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch hot/latest jobs' };
    }
  },

  applyForJob: async (jobId, applicationData) => {
    try {
      const response = await api.post(`/jobs/${jobId}/apply`, applicationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to submit application' };
    }
  }
};

export default jobService;