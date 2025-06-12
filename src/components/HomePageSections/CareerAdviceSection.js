import React from 'react';
import { careerAdviceData } from '../../data/mockData';

const CareerAdviceSection = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Cẩm Nang Nghề Nghiệp</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {careerAdviceData.map(advice => (
            <div key={advice.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
              <img src={advice.image} alt={advice.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => e.target.src='https://placehold.co/300x200/cccccc/969696?text=Advice'}/>
              <div className="p-6">
                <span className="inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded-full mb-2">{advice.category}</span>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{advice.title}</h3>
                <a href="#" className="text-blue-500 hover:text-blue-700 font-medium text-sm">Đọc thêm &rarr;</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareerAdviceSection;