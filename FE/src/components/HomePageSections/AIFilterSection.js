import React, { useState, useRef } from 'react';
import { Filter, UploadCloud } from 'lucide-react';

const AIFilterSection = ({ showAlert }) => {
  const [cvFile, setCvFile] = useState(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === "application/pdf" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        if (file.size <= 5 * 1024 * 1024) { 
          setCvFile(file);
          showAlert(`Đã chọn file: ${file.name}`, 'success');
        } else {
          showAlert('Kích thước file quá lớn. Vui lòng chọn file dưới 5MB.', 'error');
          setCvFile(null);
          if(fileInputRef.current) fileInputRef.current.value = null; 
        }
      } else {
        showAlert('Định dạng file không hợp lệ. Chỉ chấp nhận PDF, DOC, DOCX.', 'error');
        setCvFile(null);
        if(fileInputRef.current) fileInputRef.current.value = null;
      }
    }
  };

  const handleFilterCV = () => {
    if (!cvFile) {
      showAlert('Vui lòng chọn một file CV để lọc.', 'warning');
      return;
    }
    setIsFiltering(true);
    showAlert(`Đang phân tích CV: ${cvFile.name}...`, 'success');
    setTimeout(() => {
      setIsFiltering(false);
      showAlert('Phân tích CV hoàn tất! Kết quả sẽ được hiển thị (trong phiên bản đầy đủ).', 'success');
      setCvFile(null);
      if(fileInputRef.current) fileInputRef.current.value = null;
    }, 3000);
  };

  return (
    <section className="py-12 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-lg shadow-xl my-8">
      <div className="container mx-auto px-4 text-center">
        <Filter size={48} className="mx-auto mb-4 text-yellow-400" />
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Lọc CV Thông Minh Bằng AI</h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Tải lên CV của bạn để hệ thống AI của chúng tôi phân tích và gợi ý những công việc phù hợp nhất,
          giúp bạn tiết kiệm thời gian và tăng cơ hội thành công.
        </p>
        <div className="max-w-xl mx-auto bg-white/20 backdrop-blur-sm p-6 rounded-lg shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <label htmlFor="cv-upload" className="cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center w-full sm:w-auto">
              <UploadCloud size={20} className="mr-2" />
              {cvFile ? cvFile.name : 'Chọn File CV (PDF, DOC, DOCX)'}
            </label>
            <input 
              id="cv-upload" 
              type="file" 
              className="hidden" 
              accept=".pdf,.doc,.docx" 
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            <button 
              onClick={handleFilterCV} 
              disabled={isFiltering || !cvFile}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto flex items-center justify-center"
            >
              {isFiltering ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Filter size={20} className="mr-2" />
                  Lọc CV Ngay
                </>
              )}
            </button>
          </div>
          {cvFile && <p className="text-sm mt-3 text-gray-200">Đã chọn: {cvFile.name}</p>}
        </div>
      </div>
    </section>
  );
};

export default AIFilterSection;