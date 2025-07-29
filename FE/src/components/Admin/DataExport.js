import React, { useState } from 'react';
import { Download, FileText, Calendar, Users, Briefcase, BarChart3, Settings } from 'lucide-react';

const DataExport = ({ isOpen, onClose }) => {
  const [exportType, setExportType] = useState('users');
  const [dateRange, setDateRange] = useState('30');
  const [format, setFormat] = useState('csv');
  const [includeFields, setIncludeFields] = useState({
    users: {
      basicInfo: true,
      contactInfo: true,
      activityData: false,
      statisticsData: false
    },
    jobs: {
      basicInfo: true,
      companyInfo: true,
      applicationStats: false,
      performanceData: false
    },
    statistics: {
      overview: true,
      charts: false,
      detailedReports: false
    }
  });
  const [loading, setLoading] = useState(false);

  const exportOptions = [
    { id: 'users', label: 'Dữ liệu người dùng', icon: Users, description: 'Thông tin người dùng, hồ sơ và hoạt động' },
    { id: 'jobs', label: 'Dữ liệu công việc', icon: Briefcase, description: 'Tin tuyển dụng, ứng tuyển và thống kê' },
    { id: 'statistics', label: 'Báo cáo thống kê', icon: BarChart3, description: 'Báo cáo tổng quan và phân tích dữ liệu' },
    { id: 'system', label: 'Dữ liệu hệ thống', icon: Settings, description: 'Log hoạt động và cấu hình hệ thống' }
  ];

  const handleFieldChange = (category, field) => {
    setIncludeFields(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: !prev[category][field]
      }
    }));
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real application, you would make an API call here
      const exportData = {
        type: exportType,
        dateRange,
        format,
        fields: includeFields[exportType],
        timestamp: new Date().toISOString()
      };

      // Create and download file
      const filename = `${exportType}_export_${new Date().toISOString().split('T')[0]}.${format}`;
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Show success notification
      if (window.addNotification) {
        window.addNotification(`Đã xuất dữ liệu ${exportOptions.find(opt => opt.id === exportType)?.label} thành công!`, 'success');
      }
      
      onClose();
    } catch (error) {
      console.error('Export error:', error);
      if (window.addNotification) {
        window.addNotification('Có lỗi xảy ra khi xuất dữ liệu', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderFieldOptions = () => {
    const currentFields = includeFields[exportType];
    if (!currentFields) return null;

    const fieldLabels = {
      users: {
        basicInfo: 'Thông tin cơ bản (Tên, email, vai trò)',
        contactInfo: 'Thông tin liên hệ (Số điện thoại, địa chỉ)',
        activityData: 'Dữ liệu hoạt động (Đăng nhập, ứng tuyển)',
        statisticsData: 'Thống kê chi tiết (Lượt xem, tương tác)'
      },
      jobs: {
        basicInfo: 'Thông tin cơ bản (Tiêu đề, mô tả, yêu cầu)',
        companyInfo: 'Thông tin công ty (Tên, địa chỉ, logo)',
        applicationStats: 'Thống kê ứng tuyển (Số lượng, trạng thái)',
        performanceData: 'Dữ liệu hiệu suất (Lượt xem, tỷ lệ chuyển đổi)'
      },
      statistics: {
        overview: 'Thống kê tổng quan (Số liệu chính)',
        charts: 'Dữ liệu biểu đồ (Tăng trưởng, phân bố)',
        detailedReports: 'Báo cáo chi tiết (Phân tích sâu)'
      }
    };

    return (
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Chọn dữ liệu cần xuất:</h4>
        {Object.entries(currentFields).map(([field, checked]) => (
          <label key={field} className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => handleFieldChange(exportType, field)}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                {fieldLabels[exportType][field]?.split('(')[0]}
              </div>
              <div className="text-xs text-gray-500">
                {fieldLabels[exportType][field]?.match(/\((.*)\)/)?.[1]}
              </div>
            </div>
          </label>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-full">
              <Download className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Xuất dữ liệu</h2>
              <p className="text-sm text-gray-500">Tải xuống dữ liệu hệ thống theo yêu cầu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FileText className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Export Type Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Loại dữ liệu</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exportOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <label
                    key={option.id}
                    className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                      exportType === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value={option.id}
                      checked={exportType === option.id}
                      onChange={(e) => setExportType(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-start space-x-3">
                      <IconComponent className={`h-6 w-6 mt-1 ${
                        exportType === option.id ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <div>
                        <div className="font-medium text-gray-900">{option.label}</div>
                        <div className="text-sm text-gray-500">{option.description}</div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Khoảng thời gian
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7">7 ngày qua</option>
                <option value="30">30 ngày qua</option>
                <option value="90">90 ngày qua</option>
                <option value="365">1 năm qua</option>
                <option value="all">Tất cả thời gian</option>
              </select>
            </div>

            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4 inline mr-1" />
                Định dạng file
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="csv">CSV (Excel)</option>
                <option value="json">JSON</option>
                <option value="xlsx">Excel (.xlsx)</option>
                <option value="pdf">PDF Report</option>
              </select>
            </div>
          </div>

          {/* Field Selection */}
          <div className="border border-gray-200 rounded-lg p-4">
            {renderFieldOptions()}
          </div>

          {/* Preview Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Thông tin xuất dữ liệu:</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>• Loại: {exportOptions.find(opt => opt.id === exportType)?.label}</div>
              <div>• Thời gian: {dateRange === 'all' ? 'Tất cả' : `${dateRange} ngày qua`}</div>
              <div>• Định dạng: {format.toUpperCase()}</div>
              <div>• Ước tính kích thước: {Math.floor(Math.random() * 50 + 10)}MB</div>
            </div>
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
            onClick={handleExport}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang xuất...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Xuất dữ liệu
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataExport;
