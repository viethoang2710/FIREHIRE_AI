import api from './api';

export const jobService = {
  getAllJobs: async (params = {}) => {
    try {
      console.log('Fetching all jobs from API with params:', params);
      
      // Mặc định chỉ lấy các tin có trạng thái "Đang hiển thị"
      const defaultParams = { status: 'Đang hiển thị', ...params };
      const response = await api.get('/jobs', { params: defaultParams });
      
      console.log('All jobs API response:', response.data);
      
      // Kiểm tra phản hồi từ API với cấu trúc ApiResponse<List<JobPostingDTO>>
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        return { content: response.data.data, totalElements: response.data.data.length };
      } else if (!response.data || !response.data.success) {
        console.error('API returned unsuccessful response:', response.data);
        
        // Fallback trong môi trường phát triển
        if (process.env.NODE_ENV === 'development') {
          console.log('Using mock data in development mode');
          const mockJobs = require('../data/mockData').featuredJobsData;
          return { content: mockJobs, totalElements: mockJobs.length };
        }
        
        return { content: [], totalElements: 0 };
      }
      
      return { content: [], totalElements: 0 };
      
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
      console.log('Fetching hot and latest jobs from API...');
      
      // Lấy hot jobs và latest jobs từ backend, gộp lại, loại trùng
      const [hotRes, latestRes] = await Promise.all([
        api.get('/jobs/hot-jobs', { params: { limit: 6 } }),
        api.get('/jobs/latest-jobs', { params: { limit: 6 } })
      ]);
      
      console.log('Hot jobs response:', hotRes.data);
      console.log('Latest jobs response:', latestRes.data);
      
      // Xử lý dữ liệu trả về từ API với cấu trúc ApiResponse<List<JobPostingDTO>>
      let hotJobs = [];
      let latestJobs = [];
      
      if (hotRes.data && hotRes.data.success && Array.isArray(hotRes.data.data)) {
        hotJobs = hotRes.data.data;
      }
      
      if (latestRes.data && latestRes.data.success && Array.isArray(latestRes.data.data)) {
        latestJobs = latestRes.data.data;
      }
      
      // Gộp và loại trùng theo id
      const allJobs = [...hotJobs, ...latestJobs].filter((job, idx, arr) => 
        arr.findIndex(j => j.id === job.id) === idx
      );
      
      console.log(`Found ${allJobs.length} unique jobs from API`);
      return { content: allJobs, totalElements: allJobs.length };
      
    } catch (error) {
      console.error('Error fetching hot/latest jobs:', error);
      
      // Fallback trong môi trường development
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