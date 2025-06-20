import React from 'react';
import { Briefcase, BarChart2, FileText, Users, Lightbulb, BookOpen } from 'lucide-react';

export const popularCategoriesData = [
  { name: 'Công nghệ thông tin', icon: <Briefcase size={24} /> },
  { name: 'Marketing & Truyền thông', icon: <BarChart2 size={24} /> },
  { name: 'Kế toán & Tài chính', icon: <FileText size={24} /> },
  { name: 'Nhân sự & Tuyển dụng', icon: <Users size={24} /> },
  { name: 'Thiết kế & Sáng tạo', icon: <Lightbulb size={24} /> },
  { name: 'Bán hàng & Kinh doanh', icon: <BookOpen size={24} /> },
];

export const featuredJobsData = [
  { id: 1, title: 'Frontend Developer (ReactJS)', company: 'Tech Solutions Inc.', location: 'Hà Nội', salary: 'Thương lượng', logo: 'https://placehold.co/100x100/007bff/ffffff?text=TSI', date: '2 ngày trước', skills: ['React', 'JavaScript', 'CSS'] },
  { id: 2, title: 'Chuyên viên Marketing Online', company: 'Digital Growth Agency', location: 'TP. Hồ Chí Minh', salary: '15-25 triệu', logo: 'https://placehold.co/100x100/28a745/ffffff?text=DGA', date: 'Hôm nay', skills: ['SEO', 'Google Ads', 'Content'] },
  { id: 3, title: 'Kế toán tổng hợp', company: 'Finance Pro Ltd.', location: 'Đà Nẵng', salary: '12-18 triệu', logo: 'https://placehold.co/100x100/ffc107/000000?text=FP', date: '1 tuần trước', skills: ['VAS', 'Báo cáo thuế', 'Excel'] },
  { id: 4, title: 'Chuyên viên Tuyển dụng', company: 'People Connect', location: 'Hà Nội', salary: 'Cạnh tranh', logo: 'https://placehold.co/100x100/dc3545/ffffff?text=PC', date: '3 ngày trước', skills: ['Sourcing', 'Interview', 'Employer Branding'] },
];

export const topCompaniesData = [
  { name: 'Google', logo: 'https://placehold.co/150x80/EA4335/ffffff?text=Google' },
  { name: 'Microsoft', logo: 'https://placehold.co/150x80/00A4EF/ffffff?text=Microsoft' },
  { name: 'Amazon', logo: 'https://placehold.co/150x80/FF9900/000000?text=Amazon' },
  { name: 'Facebook', logo: 'https://placehold.co/150x80/1877F2/ffffff?text=Facebook' },
  { name: 'Netflix', logo: 'https://placehold.co/150x80/E50914/ffffff?text=Netflix' },
];

export const careerAdviceData = [
  { id: 1, title: '5 Mẹo Viết CV Gây Ấn Tượng Mạnh Với Nhà Tuyển Dụng', category: 'Viết CV', image: 'https://placehold.co/300x200/007bff/ffffff?text=CV+Tips' },
  { id: 2, title: 'Kỹ Năng Trả Lời Phỏng Vấn Thông Minh Bạn Cần Biết', category: 'Phỏng vấn', image: 'https://placehold.co/300x200/28a745/ffffff?text=Interview+Skills' },
  { id: 3, title: 'Xu Hướng Thị Trường Lao Động 2025: Ngành Nào Lên Ngôi?', category: 'Xu hướng', image: 'https://placehold.co/300x200/ffc107/000000?text=Trends' },
];