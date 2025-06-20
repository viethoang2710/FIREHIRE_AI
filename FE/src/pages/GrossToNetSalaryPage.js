// src/pages/GrossToNetSalaryPage.js
import React, { useState } from 'react';

function GrossToNetSalaryPage({ navigate }) {
  const [grossSalary, setGrossSalary] = useState('');
  const [netSalary, setNetSalary] = useState(null);
  const [personalDeduction, setPersonalDeduction] = useState(11000000); // Mức giảm trừ gia cảnh bản thân
  const [dependentDeduction, setDependentDeduction] = useState(0); // Số người phụ thuộc
  const [taxableIncome, setTaxableIncome] = useState(null);
  const [pitAmount, setPitAmount] = useState(null); // Thuế TNCN
  const [socialInsurance, setSocialInsurance] = useState(null); // Bảo hiểm xã hội, y tế, thất nghiệp

  const SOCIAL_INSURANCE_RATES = {
    BHXH: 0.08, // 8%
    BHYT: 0.015, // 1.5%
    BHTN: 0.01, // 1%
  };
  const MAX_BHXH_SALARY = 36000000; // 20 lần mức lương cơ sở, giả định 1.8tr
  const MAX_BHYT_SALARY = 36000000;
  const MAX_BHTN_SALARY = 20000000; // 20 lần lương tối thiểu vùng I, giả định 1tr

  // Biểu thuế lũy tiến từng phần (cho năm 2024, ví dụ)
  const PIT_TAX_BRACKETS = [
    { upper: 5000000, rate: 0.05, minus: 0 },
    { upper: 10000000, rate: 0.10, minus: 250000 },
    { upper: 18000000, rate: 0.15, minus: 750000 },
    { upper: 32000000, rate: 0.20, minus: 1650000 },
    { upper: 52000000, rate: 0.25, minus: 3250000 },
    { upper: 80000000, rate: 0.30, minus: 5850000 },
    { upper: Infinity, rate: 0.35, minus: 9850000 },
  ];

  const calculateNetSalary = () => {
    const gross = parseFloat(grossSalary);
    if (isNaN(gross) || gross <= 0) {
      setNetSalary(null);
      setTaxableIncome(null);
      setPitAmount(null);
      setSocialInsurance(null);
      return;
    }

    // 1. Tính các khoản bảo hiểm
    const bhxhBase = Math.min(gross, MAX_BHXH_SALARY);
    const bhytBase = Math.min(gross, MAX_BHYT_SALARY);
    const bhtnBase = Math.min(gross, MAX_BHTN_SALARY);

    const bhxh = bhxhBase * SOCIAL_INSURANCE_RATES.BHXH;
    const bhyt = bhytBase * SOCIAL_INSURANCE_RATES.BHYT;
    const bhtn = bhtnBase * SOCIAL_INSURANCE_RATES.BHTN;
    const totalSocialInsurance = bhxh + bhyt + bhtn;
    setSocialInsurance(totalSocialInsurance);

    // 2. Tính thu nhập chịu thuế (Taxable Income)
    const incomeBeforeDeductions = gross - totalSocialInsurance;

    // 3. Tính các khoản giảm trừ
    const totalDeductions = personalDeduction + (dependentDeduction * 4400000); // 4.4 triệu/người phụ thuộc
    const taxableIncomeCalc = Math.max(0, incomeBeforeDeductions - totalDeductions);
    setTaxableIncome(taxableIncomeCalc);

    // 4. Tính thuế thu nhập cá nhân (PIT)
    let pit = 0;
    for (const bracket of PIT_TAX_BRACKETS) {
      if (taxableIncomeCalc <= bracket.upper) {
        pit = taxableIncomeCalc * bracket.rate - bracket.minus;
        break;
      }
    }
    pit = Math.max(0, pit); // Thuế không thể âm
    setPitAmount(pit);

    // 5. Tính lương Net
    const net = gross - totalSocialInsurance - pit;
    setNetSalary(net);
  };

  const formatCurrency = (amount) => {
    if (amount === null || isNaN(amount)) return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Công cụ Tính lương Gross sang Net</h1>
      <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl mx-auto">
        Chính xác tính toán lương thực nhận (Net) từ lương tổng (Gross) của bạn, bao gồm các khoản bảo hiểm và thuế thu nhập cá nhân.
      </p>

      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="mb-6">
          <label htmlFor="grossSalary" className="block text-gray-700 text-sm font-bold mb-2">
            Lương Gross hàng tháng (VND):
          </label>
          <input
            type="number"
            id="grossSalary"
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ví dụ: 15,000,000"
            value={grossSalary}
            onChange={(e) => setGrossSalary(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="dependentDeduction" className="block text-gray-700 text-sm font-bold mb-2">
            Số người phụ thuộc (nếu có):
          </label>
          <input
            type="number"
            id="dependentDeduction"
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ví dụ: 0, 1, 2..."
            value={dependentDeduction}
            onChange={(e) => setDependentDeduction(parseInt(e.target.value) || 0)}
          />
        </div>

        <button
          onClick={calculateNetSalary}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200"
        >
          Tính toán Lương Net
        </button>

        {netSalary !== null && (
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-xl font-bold text-blue-800 mb-4 text-center">Kết quả tính toán</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center py-2 border-b border-blue-100">
                <span className="text-gray-700">Lương Gross:</span>
                <span className="font-semibold text-blue-700">{formatCurrency(parseFloat(grossSalary))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-blue-100">
                <span className="text-gray-700">Tổng Bảo hiểm (BHXH, BHYT, BHTN):</span>
                <span className="font-semibold text-blue-700">{formatCurrency(socialInsurance)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-blue-100">
                <span className="text-gray-700">Giảm trừ gia cảnh (bản thân):</span>
                <span className="font-semibold text-blue-700">{formatCurrency(personalDeduction)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-blue-100">
                <span className="text-gray-700">Giảm trừ người phụ thuộc ({dependentDeduction} người):</span>
                <span className="font-semibold text-blue-700">{formatCurrency(dependentDeduction * 4400000)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-blue-100 col-span-full">
                <span className="text-gray-700 font-bold">Thu nhập chịu thuế:</span>
                <span className="font-bold text-blue-700">{formatCurrency(taxableIncome)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-blue-100 col-span-full">
                <span className="text-gray-700 font-bold">Thuế TNCN phải nộp:</span>
                <span className="font-bold text-red-600">{formatCurrency(pitAmount)}</span>
              </div>
              <div className="flex justify-between items-center py-2 col-span-full">
                <span className="text-gray-800 text-lg font-bold">Lương NET thực nhận:</span>
                <span className="text-blue-800 text-2xl font-extrabold">{formatCurrency(netSalary)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 text-center text-sm text-gray-500">
        <p>*Lưu ý: Công cụ này chỉ mang tính chất tham khảo. Kết quả có thể khác biệt do các yếu tố đặc thù, quy định thay đổi, hoặc chính sách của công ty.</p>
        <p>Giảm trừ gia cảnh cá nhân: 11,000,000 VND/tháng. Giảm trừ người phụ thuộc: 4,400,000 VND/tháng/người.</p>
        <p>Mức đóng BHXH, BHYT, BHTN theo quy định hiện hành.</p>
      </div>
    </div>
  );
}

export default GrossToNetSalaryPage;