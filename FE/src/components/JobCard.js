// src/components/JobCard.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import ApplyJobModal from './UI/ApplyJobModal';

const JobCard = ({ job, showAlert }) => {
  const { currentUser } = useContext(AuthContext);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const handleApplyClick = () => {
    if (!currentUser) {
      showAlert('Vui lòng đăng nhập để nộp CV ứng tuyển', 'warning');
      return;
    }

    // Kiểm tra role - chỉ CANDIDATE mới được nộp CV
    if (currentUser.role !== 'CANDIDATE') {
      showAlert('Chỉ ứng viên mới có thể nộp CV ứng tuyển', 'warning');
      return;
    }

    setShowApplyModal(true);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4 border border-gray-200 hover:shadow-md transition-shadow">
      {/* Header với logo và thông tin cơ bản */}
      <div className="flex items-start space-x-4 mb-3">
        {/* Logo công ty */}
        <div className="flex-shrink-0">
          {job?.companyLogo ? (
            <img 
              src={job.companyLogo} 
              alt={`${job?.companyName || job?.company || 'Company'} logo`}
              className="w-12 h-12 object-cover border border-gray-200 rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          {/* Fallback nếu không có logo */}
          <div 
            className={`w-12 h-12 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center ${job?.companyLogo ? 'hidden' : 'flex'}`}
          >
            <span className="text-gray-400 text-xs font-medium">
              {(job?.companyName || job?.company || 'C').charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
        
        {/* Thông tin chính */}
        <div className="flex-grow">
          <h2 className="text-xl font-semibold text-blue-700 mb-1">{job?.title || 'Tiêu đề công việc'}</h2>
          <p className="text-gray-600 mb-1 font-medium">{job?.companyName || job?.company || 'Tên công ty'}</p>
          <p className="text-gray-500 text-sm mb-2">{job?.location || 'Địa điểm'}</p>
          <p className="text-green-600 font-bold">{job?.salary || 'Mức lương'}</p>
        </div>
      </div>
      
      {/* Experience Level và Job Type */}
      <div className="flex gap-4 mb-3">
        {job?.experienceLevel && (
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {job.experienceLevel}
          </span>
        )}
        {job?.jobType && (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            {job.jobType}
          </span>
        )}
        {job?.industry && (
          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
            {job.industry}
          </span>
        )}
      </div>

      {/* Mô tả công việc */}
      <div className="mb-3">
        <h4 className="font-semibold text-gray-800 mb-1">Mô tả công việc:</h4>
        <p className="text-gray-800 text-sm whitespace-pre-line">
          {showFullDesc
            ? job?.description || 'Không có mô tả'
            : (job?.description?.slice(0, 150) || 'Không có mô tả') + (job?.description?.length > 150 ? '...' : '')}
        </p>
        {job?.description?.length > 150 && (
          <button
            onClick={() => setShowFullDesc(!showFullDesc)}
            className="text-blue-500 text-sm mt-1 hover:underline"
          >
            {showFullDesc ? 'Ẩn bớt' : 'Xem thêm'}
          </button>
        )}
      </div>

      {/* Yêu cầu ứng viên */}
      {job?.skillsRequired && (
        <div className="mb-3">
          <h4 className="font-semibold text-gray-800 mb-1">Yêu cầu ứng viên:</h4>
          <p className="text-gray-700 text-sm whitespace-pre-line">
            {job.skillsRequired.slice(0, 200)}
            {job.skillsRequired.length > 200 && '...'}
          </p>
        </div>
      )}

      {/* Quyền lợi */}
      {job?.benefits && (
        <div className="mb-3">
          <h4 className="font-semibold text-gray-800 mb-1">Quyền lợi:</h4>
          <p className="text-gray-700 text-sm whitespace-pre-line">
            {job.benefits.slice(0, 200)}
            {job.benefits.length > 200 && '...'}
          </p>
        </div>
      )}

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-2">
        {job?.tags?.map((tag, index) => (
          <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      {/* Nút nộp CV */}
      <button
        onClick={handleApplyClick}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm transition-colors"
      >
        Nộp CV
      </button>

      {/* Apply Job Modal */}
      <ApplyJobModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        job={job}
        showAlert={showAlert}
      />
    </div>
  );
};

export default JobCard;
