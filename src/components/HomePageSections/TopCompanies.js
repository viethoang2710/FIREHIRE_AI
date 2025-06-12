import React from 'react';
import { topCompaniesData } from '../../data/mockData';

const TopCompanies = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Công Ty Hàng Đầu Tuyển Dụng</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 items-center">
          {topCompaniesData.map(company => (
            <div key={company.name} className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex justify-center items-center h-32">
              <img src={company.logo} alt={company.name} className="max-h-16 max-w-full object-contain" onError={(e) => e.target.src='https://placehold.co/150x80/cccccc/969696?text=Logo'} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCompanies;