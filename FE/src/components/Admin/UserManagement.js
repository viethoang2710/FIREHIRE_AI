import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Edit, Trash2, UserCheck, UserX, Mail, Eye } from 'lucide-react';
import api from '../../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [actionDropdown, setActionDropdown] = useState(null);

  // Mock data for development
  const mockUsers = [
    {
      id: 1,
      fullName: 'Nguyễn Văn An',
      email: 'an.nguyen@email.com',
      phone: '0123456789',
      role: 'JOB_SEEKER',
      status: 'ACTIVE',
      createdAt: '2024-01-15',
      lastLogin: '2024-01-20',
      profileCompleteness: 85
    },
    {
      id: 2,
      fullName: 'Trần Thị Bình',
      email: 'binh.tran@company.com',
      phone: '0987654321',
      role: 'EMPLOYER',
      status: 'ACTIVE',
      createdAt: '2024-01-10',
      lastLogin: '2024-01-19',
      profileCompleteness: 92
    },
    {
      id: 3,
      fullName: 'Lê Văn Cường',
      email: 'cuong.le@email.com',
      phone: '0555666777',
      role: 'JOB_SEEKER',
      status: 'INACTIVE',
      createdAt: '2024-01-05',
      lastLogin: '2024-01-10',
      profileCompleteness: 45
    },
    {
      id: 4,
      fullName: 'Phạm Thị Dung',
      email: 'dung.pham@hr.com',
      phone: '0333444555',
      role: 'EMPLOYER',
      status: 'PENDING',
      createdAt: '2024-01-18',
      lastLogin: null,
      profileCompleteness: 70
    },
    {
      id: 5,
      fullName: 'Hoàng Văn Em',
      email: 'em.hoang@tech.com',
      phone: '0111222333',
      role: 'JOB_SEEKER',
      status: 'ACTIVE',
      createdAt: '2024-01-12',
      lastLogin: '2024-01-21',
      profileCompleteness: 95
    }
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      // const response = await api.get('/admin/users');
      // setUsers(response.data);
      
      // Using mock data for now
      setTimeout(() => {
        setUsers(mockUsers);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers(mockUsers);
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      // await api.put(`/admin/users/${userId}/status`, { status: newStatus });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      setActionDropdown(null);
      // Show success notification
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        // await api.delete(`/admin/users/${userId}`);
        setUsers(users.filter(user => user.id !== userId));
        setActionDropdown(null);
        // Show success notification
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const sendEmail = (userEmail) => {
    window.location.href = `mailto:${userEmail}`;
    setActionDropdown(null);
  };

  // Filter and search logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const getRoleLabel = (role) => {
    const roleLabels = {
      'JOB_SEEKER': 'Ứng viên',
      'EMPLOYER': 'Nhà tuyển dụng',
      'ADMIN': 'Quản trị viên'
    };
    return roleLabels[role] || role;
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      'ACTIVE': 'Hoạt động',
      'INACTIVE': 'Không hoạt động',
      'PENDING': 'Chờ duyệt',
      'BANNED': 'Bị cấm'
    };
    return statusLabels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'INACTIVE': 'bg-gray-100 text-gray-800',
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'BANNED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h2>
        <div className="text-sm text-gray-600">
          Tổng: {filteredUsers.length} người dùng
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="all">Tất cả vai trò</option>
          <option value="JOB_SEEKER">Ứng viên</option>
          <option value="EMPLOYER">Nhà tuyển dụng</option>
          <option value="ADMIN">Quản trị viên</option>
        </select>

        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="ACTIVE">Hoạt động</option>
          <option value="INACTIVE">Không hoạt động</option>
          <option value="PENDING">Chờ duyệt</option>
          <option value="BANNED">Bị cấm</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người dùng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vai trò
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đăng ký
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lần cuối đăng nhập
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hồ sơ
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.phone}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                    {getStatusLabel(user.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('vi-VN') : 'Chưa đăng nhập'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${user.profileCompleteness}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{user.profileCompleteness}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative">
                    <button
                      onClick={() => setActionDropdown(actionDropdown === user.id ? null : user.id)}
                      className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                    >
                      <MoreVertical size={16} />
                    </button>
                    
                    {actionDropdown === user.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                            setActionDropdown(null);
                          }}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <Eye size={16} className="mr-2" />
                          Xem chi tiết
                        </button>
                        
                        <button
                          onClick={() => sendEmail(user.email)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <Mail size={16} className="mr-2" />
                          Gửi email
                        </button>
                        
                        {user.status === 'ACTIVE' ? (
                          <button
                            onClick={() => handleStatusChange(user.id, 'INACTIVE')}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <UserX size={16} className="mr-2" />
                            Vô hiệu hóa
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(user.id, 'ACTIVE')}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <UserCheck size={16} className="mr-2" />
                            Kích hoạt
                          </button>
                        )}
                        
                        <div className="border-t border-gray-100"></div>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Xóa người dùng
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Hiển thị {indexOfFirstUser + 1} - {Math.min(indexOfLastUser, filteredUsers.length)} của {filteredUsers.length} kết quả
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Trước
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 border rounded-md ${
                  currentPage === index + 1
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Chi tiết người dùng</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên:</label>
                <p className="text-gray-900">{selectedUser.fullName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                <p className="text-gray-900">{selectedUser.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại:</label>
                <p className="text-gray-900">{selectedUser.phone}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò:</label>
                <p className="text-gray-900">{getRoleLabel(selectedUser.role)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái:</label>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedUser.status)}`}>
                  {getStatusLabel(selectedUser.status)}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày đăng ký:</label>
                <p className="text-gray-900">{new Date(selectedUser.createdAt).toLocaleDateString('vi-VN')}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lần cuối đăng nhập:</label>
                <p className="text-gray-900">
                  {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString('vi-VN') : 'Chưa đăng nhập'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Độ hoàn thiện hồ sơ:</label>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${selectedUser.profileCompleteness}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{selectedUser.profileCompleteness}%</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Đóng
              </button>
              <button
                onClick={() => sendEmail(selectedUser.email)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Gửi email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
