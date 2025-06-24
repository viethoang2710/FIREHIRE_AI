import React, { useState } from 'react';
import { User, Briefcase, Award, Star, Edit, PlusCircle, Trash2, Download, Settings } from 'lucide-react';



// Import các component đã được phân tách
import AccordionSection from '../components/UI/AccordionSection';
import CVPreview from '../components/CVBuilder/CVPreview';



const CVBuilderPage = () => {
  // State quản lý mục nào đang được mở
  const [activeAccordion, setActiveAccordion] = useState('personalInfo');
  
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

  return (
    <div className="min-h-[calc(100vh-68px)] flex flex-col lg:flex-row bg-gray-200 font-sans">
      {/* --- Left Panel: Form --- */}
      <aside className="w-full lg:w-[450px] bg-white p-6 overflow-y-auto shadow-xl z-10">
        <h1 className="text-2xl font-bold mb-2">Trình tạo CV Online</h1>
        <p className="text-sm text-gray-500 mb-6">Điền thông tin vào các mục bên dưới.</p>
        
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
        `}</style>
      </aside>

      {/* --- Right Panel: Preview --- */}
      <main className="w-full flex-grow p-4 md:p-8 flex flex-col items-center justify-start lg:justify-center bg-gray-200">
        <div className="w-full max-w-[210mm] mb-4 p-2 bg-white rounded-lg shadow-md flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-600">Bản xem trước</span>
            <div className="flex items-center gap-2">
                <button className="p-2 rounded-md hover:bg-gray-100 text-gray-600" title="Cài đặt mẫu"><Settings size={18} /></button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition-colors text-sm" title="Tải CV xuống"><Download size={16} className="mr-2"/> Tải xuống</button>
            </div>
        </div>
        <div className="w-full max-w-[210mm] max-h-[90vh] lg:max-h-[85vh] overflow-hidden rounded-lg shadow-2xl">
           <CVPreview data={cvData} />
        </div>
      </main>
    </div>
  );
};

export default CVBuilderPage;