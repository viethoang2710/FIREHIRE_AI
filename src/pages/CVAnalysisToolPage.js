// Công cụ phân tích CV

// src/pages/CVAnalysisToolPage.js
import React, { useState } from 'react';
import { UploadCloud, FileCheck, Lightbulb } from 'lucide-react';

function CVAnalysisToolPage({ navigate, showAlert }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setSelectedFile(file);
      setAnalysisResult(null); // Reset previous result
    } else {
      setSelectedFile(null);
      setAnalysisResult(null);
      showAlert('Vui lòng chọn file PDF hoặc DOCX.', 'error');
    }
  };

  const handleAnalyzeCV = () => {
    if (!selectedFile) {
      showAlert('Vui lòng tải lên CV của bạn để phân tích.', 'warning');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Simulate API call for CV analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      // Mock analysis result
      const mockResult = {
        score: Math.floor(Math.random() * 30) + 70, // Score between 70-100
        feedback: [
          "CV của bạn có cấu trúc rõ ràng và dễ đọc. Tốt!",
          "Phần 'Kinh nghiệm làm việc' cần chi tiết hơn về các số liệu định lượng (ví dụ: đã tăng doanh số X%, giảm chi phí Y%).",
          "Hãy cân nhắc thêm từ khóa liên quan đến ngành nghề mục tiêu để tối ưu cho hệ thống ATS.",
          "Kiểm tra lại lỗi chính tả và ngữ pháp để đảm bảo sự chuyên nghiệp."
        ],
        keywordsFound: ['Marketing', 'Project Management', 'Data Analysis', 'Leadership'],
        missingSections: ['Mục tiêu nghề nghiệp rõ ràng hơn'],
      };
      setAnalysisResult(mockResult);
      showAlert('Phân tích CV hoàn tất!', 'success');
    }, 2000);
  };

  const renderAnalysisResult = () => {
    if (!analysisResult) return null;

    return (
      <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">Kết quả Phân tích CV</h2>
        <div className="text-center mb-6">
          <p className="text-gray-700 text-lg">Điểm CV của bạn:</p>
          <p className="text-5xl font-extrabold text-blue-600 mt-2">{analysisResult.score}/100</p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Đánh giá & Gợi ý cải thiện:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            {analysisResult.feedback.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {analysisResult.keywordsFound.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Các từ khóa chính được tìm thấy:</h3>
            <div className="flex flex-wrap gap-2">
              {analysisResult.keywordsFound.map((keyword, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">{keyword}</span>
              ))}
            </div>
          </div>
        )}

        {analysisResult.missingSections.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Các mục có thể bổ sung/cải thiện:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {analysisResult.missingSections.map((item, index) => (
                <li key={index} className="text-red-600">{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Công cụ Phân tích CV bằng AI</h1>
      <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl mx-auto">
        Sử dụng công nghệ AI để phân tích CV của bạn, đưa ra đánh giá khách quan và gợi ý cải thiện để tăng cơ hội gây ấn tượng với nhà tuyển dụng.
      </p>

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
        <div className="w-full mb-6">
          <label htmlFor="cv-upload" className="block text-gray-700 text-sm font-bold mb-2">
            Tải lên CV của bạn (.pdf, .docx):
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="cv-upload"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud size={48} className="text-gray-400 mb-3" />
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click để tải lên</span> hoặc kéo thả file</p>
                <p className="text-xs text-gray-500">PDF, DOCX (Tối đa 5MB)</p>
              </div>
              <input id="cv-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
            </label>
          </div>
          {selectedFile && (
            <p className="text-sm text-gray-600 mt-3 text-center">File đã chọn: <span className="font-medium text-blue-600">{selectedFile.name}</span></p>
          )}
        </div>

        <button
          onClick={handleAnalyzeCV}
          disabled={!selectedFile || isAnalyzing}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isAnalyzing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang phân tích...
            </>
          ) : (
            <>
              <FileCheck size={20} className="mr-2" /> Phân tích CV của tôi
            </>
          )}
        </button>

        {renderAnalysisResult()}

        <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
          <h3 className="font-bold text-base mb-2 flex items-center"><Lightbulb size={20} className="mr-2"/> Tại sao phân tích CV lại quan trọng?</h3>
          <p>
            Hơn 70% nhà tuyển dụng sử dụng hệ thống theo dõi ứng viên (ATS) để sàng lọc CV. Công cụ phân tích CV giúp bạn tối ưu hóa CV để vượt qua vòng lọc này và thu hút sự chú ý của nhà tuyển dụng.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CVAnalysisToolPage;