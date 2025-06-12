// So sánh lương

// src/pages/SalaryComparisonPage.js
import React, { useState } from 'react';
import { DollarSign, BarChart, TrendingUp } from 'lucide-react';

function SalaryComparisonPage({ navigate }) {
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [currentSalary, setCurrentSalary] = useState('');
  const [comparisonResult, setComparisonResult] = useState(null);

  const mockSalaryData = {
    "developer": {
      "hanoi": { "entry": 10000000, "junior": 15000000, "mid": 25000000, "senior": 40000000 },
      "hcm": { "entry": 11000000, "junior": 17000000, "mid": 28000000, "senior": 45000000 },
      "danang": { "entry": 9000000, "junior": 13000000, "mid": 22000000, "senior": 35000000 },
    },
    "marketing specialist": {
      "hanoi": { "entry": 8000000, "junior": 12000000, "mid": 18000000, "senior": 30000000 },
      "hcm": { "entry": 9000000, "junior": 14000000, "mid": 20000000, "senior": 35000000 },
    },
    "accountant": {
      "hanoi": { "entry": 7000000, "junior": 10000000, "mid": 16000000, "senior": 25000000 },
      "hcm": { "entry": 8000000, "junior": 11000000, "mid": 17000000, "senior": 28000000 },
    },
    // Thêm các ngành nghề và địa điểm khác nếu cần
  };

  const handleCompareSalary = (e) => {
    e.preventDefault();
    const cleanJobTitle = jobTitle.toLowerCase().trim();
    const cleanLocation = location.toLowerCase().trim();
    const experienceLevel = experience.toLowerCase().trim();
    const currentSal = parseFloat(currentSalary);

    if (isNaN(currentSal) || currentSal <= 0) {
      setComparisonResult({ error: "Vui lòng nhập mức lương hiện tại hợp lệ." });
      return;
    }

    const jobData = mockSalaryData[cleanJobTitle];
    if (!jobData) {
      setComparisonResult({ error: `Không tìm thấy dữ liệu lương cho ngành nghề "${jobTitle}".` });
      return;
    }

    const locationData = jobData[cleanLocation];
    if (!locationData) {
      setComparisonResult({ error: `Không tìm thấy dữ liệu lương cho địa điểm "${location}" trong ngành "${jobTitle}".` });
      return;
    }

    const benchmarkSalary = locationData[experienceLevel];
    if (!benchmarkSalary) {
      setComparisonResult({ error: `Không tìm thấy dữ liệu lương cho cấp độ kinh nghiệm "${experience}" trong ngành "${jobTitle}" tại "${location}".` });
      return;
    }

    let message = '';
    let status = '';
    let diff = currentSal - benchmarkSalary;

    if (currentSal < benchmarkSalary * 0.9) { // Dưới 90%
      message = `Mức lương của bạn có vẻ thấp hơn mặt bằng chung (${formatCurrency(benchmarkSalary)}). Bạn có thể cân nhắc đàm phán hoặc tìm kiếm cơ hội mới.`;
      status = 'low';
    } else if (currentSal > benchmarkSalary * 1.1) { // Trên 110%
      message = `Mức lương của bạn khá tốt so với mặt bằng chung (${formatCurrency(benchmarkSalary)}). Chúc mừng bạn!`;
      status = 'high';
    } else {
      message = `Mức lương của bạn đang ở mức tương đương mặt bằng chung (${formatCurrency(benchmarkSalary)}).`;
      status = 'average';
    }

    setComparisonResult({
      benchmark: benchmarkSalary,
      current: currentSal,
      message,
      status,
      diff: diff
    });
  };

  const formatCurrency = (amount) => {
    if (amount === null || isNaN(amount)) return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">So sánh Mức Lương</h1>
      <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl mx-auto">
        Nhập thông tin về công việc và mức lương hiện tại của bạn để so sánh với dữ liệu thị trường.
      </p>

      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <form onSubmit={handleCompareSalary}>
          <div className="mb-4">
            <label htmlFor="jobTitle" className="block text-gray-700 text-sm font-bold mb-2">
              Chức danh/Ngành nghề:
            </label>
            <input
              type="text"
              id="jobTitle"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ví dụ: Developer, Marketing Specialist"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">
              Địa điểm làm việc:
            </label>
            <input
              type="text"
              id="location"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ví dụ: Hà Nội, TP.HCM, Đà Nẵng"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="experience" className="block text-gray-700 text-sm font-bold mb-2">
              Cấp độ kinh nghiệm:
            </label>
            <select
              id="experience"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              required
            >
              <option value="">Chọn cấp độ</option>
              <option value="entry">Fresher/Entry-level</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid-level</option>
              <option value="senior">Senior</option>
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="currentSalary" className="block text-gray-700 text-sm font-bold mb-2">
              Lương hiện tại của bạn (VND/tháng - Gross):
            </label>
            <input
              type="number"
              id="currentSalary"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ví dụ: 18,000,000"
              value={currentSalary}
              onChange={(e) => setCurrentSalary(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200"
          >
            So sánh Lương
          </button>
        </form>

        {comparisonResult && (
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            {comparisonResult.error ? (
              <p className="text-red-600 font-semibold text-center">{comparisonResult.error}</p>
            ) : (
              <>
                <h2 className="text-xl font-bold text-blue-800 mb-4 text-center">Kết quả So sánh</h2>
                <div className="flex justify-between items-center py-2 border-b border-blue-100">
                  <span className="text-gray-700">Mức lương hiện tại của bạn:</span>
                  <span className="font-semibold text-blue-700">{formatCurrency(comparisonResult.current)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-100">
                  <span className="text-gray-700">Mức lương trung bình thị trường:</span>
                  <span className="font-semibold text-blue-700">{formatCurrency(comparisonResult.benchmark)}</span>
                </div>
                <div className="mt-4 text-center">
                  <p className={`text-lg font-bold ${
                    comparisonResult.status === 'low' ? 'text-red-600' :
                    comparisonResult.status === 'high' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {comparisonResult.message}
                  </p>
                  {comparisonResult.status !== 'average' && (
                    <p className="text-sm text-gray-500 mt-2">
                      Bạn đang {comparisonResult.diff > 0 ? 'cao hơn' : 'thấp hơn'} mặt bằng chung khoảng {formatCurrency(Math.abs(comparisonResult.diff))}/tháng.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-12 text-center text-sm text-gray-500">
        <p>*Lưu ý: Dữ liệu lương chỉ mang tính chất tham khảo dựa trên thông tin công khai và có thể không phản ánh chính xác 100% thị trường.</p>
        <p>Để có kết quả chính xác hơn, bạn có thể tham khảo thêm từ các báo cáo thị trường hoặc chuyên gia tuyển dụng.</p>
      </div>
    </div>
  );
}

export default SalaryComparisonPage;