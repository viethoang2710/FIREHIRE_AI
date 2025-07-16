import React, { useState } from 'react';
import { Plus, Briefcase, Users, Edit, Trash2, Eye, X } from 'lucide-react';

// --- Dữ liệu giả lập ---
const mockJobs = [
  { id: 1, title: 'Senior Frontend Developer (ReactJS)', location: 'Hà Nội', applicants: 25, status: 'Đang hiển thị' },
  { id: 2, title: 'UI/UX Designer', location: 'TP. Hồ Chí Minh', applicants: 18, status: 'Đang hiển thị' },
  { id: 3, title: 'Project Manager', location: 'Từ xa', applicants: 32, status: 'Đã hết hạn' },
];

// --- Component: Form đăng tin tuyển dụng (Modal) ---
const PostJobModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Đăng tin tuyển dụng mới</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={20} /></button>
        </div>
        <form className="flex-grow overflow-y-auto p-6 space-y-4">
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Tên việc làm</label>
            <input type="text" id="jobTitle" className="mt-1 input-field" placeholder="VD: Lập trình viên ReactJS" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Tên công ty</label>
              <input type="text" id="companyName" className="mt-1 input-field" value="Tech Solutions Inc." disabled />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Địa điểm làm việc</label>
              <input type="text" id="location" className="mt-1 input-field" placeholder="VD: Hà Nội, Việt Nam" />
            </div>
          </div>
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Mức lương</label>
            <input type="text" id="salary" className="mt-1 input-field" placeholder="VD: 20-30 triệu hoặc 'Thương lượng'" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Mô tả công việc</label>
            <textarea id="description" rows="5" className="mt-1 input-field" placeholder="Mô tả chi tiết về công việc..."></textarea>
          </div>
          <div>
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">Yêu cầu ứng viên</label>
            <textarea id="requirements" rows="5" className="mt-1 input-field" placeholder="Các kỹ năng, kinh nghiệm cần có..."></textarea>
          </div>
          <div>
            <label htmlFor="benefits" className="block text-sm font-medium text-gray-700">Quyền lợi</label>
            <textarea id="benefits" rows="4" className="mt-1 input-field" placeholder="Các quyền lợi, phúc lợi cho ứng viên..."></textarea>
          </div>
        </form>
        <div className="p-4 border-t flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Hủy</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Đăng tin</button>
        </div>
      </div>
      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
};


// --- Component chính của trang ---
const RecruiterDashboardPage = ({ navigate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header riêng cho nhà tuyển dụng (có thể tạo component riêng) */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">
            <Briefcase className="inline-block mr-2" />
            Trang Nhà Tuyển Dụng
          </h1>
          <nav>
            {/* Các link điều hướng riêng cho NTD */}
          </nav>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Bảng điều khiển</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus size={20} className="mr-2" />
            Đăng tin mới
          </button>
        </div>

        {/* Danh sách các bài đăng */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Quản lý tin tuyển dụng</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3">Tên việc làm</th>
                  <th scope="col" className="px-6 py-3">Ứng viên</th>
                  <th scope="col" className="px-6 py-3">Trạng thái</th>
                  <th scope="col" className="px-6 py-3">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {mockJobs.map(job => (
                  <tr key={job.id} className="bg-white border-b hover:bg-gray-50">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {job.title}
                      <p className="text-xs text-gray-500">{job.location}</p>
                    </th>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Users size={16} className="mr-1 text-blue-500" /> {job.applicants}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${job.status === 'Đang hiển thị' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <button onClick={() => navigate('viewApplicants', { jobId: job.id })} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full" title="Xem danh sách CV"><Eye size={18} /></button>
                      <button className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-full" title="Sửa"><Edit size={18} /></button>
                      <button className="p-2 text-red-600 hover:bg-red-100 rounded-full" title="Xóa"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      <PostJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default RecruiterDashboardPage;