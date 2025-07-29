import React, { useRef, useState, useEffect } from 'react';
import { MapPin, Loader } from 'lucide-react';
import jobService from '../../services/jobService';

const FeaturedJobs = () => {
  const fileInputRef = useRef(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy dữ liệu công việc từ API khi component được render
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await jobService.getHotLatestJobs();
        console.log('Dữ liệu việc làm nổi bật:', response);
        
        // Kiểm tra và xử lý dữ liệu trả về
        if (response && response.content && Array.isArray(response.content)) {
          setJobs(response.content);
        } else {
          console.error('Cấu trúc dữ liệu không đúng:', response);
          setJobs([]);
        }
      } catch (err) {
        console.error('Lỗi khi lấy việc làm nổi bật:', err);
        setError('Không thể tải dữ liệu việc làm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

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
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="animate-spin mr-2" size={24} />
            <span>Đang tải việc làm...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 text-center">
            {error}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Hiện chưa có tin tuyển dụng nào. Vui lòng quay lại sau.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {jobs.map(job => (
              <div key={job.id} className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex space-x-4">
                <img 
                  src={job.logo || job.companyLogo} 
                  alt={`${job.company || 'Company'} logo`} 
                  className="w-16 h-16 rounded-md object-contain flex-shrink-0 mt-1" 
                  onError={(e) => e.target.src='https://placehold.co/100x100/cccccc/969696?text=Logo'} 
                />
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-blue-600 hover:underline cursor-pointer">{job.title}</h3>
                  <p className="text-gray-700 font-medium">{job.company || job.companyName || 'Tech Solutions Inc.'}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin size={16} className="mr-1 text-green-500" /> {job.location}
                    <span className="mx-2">|</span>
                    <span className="text-orange-500 font-medium">{job.salary}</span>
                  </div>
                  <div className="mt-2">
                    {job.skills && Array.isArray(job.skills) ? job.skills.map(skill => (
                      <span key={skill} className="inline-block bg-gray-200 text-gray-700 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded-full">{skill}</span>
                    )) : (
                      <span className="inline-block bg-gray-200 text-gray-700 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded-full">{job.type || 'Full-time'}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Đăng {job.date || job.createdAt || new Date().toLocaleDateString()}
                  </p>
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
        )}

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
