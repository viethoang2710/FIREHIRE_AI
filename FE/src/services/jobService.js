import api from './api';

export const jobService = {
  getAllJobs: async (params = {}) => {
    try {
      // Mặc định chỉ lấy các tin có trạng thái "Đang hiển thị"
      const defaultParams = { status: 'Đang hiển thị', ...params };
      const response = await api.get('/jobs', { params: defaultParams });
      
      // Kiểm tra phản hồi
      if (!response.data || !Array.isArray(response.data.content)) {
        console.error('Unexpected API response structure:', response.data);
        
        // Xử lý trường hợp API không có sẵn trong môi trường phát triển
        if (process.env.NODE_ENV === 'development') {
          console.log('Using mock data in development mode');
          const mockJobs = require('../data/mockData').featuredJobsData;
          return { content: mockJobs, totalElements: mockJobs.length };
        }
        
        return { content: [], totalElements: 0 };
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      
      // Trong trường hợp API chưa hoạt động, trả về dữ liệu giả lập
      if (process.env.NODE_ENV === 'development') {
        console.log('API error - returning mock data for development');
        const mockJobs = require('../data/mockData').featuredJobsData;
        return { content: mockJobs, totalElements: mockJobs.length };
      }
      
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
      // Lấy hot jobs và latest jobs từ backend, gộp lại, loại trùng
      const hotRes = await api.get('/jobs/hot-jobs', { params: { limit: 6 } });
      const latestRes = await api.get('/jobs/latest-jobs', { params: { limit: 6 } });
      let hotJobs = (hotRes.data && Array.isArray(hotRes.data.data)) ? hotRes.data.data : [];
      let latestJobs = (latestRes.data && Array.isArray(latestRes.data.data)) ? latestRes.data.data : [];
      // Gộp và loại trùng theo id
      const allJobs = [...hotJobs, ...latestJobs].filter((job, idx, arr) => arr.findIndex(j => j.id === job.id) === idx);
      return { content: allJobs, totalElements: allJobs.length };
    } catch (error) {
      console.error('Error fetching hot/latest jobs:', error);
      // Trong trường hợp API chưa hoạt động, trả về dữ liệu giả lập
      if (process.env.NODE_ENV === 'development') {
        console.log('API error - returning mock data for hot-latest jobs');
        const mockJobs = require('../data/mockData').featuredJobsData.slice(0, 6);
        return { content: mockJobs, totalElements: mockJobs.length };
      }
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