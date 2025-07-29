import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, Users, Briefcase, Building, Eye, UserPlus, 
  FileText, Calendar, DollarSign, Target, Award, Activity
} from 'lucide-react';

const SystemStatistics = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30'); // 7, 30, 90 days
  const [stats, setStats] = useState({
    overview: {
      totalUsers: 0,
      totalJobs: 0,
      totalCompanies: 0,
      totalApplications: 0,
      activeUsers: 0,
      newUsersToday: 0,
      jobsPostedToday: 0,
      applicationsToday: 0
    },
    userGrowth: [],
    jobStatistics: [],
    applicationStats: [],
    topCompanies: [],
    categoryDistribution: [],
    revenueData: []
  });

  // Mock data for demonstration
  const mockStats = {
    overview: {
      totalUsers: 1250,
      totalJobs: 340,
      totalCompanies: 85,
      totalApplications: 2890,
      activeUsers: 892,
      newUsersToday: 23,
      jobsPostedToday: 8,
      applicationsToday: 67
    },
    userGrowth: [
      { date: '2024-01-01', users: 1100, newUsers: 45 },
      { date: '2024-01-02', users: 1125, newUsers: 25 },
      { date: '2024-01-03', users: 1150, newUsers: 35 },
      { date: '2024-01-04', users: 1180, newUsers: 30 },
      { date: '2024-01-05', users: 1200, newUsers: 20 },
      { date: '2024-01-06', users: 1225, newUsers: 25 },
      { date: '2024-01-07', users: 1250, newUsers: 25 }
    ],
    jobStatistics: [
      { month: 'T1', posted: 45, approved: 42, rejected: 3 },
      { month: 'T2', posted: 52, approved: 48, rejected: 4 },
      { month: 'T3', posted: 38, approved: 35, rejected: 3 },
      { month: 'T4', posted: 61, approved: 58, rejected: 3 },
      { month: 'T5', posted: 55, approved: 52, rejected: 3 },
      { month: 'T6', posted: 48, approved: 45, rejected: 3 }
    ],
    applicationStats: [
      { date: '2024-01', applications: 280, interviews: 85, hired: 32 },
      { date: '2024-02', applications: 320, interviews: 95, hired: 38 },
      { date: '2024-03', applications: 290, interviews: 88, hired: 35 },
      { date: '2024-04', applications: 350, interviews: 110, hired: 42 },
      { date: '2024-05', applications: 380, interviews: 125, hired: 48 },
      { date: '2024-06', applications: 420, interviews: 135, hired: 52 }
    ],
    topCompanies: [
      { name: 'FPT Software', jobs: 25, applications: 450, logo: 'https://via.placeholder.com/40' },
      { name: 'Viettel Group', jobs: 18, applications: 320, logo: 'https://via.placeholder.com/40' },
      { name: 'VNG Corporation', jobs: 15, applications: 280, logo: 'https://via.placeholder.com/40' },
      { name: 'Techcombank', jobs: 12, applications: 210, logo: 'https://via.placeholder.com/40' },
      { name: 'Tiki Corporation', jobs: 10, applications: 180, logo: 'https://via.placeholder.com/40' }
    ],
    categoryDistribution: [
      { name: 'Công nghệ thông tin', value: 35, color: '#3B82F6' },
      { name: 'Marketing & Truyền thông', value: 20, color: '#10B981' },
      { name: 'Kế toán & Tài chính', value: 15, color: '#F59E0B' },
      { name: 'Nhân sự & Tuyển dụng', value: 12, color: '#EF4444' },
      { name: 'Thiết kế & Sáng tạo', value: 10, color: '#8B5CF6' },
      { name: 'Khác', value: 8, color: '#6B7280' }
    ],
    revenueData: [
      { month: 'T1', revenue: 15000000, subscriptions: 12, jobPosts: 180 },
      { month: 'T2', revenue: 18000000, subscriptions: 15, jobPosts: 220 },
      { month: 'T3', revenue: 16000000, subscriptions: 13, jobPosts: 195 },
      { month: 'T4', revenue: 22000000, subscriptions: 18, jobPosts: 260 },
      { month: 'T5', revenue: 25000000, subscriptions: 20, jobPosts: 290 },
      { month: 'T6', revenue: 28000000, subscriptions: 23, jobPosts: 320 }
    ]
  };

  useEffect(() => {
    loadStatistics();
  }, [dateRange]);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      // const response = await api.get(`/admin/statistics?range=${dateRange}`);
      // setStats(response.data);
      
      // Using mock data for now
      setTimeout(() => {
        setStats(mockStats);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading statistics:', error);
      setStats(mockStats);
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const calculateGrowthRate = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Date Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Thống kê hệ thống</h2>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="7">7 ngày qua</option>
          <option value="30">30 ngày qua</option>
          <option value="90">90 ngày qua</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.overview.totalUsers)}</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp size={12} className="mr-1" />
                +{stats.overview.newUsersToday} hôm nay
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng công việc</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.overview.totalJobs)}</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp size={12} className="mr-1" />
                +{stats.overview.jobsPostedToday} hôm nay
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <Briefcase className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng công ty</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.overview.totalCompanies)}</p>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <Building size={12} className="mr-1" />
                {stats.overview.activeUsers} đang hoạt động
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Building className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng ứng tuyển</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.overview.totalApplications)}</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp size={12} className="mr-1" />
                +{stats.overview.applicationsToday} hôm nay
              </p>
            </div>
            <div className="p-3 rounded-full bg-orange-100">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tăng trưởng người dùng</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })} />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString('vi-VN')}
                formatter={(value, name) => [formatNumber(value), name === 'users' ? 'Tổng người dùng' : 'Người dùng mới']}
              />
              <Area type="monotone" dataKey="users" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="newUsers" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Job Statistics Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Thống kê công việc</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.jobStatistics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                formatNumber(value), 
                name === 'posted' ? 'Đã đăng' : name === 'approved' ? 'Đã duyệt' : 'Từ chối'
              ]} />
              <Legend />
              <Bar dataKey="posted" fill="#3B82F6" name="Đã đăng" />
              <Bar dataKey="approved" fill="#10B981" name="Đã duyệt" />
              <Bar dataKey="rejected" fill="#EF4444" name="Từ chối" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Flow Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Luồng ứng tuyển</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.applicationStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(value) => value.split('-')[1]} />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => `Tháng ${value.split('-')[1]}/${value.split('-')[0]}`}
                formatter={(value, name) => [
                  formatNumber(value), 
                  name === 'applications' ? 'Ứng tuyển' : name === 'interviews' ? 'Phỏng vấn' : 'Được tuyển'
                ]}
              />
              <Legend />
              <Line type="monotone" dataKey="applications" stroke="#3B82F6" strokeWidth={2} name="Ứng tuyển" />
              <Line type="monotone" dataKey="interviews" stroke="#F59E0B" strokeWidth={2} name="Phỏng vấn" />
              <Line type="monotone" dataKey="hired" stroke="#10B981" strokeWidth={2} name="Được tuyển" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Phân bố theo danh mục</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.categoryDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Tỷ lệ']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Doanh thu và đăng ký</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={stats.revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" orientation="left" tickFormatter={(value) => `${value/1000000}M`} />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip 
              formatter={(value, name) => [
                name === 'revenue' ? formatCurrency(value) : formatNumber(value),
                name === 'revenue' ? 'Doanh thu' : name === 'subscriptions' ? 'Gói đăng ký' : 'Tin đăng'
              ]}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="revenue" fill="#3B82F6" name="Doanh thu" />
            <Bar yAxisId="right" dataKey="subscriptions" fill="#10B981" name="Gói đăng ký" />
            <Bar yAxisId="right" dataKey="jobPosts" fill="#F59E0B" name="Tin đăng" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Companies Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top công ty tuyển dụng</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Công ty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số tin đăng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lượt ứng tuyển
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tỷ lệ chuyển đổi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.topCompanies.map((company, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-full" src={company.logo} alt="" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{company.name}</div>
                        <div className="text-sm text-gray-500">#{index + 1}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(company.jobs)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(company.applications)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(company.applications / company.jobs)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {Math.round(company.applications / company.jobs)} ứng tuyển/tin
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Hoạt động hôm nay</h4>
            <Activity className="h-5 w-5 text-blue-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Người dùng mới:</span>
              <span className="font-semibold text-green-600">+{stats.overview.newUsersToday}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tin đăng mới:</span>
              <span className="font-semibold text-blue-600">+{stats.overview.jobsPostedToday}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Ứng tuyển mới:</span>
              <span className="font-semibold text-purple-600">+{stats.overview.applicationsToday}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Hiệu suất</h4>
            <Target className="h-5 w-5 text-green-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tỷ lệ duyệt tin:</span>
              <span className="font-semibold text-green-600">92%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Người dùng hoạt động:</span>
              <span className="font-semibold text-blue-600">71.4%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tỷ lệ chuyển đổi:</span>
              <span className="font-semibold text-purple-600">3.2%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Thành tích</h4>
            <Award className="h-5 w-5 text-yellow-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Doanh thu tháng:</span>
              <span className="font-semibold text-green-600">{formatCurrency(28000000)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tăng trưởng:</span>
              <span className="font-semibold text-blue-600">+12%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Mục tiêu đạt:</span>
              <span className="font-semibold text-purple-600">85%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatistics;
