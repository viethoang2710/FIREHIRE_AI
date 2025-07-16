import React, { useRef } from 'react';
import { MapPin } from 'lucide-react';
import { featuredJobsData } from '../../data/mockData';

const FeaturedJobs = () => {
  const fileInputRef = useRef(null);

  // Gọi khi click "Nộp CV"
  const handleApplyClick = (jobId) => {
    // Lưu lại jobId nếu cần (ở đây bạn có thể xử lý logic liên kết job sau này)
    console.log("Ứng tuyển vào job ID:", jobId);

    // Mở input file
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // TODO: Gửi file lên server hoặc xử lý tùy yêu cầu
      console.log("File đã chọn:", file.name);
      // Reset input để lần sau chọn lại cùng file vẫn gọi được
      event.target.value = '';
    }
  };

  return (
    <section className="py-12 bg-white rounded-lg shadow-lg my-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Việc Làm Nổi Bật & Mới Nhất</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {featuredJobsData.map(job => (
            <div key={job.id} className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex space-x-4">
              <img src={job.logo} alt={`${job.company} logo`} className="w-16 h-16 rounded-md object-contain flex-shrink-0 mt-1" onError={(e) => e.target.src='https://placehold.co/100x100/cccccc/969696?text=Logo'} />
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-blue-600 hover:underline cursor-pointer">{job.title}</h3>
                <p className="text-gray-700 font-medium">{job.company}</p>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin size={16} className="mr-1 text-green-500" /> {job.location}
                  <span className="mx-2">|</span>
                  <span className="text-orange-500 font-medium">{job.salary}</span>
                </div>
                 <div className="mt-2">
                  {job.skills.map(skill => (
                    <span key={skill} className="inline-block bg-gray-200 text-gray-700 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded-full">{skill}</span>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">Đăng {job.date}</p>
              </div>
              <button
                onClick={() => handleApplyClick(job.id)}
                className="self-start mt-1 bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-3 rounded-md transition-colors"
              >
                Nộp CV
              </button>
            </div>
          ))}
        </div>

        {/* Input file ẩn */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="text-center mt-10">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md hover:shadow-lg transform hover:scale-105">
            Xem Thêm Việc Làm
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
