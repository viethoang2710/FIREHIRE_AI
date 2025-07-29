import React, { useState } from 'react';
import { Bot, FileText, Filter, SlidersHorizontal, User, Mail, Phone, Check, X, ChevronLeft } from 'lucide-react';

// --- Dữ liệu giả lập ---
const mockApplicants = [
  { id: 1, name: 'Nguyễn Văn An', appliedFor: 'Senior Frontend Developer', match: 92, status: 'Phù hợp', cvFile: 'Nguyen_Van_An_CV.pdf' },
  { id: 2, name: 'Lê Thị Bình', appliedFor: 'Senior Frontend Developer', match: 85, status: 'Cân nhắc', cvFile: 'Le_Thi_Binh_Resume.docx' },
  { id: 3, name: 'Trần Hoàng C', appliedFor: 'Senior Frontend Developer', match: 78, status: 'Cân nhắc', cvFile: 'Tran_Hoang_C.pdf' },
  { id: 4, name: 'Phạm Thị Dũng', appliedFor: 'Senior Frontend Developer', match: 65, status: 'Không phù hợp', cvFile: 'Pham_Thi_Dung_CV.pdf' },
];

const AIFilterModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800 flex items-center"><Bot size={22} className="mr-2 text-blue-600"/> Lọc ứng viên bằng AI</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={20} /></button>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-4">Nhập các yêu cầu của bạn, AI sẽ tìm và xếp hạng các ứng viên phù hợp nhất từ danh sách.</p>
          <div>
            <label htmlFor="ai-requirements" className="block text-sm font-medium text-gray-700">Yêu cầu của bạn</label>
            <textarea 
              id="ai-requirements" 
              rows="6" 
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              placeholder="VD: - Ít nhất 3 năm kinh nghiệm với ReactJS&#10;- Có kinh nghiệm làm việc với TypeScript&#10;- Kỹ năng làm việc nhóm tốt&#10;- Tiếng Anh giao tiếp"
            ></textarea>
          </div>
        </div>
        <div className="p-4 border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Bắt đầu lọc</button>
        </div>
      </div>
    </div>
  );
};


const ViewApplicantsPage = ({ navigate, jobId }) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(mockApplicants[0]); // Chọn ứng viên đầu tiên làm ví dụ

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <button onClick={() => navigate('recruiterDashboard')} className="flex items-center text-sm text-blue-600 hover:underline mb-6">
        <ChevronLeft size={18} className="mr-1"/> Quay lại danh sách tin đăng
      </button>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Ứng viên cho vị trí</h1>
          <p className="text-xl text-blue-600">Senior Frontend Developer (ReactJS)</p>
        </div>
        <button 
          onClick={() => setIsFilterModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors shadow-lg"
        >
          <Filter size={18} className="mr-2"/> Lọc bằng AI
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cột trái: Danh sách ứng viên */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg shadow-lg p-4 space-y-2 max-h-[70vh] overflow-y-auto">
            {mockApplicants.map(applicant => (
              <button 
                key={applicant.id} 
                onClick={() => setSelectedApplicant(applicant)}
                className={`w-full text-left p-3 rounded-md border-2 transition-colors ${selectedApplicant?.id === applicant.id ? 'bg-blue-50 border-blue-500' : 'bg-transparent border-transparent hover:bg-gray-100'}`}
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-800">{applicant.name}</p>
                  <p className="text-sm font-bold" style={{color: applicant.match > 90 ? '#16a34a' : applicant.match > 75 ? '#ca8a04' : '#dc2626'}}>{applicant.match}%</p>
                </div>
                <p className="text-xs text-gray-500">{applicant.cvFile}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Cột phải: Chi tiết ứng viên */}
        <div className="w-full lg:w-2/3">
          {selectedApplicant ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-col sm:flex-row items-start gap-6 border-b pb-6 mb-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={48} className="text-gray-500"/>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedApplicant.name}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                    <span className="flex items-center"><Mail size={14} className="mr-1.5"/> an.nguyen@email.com</span>
                    <span className="flex items-center"><Phone size={14} className="mr-1.5"/> 0987 654 321</span>
                  </div>
                   <div className="mt-4 flex items-center gap-2">
                    <button className="px-4 py-1.5 text-sm bg-green-100 text-green-800 rounded-full flex items-center hover:bg-green-200"><Check size={16} className="mr-1"/> Mời phỏng vấn</button>
                    <button className="px-4 py-1.5 text-sm bg-red-100 text-red-800 rounded-full flex items-center hover:bg-red-200"><X size={16} className="mr-1"/> Từ chối</button>
                  </div>
                </div>
              </div>
              {/* Giả lập khu vực xem CV */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Nội dung CV</h3>
                <div className="w-full h-96 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Bản xem trước CV sẽ hiển thị ở đây</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6 flex items-center justify-center h-full">
              <p className="text-gray-500">Chọn một ứng viên để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>
      
      <AIFilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} />
    </div>
  );
};

export default ViewApplicantsPage;