import React from 'react';
import { popularCategoriesData } from '../../data/mockData';
// Icons đã được import và sử dụng trong popularCategoriesData từ mockData.js

const PopularCategories = () => {
  return (
    <section className="py-12 bg-blue-50 rounded-lg shadow-lg my-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Ngành Nghề Phổ Biến</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {popularCategoriesData.map(category => (
            <div key={category.name} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex items-center space-x-4 cursor-pointer hover:bg-blue-100">
              <div className="text-blue-600 p-3 bg-blue-100 rounded-full">
                {category.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                <p className="text-sm text-blue-600 hover:underline">Xem việc làm</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;