import React, { useState } from 'react';
import { X, Save, Mail, Phone, Calendar, User, Shield } from 'lucide-react';

const UserEditModal = ({ user, isOpen, onClose, onSave, onSendEmail }) => {
  const [editedUser, setEditedUser] = useState(user || {});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(editedUser);
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = () => {
    onSendEmail(editedUser.email);
  };

  if (!isOpen || !user) return null;

  const getRoleLabel = (role) => {
    const roleLabels = {
      'JOB_SEEKER': 'Ứng viên',
      'EMPLOYER': 'Nhà tuyển dụng',
      'ADMIN': 'Quản trị viên'
    };
    return roleLabels[role] || role;
  };

  const getStatusColor = (status) => {
    const colors = {
      'ACTIVE': 'text-green-600 bg-green-100',
      'INACTIVE': 'text-gray-600 bg-gray-100',
      'PENDING': 'text-yellow-600 bg-yellow-100',
      'BANNED': 'text-red-600 bg-red-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Chi tiết người dùng</h2>
              <p className="text-sm text-gray-500">ID: {user.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên *
              </label>
              <input
                type="text"
                value={editedUser.fullName || ''}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập họ và tên"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <div className="flex">
                <input
                  type="email"
                  value={editedUser.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập email"
                />
                <button
                  onClick={handleSendEmail}
                  className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
                  title="Gửi email"
                >
                  <Mail className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                  <Phone className="h-4 w-4" />
                </span>
                <input
                  type="tel"
                  value={editedUser.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vai trò
              </label>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-gray-400" />
                <select
                  value={editedUser.role || ''}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="JOB_SEEKER">Ứng viên</option>
                  <option value="EMPLOYER">Nhà tuyển dụng</option>
                  <option value="ADMIN">Quản trị viên</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={editedUser.status || ''}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ACTIVE">Hoạt động</option>
                <option value="INACTIVE">Không hoạt động</option>
                <option value="PENDING">Chờ duyệt</option>
                <option value="BANNED">Bị cấm</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày đăng ký
              </label>
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Completeness */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Độ hoàn thiện hồ sơ
            </label>
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${user.profileCompleteness || 0}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700 min-w-[3rem]">
                {user.profileCompleteness || 0}%
              </span>
            </div>
          </div>

          {/* Activity Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">
                {user.loginCount || 0}
              </div>
              <div className="text-sm text-blue-700">Lần đăng nhập</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                {user.applicationCount || 0}
              </div>
              <div className="text-sm text-green-700">Đơn ứng tuyển</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">
                {user.jobPostCount || 0}
              </div>
              <div className="text-sm text-purple-700">Tin đăng</div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">
                {user.viewCount || 0}
              </div>
              <div className="text-sm text-orange-700">Lượt xem hồ sơ</div>
            </div>
          </div>

          {/* Status History */}
          {user.statusHistory && user.statusHistory.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Lịch sử trạng thái</h3>
              <div className="space-y-2">
                {user.statusHistory.map((history, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(history.status)}`}>
                        {history.status}
                      </span>
                      <span className="text-sm text-gray-600">{history.reason}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(history.timestamp).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú
            </label>
            <textarea
              value={editedUser.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Thêm ghi chú về người dùng này..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Hủy
          </button>
          <button
            onClick={handleSendEmail}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <Mail className="h-4 w-4 mr-2 inline" />
            Gửi email
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;
