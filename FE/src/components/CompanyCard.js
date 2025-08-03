// src/components/CompanyCard.js
import React from 'react';

const CompanyCard = ({ company }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4 hover:shadow-lg transition-shadow duration-300">
      {/* Header với logo và thông tin công ty */}
      <div className="flex items-start space-x-4 mb-3">
        {/* Logo công ty */}
        <div className="flex-shrink-0">
          {company?.logo ? (
            <img 
              src={company.logo} 
              alt={`${company?.name || 'Company'} logo`}
              className="w-16 h-16 object-cover border border-gray-200 rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          {/* Fallback nếu không có logo */}
          <div 
            className={`w-16 h-16 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center ${company?.logo ? 'hidden' : 'flex'}`}
          >
            <span className="text-gray-400 text-sm font-medium">
              {(company?.name || 'C').charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
        
        {/* Thông tin công ty */}
        <div className="flex-grow">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">{company?.name || 'Tên Công ty'}</h2>
          <p className="text-gray-600 mb-1">{company?.location || company?.address || 'Địa điểm'}</p>
          {company?.industry && (
            <p className="text-sm text-blue-600 font-medium mb-1">{company.industry}</p>
          )}
          {company?.size && (
            <p className="text-sm text-gray-500">{company.size}</p>
          )}
        </div>
      </div>
      
      {/* Mô tả công ty */}
      {company?.description && (
        <p className="text-gray-700 text-sm mb-3 line-clamp-3">{company.description}</p>
      )}
      
      {/* Số lượng job đang tuyển */}
      {company?.jobsCount && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">{company.jobsCount} vị trí đang tuyển</span>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Xem việc làm →
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyCard;