import React, { useState, useEffect } from 'react';
import { Activity, Clock, AlertCircle, CheckCircle, User, Briefcase, Building, FileText } from 'lucide-react';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, users, jobs, applications, system

  // Mock data for recent activities
  const mockActivities = [
    {
      id: 1,
      type: 'user_registration',
      message: 'Người dùng mới Nguyễn Văn An đã đăng ký tài khoản',
      details: 'Email: an.nguyen@email.com, Vai trò: Ứng viên',
      timestamp: '2024-01-21T10:30:00Z',
      icon: User,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 2,
      type: 'job_posted',
      message: 'Công ty TechCorp đã đăng tin tuyển dụng mới',
      details: 'Vị trí: Senior Frontend Developer - Hà Nội',
      timestamp: '2024-01-21T09:45:00Z',
      icon: Briefcase,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 3,
      type: 'job_approval',
      message: 'Tin tuyển dụng "Marketing Manager" đã được duyệt',
      details: 'Công ty: Global Marketing Solutions',
      timestamp: '2024-01-21T09:15:00Z',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 4,
      type: 'application_submitted',
      message: 'Có 5 đơn ứng tuyển mới cho vị trí Data Analyst',
      details: 'Công ty: Analytics Pro - Đà Nẵng',
      timestamp: '2024-01-21T08:30:00Z',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: 5,
      type: 'company_registration',
      message: 'Công ty Creative Studio đã đăng ký tài khoản nhà tuyển dụng',
      details: 'Trạng thái: Chờ xác minh',
      timestamp: '2024-01-21T08:00:00Z',
      icon: Building,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      id: 6,
      type: 'job_rejected',
      message: 'Tin tuyển dụng "Sales Executive" đã bị từ chối',
      details: 'Lý do: Thông tin công ty không đầy đủ',
      timestamp: '2024-01-20T17:20:00Z',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      id: 7,
      type: 'user_login',
      message: '150 người dùng đã đăng nhập trong giờ qua',
      details: 'Cao điểm: 10:00 - 11:00 AM',
      timestamp: '2024-01-20T16:00:00Z',
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 8,
      type: 'job_expired',
      message: '3 tin tuyển dụng đã hết hạn',
      details: 'Tự động chuyển sang trạng thái hết hạn',
      timestamp: '2024-01-20T15:30:00Z',
      icon: Clock,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    },
    {
      id: 9,
      type: 'user_profile_update',
      message: 'Trần Thị Bình đã cập nhật hồ sơ công ty',
      details: 'Bổ sung thông tin về quy mô và văn hóa công ty',
      timestamp: '2024-01-20T14:45:00Z',
      icon: User,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 10,
      type: 'job_posted',
      message: 'Có 8 tin tuyển dụng mới được đăng trong ngày',
      details: 'Chờ duyệt: 3, Đã duyệt: 5',
      timestamp: '2024-01-20T14:00:00Z',
      icon: Briefcase,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ];

  useEffect(() => {
    loadActivities();
  }, [filter]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      // const response = await api.get(`/admin/activities?filter=${filter}`);
      // setActivities(response.data);
      
      // Using mock data for now
      setTimeout(() => {
        let filteredActivities = mockActivities;
        
        if (filter !== 'all') {
          filteredActivities = mockActivities.filter(activity => {
            switch (filter) {
              case 'users':
                return ['user_registration', 'user_login', 'user_profile_update'].includes(activity.type);
              case 'jobs':
                return ['job_posted', 'job_approval', 'job_rejected', 'job_expired'].includes(activity.type);
              case 'applications':
                return ['application_submitted'].includes(activity.type);
              case 'companies':
                return ['company_registration'].includes(activity.type);
              default:
                return true;
            }
          });
        }
        
        setActivities(filteredActivities);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading activities:', error);
      setActivities(mockActivities);
      setLoading(false);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
  };

  const getActivityTypeLabel = (type) => {
    const labels = {
      'user_registration': 'Đăng ký người dùng',
      'job_posted': 'Đăng tin tuyển dụng',
      'job_approval': 'Duyệt tin tuyển dụng',
      'job_rejected': 'Từ chối tin tuyển dụng',
      'job_expired': 'Tin hết hạn',
      'application_submitted': 'Ứng tuyển mới',
      'company_registration': 'Đăng ký công ty',
      'user_login': 'Đăng nhập',
      'user_profile_update': 'Cập nhật hồ sơ'
    };
    return labels[type] || type;
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
        <h2 className="text-2xl font-bold text-gray-800">Hoạt động gần đây</h2>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Tất cả hoạt động</option>
          <option value="users">Người dùng</option>
          <option value="jobs">Công việc</option>
          <option value="applications">Ứng tuyển</option>
          <option value="companies">Công ty</option>
        </select>
      </div>

      {/* Activity Timeline */}
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity, index) => {
            const IconComponent = activity.icon;
            return (
              <div key={activity.id} className="flex items-start space-x-4">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div className={`p-2 rounded-full ${activity.bgColor}`}>
                    <IconComponent className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  {index < activities.length - 1 && (
                    <div className="w-px h-8 bg-gray-200 mt-2"></div>
                  )}
                </div>

                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${activity.bgColor} ${activity.color}`}>
                        {getActivityTypeLabel(activity.type)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Clock size={14} className="mr-1" />
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    {activity.details && (
                      <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Không có hoạt động nào cho bộ lọc này.</p>
          </div>
        )}
      </div>

      {/* Load More Button */}
      {activities.length > 0 && (
        <div className="mt-6 text-center">
          <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
            Xem thêm hoạt động
          </button>
        </div>
      )}

      {/* Activity Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tóm tắt hoạt động hôm nay</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">23</div>
            <div className="text-sm text-gray-600">Người dùng mới</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">8</div>
            <div className="text-sm text-gray-600">Tin đăng mới</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">67</div>
            <div className="text-sm text-gray-600">Ứng tuyển mới</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">5</div>
            <div className="text-sm text-gray-600">Công ty mới</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
