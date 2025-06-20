// src/components/JobCard.js
import React from 'react';

const JobCard = ({ job }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4 border border-gray-200 hover:shadow-md transition-shadow">
      <h2 className="text-xl font-semibold text-blue-700 mb-1">{job?.title || 'Tiêu đề công việc'}</h2>
      <p className="text-gray-600 mb-1">{job?.company || 'Tên công ty'}</p>
      <p className="text-gray-500 text-sm mb-2">{job?.location || 'Địa điểm'}</p>
      <p className="text-green-600 font-bold mb-3">{job?.salary || 'Mức lương'}</p>
      <p className="text-gray-800 text-sm line-clamp-3">{job?.description || 'Mô tả ngắn gọn về công việc...'}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {job?.tags?.map((tag, index) => (
          <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
      <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm transition-colors">
        Xem chi tiết
      </button>
    </div>
  );
};

export default JobCard;