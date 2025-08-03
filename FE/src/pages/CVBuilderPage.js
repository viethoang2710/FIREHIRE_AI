import React, { useState } from 'react';
import { User, Briefcase, Award, Star, Edit, PlusCircle, Trash2, Download, Settings, CheckCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useAuth } from '../hooks/useAuth';
import cvService from '../services/cvService';

// Import các component đã được phân tách
import AccordionSection from '../components/UI/AccordionSection';
import CVPreview from '../components/CVBuilder/CVPreview';



const CVBuilderPage = () => {
  const { auth } = useAuth();
  
  // State quản lý mục nào đang được mở
  const [activeAccordion, setActiveAccordion] = useState('personalInfo');
  
  // State quản lý trạng thái tải xuống
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  
  const [cvTitle, setCvTitle] = useState('CV của tôi');
  
  // State chứa toàn bộ dữ liệu của CV
  const [cvData, setCvData] = useState({
    personalInfo: {
      fullName: '', jobTitle: '', email: '', phone: '', address: '', website: ''
    },
    objective: 'Mục tiêu của tôi là áp dụng kiến thức và kinh nghiệm lập trình để tạo ra các sản phẩm có giá trị, đồng thời phát triển bản thân trong một môi trường chuyên nghiệp.',
    experience: [
      { id: 1, company: 'Công ty ABC', position: 'Frontend Developer', duration: '01/2023 - Hiện tại', description: '- Phát triển giao diện người dùng.\n- Tối ưu hóa hiệu suất trang web.' }
    ],
    education: [
      { id: 1, school: 'Đại học Bách Khoa', degree: 'Kỹ sư Công nghệ thông tin', duration: '2019-2023' }
    ],
    skills: 'ReactJS, JavaScript, HTML, CSS, Figma',
    awards: [
      { id: 1, title: 'Nhân viên xuất sắc quý 1', year: '2024' }
    ]
  });

  // --- Handlers for Data Changes ---
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setCvData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: value }
    }));
  };
  
  const handleSimpleChange = (e) => {
    const {name, value} = e.target;
    setCvData(prev => ({...prev, [name]: value}));
  };
  
  const handleListChange = (listName, id, e) => {
      const {name, value} = e.target;
      setCvData(prev => ({
          ...prev,
          [listName]: prev[listName].map(item => item.id === id ? {...item, [name]: value} : item)
      }))
  };

  const addListItem = (listName, newItem) => {
      setCvData(prev => ({
          ...prev,
          [listName]: [...prev[listName], {...newItem, id: Date.now() }]
      }))
  };

  const removeListItem = (listName, id) => {
    if (cvData[listName].length <= 1) {
        alert("Bạn cần có ít nhất một mục.");
        return;
    }
    setCvData(prev => ({
        ...prev,
        [listName]: prev[listName].filter(item => item.id !== id)
    }));
  };

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      setDownloadSuccess(false);
      
      const preview = document.querySelector('.cv-preview-area');
      if (!preview) {
        alert('Không tìm thấy vùng xem trước CV');
        return;
      }

      // Phương pháp 1: Sử dụng window.print() để in thành PDF
      const printWindow = window.open('', '_blank');
      const cvContent = preview.innerHTML;
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>CV - ${cvData.personalInfo.fullName || 'CV'}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: white;
            }
            @media print {
              body { margin: 0; }
              @page { margin: 10mm; }
            }
          </style>
        </head>
        <body>
          ${cvContent}
        </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Đợi một chút để nội dung load xong
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
      
      // Hiển thị thông báo thành công
      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Lỗi khi tải xuống PDF:', error);
      alert('Có lỗi xảy ra khi tải xuống PDF. Vui lòng thử lại.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Hàm tạo CV mới (reset tất cả dữ liệu)
  const handleNewCV = () => {
    if (window.confirm('Bạn có chắc chắn muốn tạo CV mới? Tất cả dữ liệu hiện tại sẽ bị xóa.')) {
      setCvData({
        personalInfo: {
          fullName: '', jobTitle: '', email: '', phone: '', address: '', website: ''
        },
        objective: '',
        experience: [
          { id: 1, company: '', position: '', duration: '', description: '' }
        ],
        education: [
          { id: 1, school: '', degree: '', duration: '' }
        ],
        skills: '',
        awards: []
      });
      setActiveAccordion('personalInfo');
      setDownloadSuccess(false);
    }
  };

  // Hàm tải xuống bằng cách in
  const handlePrintPDF = () => {
    const preview = document.querySelector('.cv-preview-area');
    if (!preview) {
      alert('Không tìm thấy vùng xem trước CV');
      return;
    }

    // Tạo một window mới để in
    const printContent = preview.innerHTML;
    const originalContent = document.body.innerHTML;
    
    // Thay thế nội dung trang bằng CV
    document.body.innerHTML = `
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        @media print {
          body { margin: 0; padding: 10mm; }
          @page { margin: 0; size: A4; }
        }
      </style>
      ${printContent}
    `;
    
    // In trang
    window.print();
    
    // Khôi phục nội dung gốc
    document.body.innerHTML = originalContent;
    
    // Reload lại page để khôi phục các event listeners
    window.location.reload();
  };

  // Hàm debug để kiểm tra element
  const handleDebugPDF = () => {
    const preview = document.querySelector('.cv-preview-area');
    console.log('Preview element:', preview);
    console.log('Preview dimensions:', {
      width: preview?.offsetWidth,
      height: preview?.offsetHeight,
      scrollWidth: preview?.scrollWidth,
      scrollHeight: preview?.scrollHeight
    });
    console.log('CV Data:', cvData);
    alert(`Element found: ${preview ? 'Yes' : 'No'}\nDimensions: ${preview?.offsetWidth}x${preview?.offsetHeight}`);
  };

  return (
    <div className="min-h-[calc(100vh-68px)] flex flex-col lg:flex-row bg-gray-200 font-sans">
      {/* --- Left Panel: Form --- */}
      <aside className="w-full lg:w-[450px] bg-white p-6 overflow-y-auto shadow-xl z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Trình tạo CV Online</h1>
            <p className="text-sm text-gray-500">Điền thông tin vào các mục bên dưới.</p>
          </div>
          <div className="flex gap-2 items-center">
            {/* Input tiêu đề CV */}
            <input
              type="text"
              value={cvTitle}
              onChange={(e) => setCvTitle(e.target.value)}
              placeholder="Tên CV..."
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <button
              onClick={handleNewCV}
              className="px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              title="Tạo CV mới"
            >
              Mới
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {/* Section: Thông tin cá nhân */}
          <AccordionSection title="Thông tin cá nhân" icon={User} isOpen={activeAccordion === 'personalInfo'} onClick={() => setActiveAccordion('personalInfo')}>
            <div className="space-y-4">
              <input name="fullName" value={cvData.personalInfo.fullName} onChange={handlePersonalInfoChange} placeholder="Họ và tên" className="input-field" />
              <input name="jobTitle" value={cvData.personalInfo.jobTitle} onChange={handlePersonalInfoChange} placeholder="Vị trí ứng tuyển" className="input-field" />
              <input name="email" type="email" value={cvData.personalInfo.email} onChange={handlePersonalInfoChange} placeholder="Email" className="input-field" />
              <input name="phone" value={cvData.personalInfo.phone} onChange={handlePersonalInfoChange} placeholder="Số điện thoại" className="input-field" />
              <input name="address" value={cvData.personalInfo.address} onChange={handlePersonalInfoChange} placeholder="Địa chỉ" className="input-field" />
              <input name="website" value={cvData.personalInfo.website} onChange={handlePersonalInfoChange} placeholder="Website/LinkedIn (nếu có)" className="input-field" />
            </div>
          </AccordionSection>
          
          {/* Section: Mục tiêu nghề nghiệp */}
          <AccordionSection title="Mục tiêu nghề nghiệp" icon={Edit} isOpen={activeAccordion === 'objective'} onClick={() => setActiveAccordion('objective')}>
             <textarea name="objective" value={cvData.objective} onChange={handleSimpleChange} rows="5" placeholder="Viết một đoạn ngắn về mục tiêu của bạn..." className="input-field"></textarea>
          </AccordionSection>

          {/* Section: Kinh nghiệm làm việc */}
          <AccordionSection title="Kinh nghiệm làm việc" icon={Briefcase} isOpen={activeAccordion === 'experience'} onClick={() => setActiveAccordion('experience')}>
             {cvData.experience.map((exp) => (
                <div key={exp.id} className="p-3 border rounded-md mb-3 relative bg-gray-50">
                   <input name="company" value={exp.company} onChange={(e) => handleListChange('experience', exp.id, e)} placeholder="Công ty" className="input-field font-semibold mb-2" />
                   <input name="position" value={exp.position} onChange={(e) => handleListChange('experience', exp.id, e)} placeholder="Vị trí" className="input-field text-sm mb-2" />
                   <input name="duration" value={exp.duration} onChange={(e) => handleListChange('experience', exp.id, e)} placeholder="Thời gian (VD: 01/2023 - Hiện tại)" className="input-field text-xs mb-2" />
                   <textarea name="description" value={exp.description} onChange={(e) => handleListChange('experience', exp.id, e)} rows="4" placeholder="Mô tả công việc (mỗi gạch đầu dòng một dòng)..." className="input-field text-sm"></textarea>
                   <button onClick={() => removeListItem('experience', exp.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"><Trash2 size={16} /></button>
                </div>
             ))}
             <button onClick={() => addListItem('experience', {company: '', position: '', duration:'', description: ''})} className="text-blue-600 font-semibold text-sm flex items-center mt-2 p-2 hover:bg-blue-50 rounded-md"><PlusCircle size={16} className="mr-1"/> Thêm kinh nghiệm</button>
          </AccordionSection>

          {/* Section: Học vấn */}
          <AccordionSection title="Học vấn" icon={Award} isOpen={activeAccordion === 'education'} onClick={() => setActiveAccordion('education')}>
             {cvData.education.map((edu) => (
                <div key={edu.id} className="p-3 border rounded-md mb-3 relative bg-gray-50">
                   <input name="school" value={edu.school} onChange={(e) => handleListChange('education', edu.id, e)} placeholder="Trường học" className="input-field font-semibold mb-2" />
                   <input name="degree" value={edu.degree} onChange={(e) => handleListChange('education', edu.id, e)} placeholder="Chuyên ngành / Bằng cấp" className="input-field text-sm mb-2" />
                   <input name="duration" value={edu.duration} onChange={(e) => handleListChange('education', edu.id, e)} placeholder="Thời gian (VD: 2019-2023)" className="input-field text-xs" />
                   <button onClick={() => removeListItem('education', edu.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"><Trash2 size={16} /></button>
                </div>
             ))}
             <button onClick={() => addListItem('education', {school: '', degree: '', duration: ''})} className="text-blue-600 font-semibold text-sm flex items-center mt-2 p-2 hover:bg-blue-50 rounded-md"><PlusCircle size={16} className="mr-1"/> Thêm học vấn</button>
          </AccordionSection>
          
          {/* Section: Kỹ năng */}
           <AccordionSection title="Kỹ năng" icon={Star} isOpen={activeAccordion === 'skills'} onClick={() => setActiveAccordion('skills')}>
             <p className="text-xs text-gray-500 mb-2">Liệt kê các kỹ năng của bạn, cách nhau bởi dấu phẩy.</p>
             <textarea name="skills" value={cvData.skills} onChange={handleSimpleChange} rows="4" placeholder="VD: ReactJS, JavaScript, Figma..." className="input-field"></textarea>
          </AccordionSection>
        </div>

        {/* Global CSS for input fields */}
        <style jsx global>{`
            .input-field {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                transition: border-color 0.2s, box-shadow 0.2s;
                font-size: 14px;
            }
            .input-field:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
            }
            
            @keyframes fade-in-down {
                0% {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .animate-fade-in-down {
                animation: fade-in-down 0.5s ease-out forwards;
            }
        `}</style>
      </aside>

      {/* --- Right Panel: Preview --- */}
      <main className="w-full flex-grow p-4 md:p-8 flex flex-col items-center justify-start lg:justify-center bg-gray-200">
        <div className="w-full max-w-[210mm] mb-4 p-2 bg-white rounded-lg shadow-md flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-600">Bản xem trước</span>
            <div className="flex items-center gap-2">
                <button 
                  onClick={handleDebugPDF}
                  className="p-2 rounded-md hover:bg-gray-100 text-gray-600" 
                  title="Debug PDF"
                >
                  🔍
                </button>
                <button className="p-2 rounded-md hover:bg-gray-100 text-gray-600" title="Cài đặt mẫu">
                  <Settings size={18} />
                </button>
                
                {/* Nút tải xuống với trạng thái */}
                <button 
                  onClick={handlePrintPDF}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition-colors text-sm"
                  title="In CV (Ctrl+P)"
                >
                  🖨️ In
                </button>
                
                <button 
                  className={`font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition-colors text-sm min-w-[120px] ${
                    isDownloading 
                      ? 'bg-gray-400 cursor-not-allowed text-white' 
                      : downloadSuccess 
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`} 
                  title="Tải CV xuống" 
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang tải...
                    </>
                  ) : downloadSuccess ? (
                    <>
                      <CheckCircle size={16} className="mr-2"/> 
                      Hoàn thành
                    </>
                  ) : (
                    <>
                      <Download size={16} className="mr-2"/> 
                      Tải xuống
                    </>
                  )}
                </button>
            </div>
        </div>
        <div className="w-full max-w-[210mm] max-h-[90vh] lg:max-h-[85vh] overflow-hidden rounded-lg shadow-2xl cv-preview-area">
           <CVPreview data={cvData} />
        </div>
        
        {/* Thông báo toast khi tải xuống thành công */}
        {downloadSuccess && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-fade-in-down z-50">
            <CheckCircle size={20} className="mr-2"/>
            <span>CV đã được tải xuống thành công!</span>
          </div>
        )}
      </main>
    </div>
  );
};

export default CVBuilderPage;