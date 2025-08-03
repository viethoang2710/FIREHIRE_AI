import React, { useRef, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Loader } from 'lucide-react';
import jobService from '../../services/jobService';
import { AuthContext } from '../../contexts/AuthContext';
import ApplyJobModal from '../UI/ApplyJobModal';

const FeaturedJobs = ({ showAlert }) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy dữ liệu công việc từ API khi component được render
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching featured jobs from API...');
        const response = await jobService.getHotLatestJobs();
        console.log('Featured jobs API response:', response);
        
        // Kiểm tra và xử lý dữ liệu trả về
        if (response && response.content && Array.isArray(response.content)) {
          console.log(`Found ${response.content.length} featured jobs`);
          setJobs(response.content);
        } else if (response && Array.isArray(response)) {
          // Nếu API trả về mảng trực tiếp
          console.log(`Found ${response.length} featured jobs (direct array)`);
          setJobs(response);
        } else {
          console.error('Cấu trúc dữ liệu không đúng:', response);
          setJobs([]);
        }
      } catch (err) {
        console.error('Lỗi khi lấy việc làm nổi bật:', err);
        setError('Không thể tải dữ liệu việc làm. Sử dụng dữ liệu mẫu.');
        
        // Fallback để hiển thị dữ liệu mẫu khi API không khả dụng
        // Điều này giúp người dùng vẫn thấy giao diện hoạt động
        if (process.env.NODE_ENV === 'development') {
          const mockJobs = [
            { id: 'mock-1', title: 'Senior Frontend Developer', company: 'Tech Solutions Inc.', location: 'Hà Nội', salary: '2000 - 3000 USD', type: 'Full-time', createdAt: new Date().toISOString() },
            { id: 'mock-2', title: 'UI/UX Designer', company: 'Creative Agency', location: 'TP. Hồ Chí Minh', salary: '1500 - 2500 USD', type: 'Full-time', createdAt: new Date().toISOString() }
          ];
          setJobs(mockJobs);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Function để điều hướng đến trang hiển thị tất cả việc làm
  const handleViewMoreJobs = () => {
    navigate('/hot-latest-jobs');
  };

  // Gọi khi click "Nộp CV"
  const handleApplyClick = (job) => {
    if (!currentUser) {
      showAlert('Vui lòng đăng nhập để nộp CV ứng tuyển', 'warning');
      return;
    }

    // Kiểm tra role - chỉ CANDIDATE mới được nộp CV
    if (currentUser.role !== 'CANDIDATE') {
      showAlert('Chỉ ứng viên mới có thể nộp CV ứng tuyển', 'warning');
      return;
    }

    setSelectedJob(job);
    setShowApplyModal(true);
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
                  src={job.logo || job.companyLogo || 'https://placehold.co/100x100/cccccc/969696?text=Logo'} 
                  alt={`${job.company || job.companyName || 'Company'} logo`} 
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
                      <span className="inline-block bg-gray-200 text-gray-700 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded-full">
                        {job.type || job.jobType || 'Full-time'}
                      </span>
                    )}
                    {job.industry && (
                      <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded-full">
                        {job.industry}
                      </span>
                    )}
                    {job.experienceLevel && (
                      <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded-full">
                        {job.experienceLevel}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Đăng {job.createdDate || job.createdAt || job.date || new Date().toLocaleDateString()}
                    {job.status && job.status !== 'ACTIVE' && job.status !== 'Đang hiển thị' && (
                      <span className="ml-2 text-red-500">• {job.status}</span>
                    )}
                  </p>
                </div>
                <button 
                  className="self-start mt-1 bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-3 rounded-md transition-colors"
                  onClick={() => handleApplyClick(job)}
                >
                  Nộp CV
                </button>
              </div>
            ))}
        </div>
        )}

        {/* Apply Job Modal */}
        <ApplyJobModal
          isOpen={showApplyModal}
          onClose={() => setShowApplyModal(false)}
          job={selectedJob}
          showAlert={showAlert}
        />

        <div className="text-center mt-10">
          <button 
            onClick={handleViewMoreJobs}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Xem Thêm Việc Làm
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
