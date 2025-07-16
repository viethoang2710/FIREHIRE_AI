// src/components/JobCard.js
import React, { useState, useRef } from 'react';

const JobCard = ({ job }) => {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const fileInputRef = useRef(null);

  const handleApplyClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log(`Nộp CV cho job ${job?.title}:`, file.name);
      // TODO: Gửi file lên server tại đây
      e.target.value = ''; // reset input để chọn lại sau
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4 border border-gray-200 hover:shadow-md transition-shadow">
      <h2 className="text-xl font-semibold text-blue-700 mb-1">{job?.title || 'Tiêu đề công việc'}</h2>
      <p className="text-gray-600 mb-1">{job?.company || 'Tên công ty'}</p>
      <p className="text-gray-500 text-sm mb-2">{job?.location || 'Địa điểm'}</p>
      <p className="text-green-600 font-bold mb-3">{job?.salary || 'Mức lương'}</p>

      {/* Mô tả công việc */}
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

      {/* Input ẩn chọn file */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default JobCard;
