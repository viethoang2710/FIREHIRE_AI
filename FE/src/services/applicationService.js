// src/services/applicationService.js
import api from './api';

const applicationService = {
  // Lấy tất cả applications (for admin) với thông tin CV
  getAllApplications: async () => {
    try {
      const response = await api.get('/api/applications/with-cv');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch all applications' };
    }
  },

  // Nộp CV ứng tuyển
  applyWithCV: async (jobId, candidateId, cvFile, coverLetter = '') => {
    try {
      const formData = new FormData();
      formData.append('jobId', jobId);
      formData.append('candidateId', candidateId);
      formData.append('cvFile', cvFile);
      if (coverLetter) {
        formData.append('coverLetter', coverLetter);
      }

      const response = await api.post('/api/applications/apply-with-cv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to submit application' };
    }
  },

  // Lấy danh sách CV đã nộp theo ứng viên
  getApplicationsByCandidate: async (candidateId) => {
    try {
      const response = await api.get(`/api/applications/candidate/${candidateId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch applications' };
    }
  },

  // Lấy danh sách CV đã nộp theo nhà tuyển dụng  
  getApplicationsByEmployer: async (employerId) => {
    try {
      const response = await api.get(`/api/applications/employer/${employerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch applications' };
    }
  },

  // Lấy danh sách CV đã nộp theo job
  getApplicationsByJob: async (jobId) => {
    try {
      const response = await api.get(`/api/applications/job/${jobId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch applications' };
    }
  },

  // Cập nhật trạng thái đơn ứng tuyển (cho nhà tuyển dụng/admin)
  updateApplicationStatus: async (applicationId, status) => {
    try {
      const response = await api.put(`/api/applications/${applicationId}/status`, null, {
        params: { status }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update application status' };
    }
  },

  // Shortlist ứng viên
  shortlistApplication: async (applicationId) => {
    try {
      const response = await api.post(`/api/applications/${applicationId}/shortlist`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to shortlist application' };
    }
  },

  // Từ chối ứng viên
  rejectApplication: async (applicationId) => {
    try {
      const response = await api.post(`/api/applications/${applicationId}/reject`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reject application' };
    }
  },

  // Lên lịch phỏng vấn
  scheduleInterview: async (applicationId) => {
    try {
      const response = await api.post(`/api/applications/${applicationId}/interview`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to schedule interview' };
    }
  },

  // Xóa đơn ứng tuyển
  deleteApplication: async (applicationId) => {
    try {
      const response = await api.delete(`/api/applications/${applicationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete application' };
    }
  },

  // Tải CV file từ bảng CVs
  downloadCV: async (applicationId) => {
    try {
      const response = await api.get(`/api/cvs/download/${applicationId}`, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to download CV' };
    }
  },

  // Lấy thông tin chi tiết application (bao gồm CV từ bảng CVs)
  getApplicationDetails: async (applicationId) => {
    try {
      const response = await api.get(`/api/applications/${applicationId}/with-cv`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch application details' };
    }
  },

  // Xem CV (preview) từ bảng CVs
  viewCV: async (applicationId) => {
    try {
      const response = await api.get(`/api/cvs/view/${applicationId}`, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to view CV' };
    }
  },

  // Lấy metadata của CV từ bảng CVs
  getCVMetadata: async (applicationId) => {
    try {
      const response = await api.get(`/api/cvs/metadata/${applicationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch CV metadata' };
    }
  }
};

export default applicationService;
