import api from './api';

export const jobService = {
  getAllJobs: async (params = {}) => {
    try {
      console.log('Fetching all jobs from API with params:', params);
      
      // Mặc định chỉ lấy các tin có trạng thái "Đang hiển thị"
      const defaultParams = { status: 'Đang hiển thị', ...params };
      const response = await api.get('/api/jobs', { params: defaultParams });
      
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
      const response = await api.get(`/api/jobs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch job details' };
    }
  },

  getJobsByLocation: async (locationVariations, params = {}) => {
    try {
      console.log('Fetching jobs by location variations:', locationVariations);
      
      // Skip API location endpoint, go directly to get all jobs and filter locally
      // This ensures we get all jobs from database and filter them properly
      console.log('Getting all jobs from database and filtering locally...');
      
      try {
        const allJobsResponse = await api.get('/api/jobs', { params });
        
        console.log('All jobs response:', allJobsResponse.data);
        
        if (allJobsResponse.data && allJobsResponse.data.success && Array.isArray(allJobsResponse.data.data)) {
          console.log(`Total jobs in database: ${allJobsResponse.data.data.length}`);
          
          // Log all job locations for debugging
          console.log('All job locations in database:');
          allJobsResponse.data.data.forEach((job, index) => {
            console.log(`  ${index + 1}. "${job.title}" - Location: "${job.location}"`);
          });
          
          // Filter jobs by location variations with better matching logic
          const filteredJobs = allJobsResponse.data.data.filter(job => {
            if (!job.location) {
              console.log(`Job "${job.title}" has no location`);
              return false;
            }
            
            const hasMatch = locationVariations.some(loc => {
              const jobLocation = job.location.toLowerCase().trim();
              const searchLocation = loc.toLowerCase().trim();
              
              // Multiple matching strategies
              const exactMatch = jobLocation === searchLocation;
              const containsMatch = jobLocation.includes(searchLocation) || searchLocation.includes(jobLocation);
              
              // Special handling for Ho Chi Minh variations
              const isHCMVariation = (
                (jobLocation.includes('hồ chí minh') || jobLocation.includes('ho chi minh') || 
                 jobLocation.includes('hcm') || jobLocation.includes('tphcm') || 
                 jobLocation.includes('saigon')) &&
                (searchLocation.includes('hồ chí minh') || searchLocation.includes('ho chi minh') || 
                 searchLocation.includes('hcm') || searchLocation.includes('tphcm') || 
                 searchLocation.includes('saigon'))
              );
              
              const match = exactMatch || containsMatch || isHCMVariation;
              
              if (match) {
                console.log(`✓ MATCH: "${job.location}" matches "${loc}" (exact: ${exactMatch}, contains: ${containsMatch}, hcm: ${isHCMVariation})`);
              } else {
                console.log(`✗ NO MATCH: "${job.location}" vs "${loc}"`);
              }
              return match;
            });
            
            return hasMatch;
          });
          
          console.log(`Filtered result: ${filteredJobs.length} jobs match location variations:`, locationVariations);
          filteredJobs.forEach(job => {
            console.log(`  - "${job.title}" at "${job.location}"`);
          });
          
          if (filteredJobs.length > 0) {
            console.log(`Found ${filteredJobs.length} jobs matching location variations`);
            return filteredJobs;
          } else {
            console.log('No jobs found matching location variations, returning empty array');
            return [];
          }
        }
      } catch (err) {
        console.error('Failed to fetch and filter all jobs:', err);
      }
      
      // If all else fails, return empty array
      console.log('Returning empty array as fallback');
      return [];
    } catch (error) {
      console.error('Error fetching jobs by location:', error);
      
      // Fallback trong môi trường development với mock data
      if (process.env.NODE_ENV === 'development') {
        console.log('API error - using mock data for location filtering');
        const mockJobs = require('../data/mockData').featuredJobsData;
        
        // Filter mock jobs by location if locationVariations provided
        if (Array.isArray(locationVariations)) {
          const filteredMockJobs = mockJobs.filter(job => {
            if (!job.location) return false;
            
            // Check if job location matches any of the location variations
            return locationVariations.some(loc => {
              const jobLocation = job.location.toLowerCase();
              const searchLocation = loc.toLowerCase();
              
              // Exact match or contains match
              return jobLocation === searchLocation || 
                     jobLocation.includes(searchLocation) ||
                     searchLocation.includes(jobLocation);
            });
          });
          
          console.log(`Filtered ${filteredMockJobs.length} jobs from ${mockJobs.length} total for location variations:`, locationVariations);
          return filteredMockJobs;
        } else if (typeof locationVariations === 'string') {
          const filteredMockJobs = mockJobs.filter(job => {
            if (!job.location) return false;
            const jobLocation = job.location.toLowerCase();
            const searchLocation = locationVariations.toLowerCase();
            return jobLocation.includes(searchLocation) || searchLocation.includes(jobLocation);
          });
          return filteredMockJobs;
        }
        
        return mockJobs;
      }
      
      throw error.response?.data || { message: 'Failed to fetch jobs by location' };
    }
  },

  getJobsByIndustry: async (industrySlug, params = {}) => {
    try {
      console.log('Fetching jobs by industry:', industrySlug);
      const response = await api.get(`/api/jobs/industry`, { 
        params: { industry: industrySlug, ...params } 
      });
      
      console.log('Industry jobs response:', response.data);
      
      // Xử lý dữ liệu trả về từ API với cấu trúc ApiResponse<List<JobPostingDTO>>
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching jobs by industry:', error);
      throw error.response?.data || { message: 'Failed to fetch jobs by industry' };
    }
  },

  getHotLatestJobs: async (params = {}) => {
    try {
      console.log('Fetching hot and latest jobs from API...');
      
      // Lấy hot jobs và latest jobs từ backend, gộp lại, loại trùng
      const [hotRes, latestRes] = await Promise.all([
        api.get('/api/jobs/hot-jobs', { params: { limit: 6 } }),
        api.get('/api/jobs/latest-jobs', { params: { limit: 6 } })
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
      const response = await api.post(`/api/jobs/${jobId}/apply`, applicationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to submit application' };
    }
  }
};

export default jobService;