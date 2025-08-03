// src/components/UI/ApplyJobModal.js
import React, { useState, useContext } from 'react';
import { X, Upload, FileText, Briefcase, Send } from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';
import applicationService from '../../services/applicationService';

const ApplyJobModal = ({ isOpen, onClose, job, showAlert }) => {
  const { currentUser } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!allowedTypes.includes(file.type)) {
      showAlert('Chỉ chấp nhận file PDF, DOC hoặc DOCX', 'error');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showAlert('File CV quá lớn. Vui lòng chọn file nhỏ hơn 5MB', 'error');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      showAlert('Vui lòng đăng nhập để nộp CV', 'warning');
      return;
    }

    if (!selectedFile) {
      showAlert('Vui lòng chọn file CV để nộp', 'warning');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await applicationService.applyWithCV(
        job.id,
        currentUser.id,
        selectedFile,
        coverLetter
      );

      if (response.success) {
        showAlert('Nộp CV thành công! Nhà tuyển dụng sẽ xem xét và liên hệ với bạn sớm nhất.', 'success');
        onClose();
        // Reset form
        setSelectedFile(null);
        setCoverLetter('');
      } else {
        showAlert(response.message || 'Có lỗi xảy ra khi nộp CV', 'error');
      }
    } catch (error) {
      console.error('Apply error:', error);
      showAlert(error.message || 'Có lỗi xảy ra khi nộp CV', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setSelectedFile(null);
      setCoverLetter('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Briefcase className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Nộp CV ứng tuyển</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Job Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">{job?.title}</h3>
            <p className="text-blue-600 text-sm">{job?.companyName || job?.company}</p>
            <p className="text-blue-500 text-sm">{job?.location} • {job?.salary}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File CV <span className="text-red-500">*</span>
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-400 bg-blue-50' 
                    : selectedFile 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="cv-file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="cv-file" className="cursor-pointer">
                  {selectedFile ? (
                    <div className="flex items-center justify-center space-x-2">
                      <FileText className="h-8 w-8 text-green-500" />
                      <div>
                        <p className="text-green-700 font-medium">{selectedFile.name}</p>
                        <p className="text-green-600 text-sm">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-1">Kéo thả file CV hoặc click để chọn</p>
                      <p className="text-gray-400 text-sm">PDF, DOC, DOCX (Tối đa 5MB)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Cover Letter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thư giới thiệu (Không bắt buộc)
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Viết vài dòng giới thiệu về bản thân và lý do muốn ứng tuyển vào vị trí này..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedFile}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Đang gửi...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Nộp CV</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyJobModal;
