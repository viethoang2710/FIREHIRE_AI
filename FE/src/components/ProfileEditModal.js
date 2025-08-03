import React, { useState } from 'react';

const ProfileEditModal = ({ profile, isOpen, onClose, onSave }) => {
  const [editedProfile, setEditedProfile] = useState(profile || {});
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh hợp lệ');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước ảnh không được vượt quá 5MB');
        return;
      }

      setProfileImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(editedProfile, profileImage);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa thông tin cá nhân</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg overflow-hidden mb-4">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : profile?.profileImage ? (
                <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                editedProfile?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'N/A'
              )}
            </div>
            <label className="bg-indigo-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors">
              📷 Thay đổi ảnh đại diện
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
              <input
                type="text"
                value={editedProfile?.fullName || ''}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:border-indigo-600 outline-none"
                placeholder="Nhập họ và tên"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chức danh</label>
              <input
                type="text"
                value={editedProfile?.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:border-indigo-600 outline-none"
                placeholder="Ví dụ: Frontend Developer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={editedProfile?.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:border-indigo-600 outline-none"
                placeholder="email@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
              <input
                type="tel"
                value={editedProfile?.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:border-indigo-600 outline-none"
                placeholder="+84 123 456 789"
              />
            </div>
          </div>

          {/* Address and Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
              <input
                type="text"
                value={editedProfile?.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:border-indigo-600 outline-none"
                placeholder="Thành phố, Quốc gia"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kinh nghiệm</label>
              <input
                type="text"
                value={editedProfile?.experience || ''}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:border-indigo-600 outline-none"
                placeholder="3 năm kinh nghiệm"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kỹ năng</label>
            <textarea
              value={editedProfile?.skills || ''}
              onChange={(e) => handleInputChange('skills', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:border-indigo-600 outline-none"
              placeholder="React, Node.js, Python, MySQL..."
              rows="3"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Giới thiệu</label>
            <textarea
              value={editedProfile?.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:border-indigo-600 outline-none"
              placeholder="Giới thiệu về bản thân, kinh nghiệm và mục tiêu nghề nghiệp..."
              rows="4"
            />
          </div>

          {/* Social Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Liên kết mạng xã hội</label>
            <div className="space-y-3">
              <input
                type="url"
                value={editedProfile?.linkedin || ''}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:border-indigo-600 outline-none"
                placeholder="LinkedIn URL"
              />
              <input
                type="url"
                value={editedProfile?.github || ''}
                onChange={(e) => handleInputChange('github', e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:border-indigo-600 outline-none"
                placeholder="GitHub URL"
              />
              <input
                type="url"
                value={editedProfile?.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:border-indigo-600 outline-none"
                placeholder="Website URL"
              />
            </div>
          </div>

          {/* Work Preference and Salary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loại công việc mong muốn</label>
              <select
                value={editedProfile?.workPreference || 'FULL_TIME'}
                onChange={(e) => handleInputChange('workPreference', e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:border-indigo-600 outline-none"
              >
                <option value="FULL_TIME">Toàn thời gian</option>
                <option value="PART_TIME">Bán thời gian</option>
                <option value="CONTRACT">Hợp đồng</option>
                <option value="FREELANCE">Freelance</option>
                <option value="REMOTE">Remote</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mức lương mong muốn</label>
              <input
                type="text"
                value={editedProfile?.salaryExpectation || ''}
                onChange={(e) => handleInputChange('salaryExpectation', e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:border-indigo-600 outline-none"
                placeholder="15 - 30 triệu VNĐ"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;
