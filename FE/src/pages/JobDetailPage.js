// src/pages/JobDetailPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import ApplyJobModal from '../components/UI/ApplyJobModal';
import { MapPin, DollarSign, Building, Clock, Users, Award } from 'lucide-react';

const JobDetailPage = ({ showAlert }) => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/jobs/${jobId}`);
      
      if (response.ok) {
        const data = await response.json();
        setJob(data.data);
      } else {
        showAlert('Không thể tải thông tin công việc', 'error');
        navigate('/job-search');
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      showAlert('Có lỗi xảy ra khi tải thông tin công việc', 'error');
      navigate('/job-search');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = () => {
    if (!currentUser) {
      showAlert('Vui lòng đăng nhập để nộp CV ứng tuyển', 'warning');
      return;
    }

    if (currentUser.role !== 'CANDIDATE') {
      showAlert('Chỉ ứng viên mới có thể nộp CV ứng tuyển', 'warning');
      return;
    }

    setShowApplyModal(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy công việc</h1>
          <button 
            onClick={() => navigate('/job-search')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Quay lại trang tìm kiếm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              {/* Company Logo */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                  <Building size={24} className="text-gray-400" />
                </div>
              </div>
              
              {/* Job Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{job.title}</h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <Building size={16} className="mr-1" />
                  <span className="font-medium">{job.companyName}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {job.location && (
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1" />
                      <span>{job.location}</span>
                    </div>
                  )}
                  {job.salary && (
                    <div className="flex items-center">
                      <DollarSign size={14} className="mr-1" />
                      <span>{job.salary}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span>{job.jobType || 'Full-time'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Apply Button */}
            <button
              onClick={handleApplyClick}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Ứng tuyển ngay
            </button>
          </div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Mô tả công việc</h2>
              <div className="prose prose-blue max-w-none">
                <p className="text-gray-600 whitespace-pre-line">
                  {job.description || 'Không có mô tả chi tiết.'}
                </p>
              </div>
            </div>

            {/* Requirements */}
            {job.skillsRequired && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Yêu cầu</h2>
                <div className="text-gray-600">
                  <p className="whitespace-pre-line">{job.skillsRequired}</p>
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Quyền lợi</h2>
                <div className="text-gray-600">
                  <p className="whitespace-pre-line">{job.benefits}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-gray-800 mb-4">Thông tin công việc</h3>
              <div className="space-y-3">
                {job.industry && (
                  <div className="flex items-center">
                    <Award size={16} className="mr-2 text-gray-400" />
                    <span className="text-gray-600">{job.industry}</span>
                  </div>
                )}
                {job.experienceLevel && (
                  <div className="flex items-center">
                    <Users size={16} className="mr-2 text-gray-400" />
                    <span className="text-gray-600">Kinh nghiệm: {job.experienceLevel}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Clock size={16} className="mr-2 text-gray-400" />
                  <span className="text-gray-600">
                    Đăng: {new Date(job.createdDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-gray-800 mb-4">Về công ty</h3>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Building size={20} className="text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{job.companyName}</p>
                  <p className="text-sm text-gray-500">{job.industry}</p>
                </div>
              </div>
              {job.location && (
                <p className="text-sm text-gray-600 flex items-center">
                  <MapPin size={14} className="mr-1" />
                  {job.location}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Job Modal */}
      {showApplyModal && (
        <ApplyJobModal
          job={job}
          isOpen={showApplyModal}
          onClose={() => setShowApplyModal(false)}
          showAlert={showAlert}
        />
      )}
    </div>
  );
};

export default JobDetailPage;
