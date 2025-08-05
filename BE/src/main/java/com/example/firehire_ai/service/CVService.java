package com.example.firehire_ai.service;

import com.example.firehire_ai.dto.request.CVCreateRequest;
import com.example.firehire_ai.dto.request.CVSectionRequest;
import com.example.firehire_ai.dto.response.ApiResponse;
import com.example.firehire_ai.dto.response.CVDTO;
import com.example.firehire_ai.entity.CV;
import com.example.firehire_ai.model.CVSection;
import com.example.firehire_ai.entity.User;
import com.example.firehire_ai.repository.CVRepository;
import com.example.firehire_ai.repository.CVTemplateRepository;
import com.example.firehire_ai.repository.UserRepository;
import com.example.firehire_ai.repository.ApplicationRepository;
import com.example.firehire_ai.repository.JobPostingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CVService {
    @Autowired
    private CVRepository cvRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CVTemplateRepository cvTemplateRepository;

    @Autowired
    private com.example.firehire_ai.repository.CVSectionRepository cvSectionRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobPostingRepository jobPostingRepository;

    public ApiResponse<CVDTO> createCV(CVCreateRequest request) {
        try {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            CV cv = CV.builder()
                    .user(user)
                    .title(request.getTitle())
                    .template(cvTemplateRepository.findById(request.getTemplateId())
                            .orElseThrow(() -> new RuntimeException("Template not found")))
                    .build();

            // Lưu CV trước để lấy cvId
            cv = cvRepository.save(cv);

            // Nếu có sections thì lưu các section
            if (request.getSections() != null && !request.getSections().isEmpty()) {
                int order = 0;
                for (com.example.firehire_ai.dto.request.CVSectionRequest sectionReq : request.getSections()) {
                    CVSection section = CVSection.builder()
                            .cv(cv)
                            .sectionType(parseSectionType(sectionReq.getSectionType()))
                            .content(sectionReq.getContent())
                            .displayOrder(sectionReq.getDisplayOrder() != null ? sectionReq.getDisplayOrder() : order++)
                            .build();
                    cv.getSections().add(section);
                }
                cv = cvRepository.save(cv);
            }

            return ApiResponse.success("CV created successfully", CVDTO.fromEntity(cv));
        } catch (Exception e) {
            return ApiResponse.error("CV creation failed: " + e.getMessage());
        }
    }

    // Helper method để parse section type
    private CVSection.SectionType parseSectionType(String type) {
        if (type == null)
            return CVSection.SectionType.profile;
        try {
            return CVSection.SectionType.valueOf(type.toLowerCase());
        } catch (Exception e) {
            return CVSection.SectionType.profile;
        }
    }

    public ApiResponse<List<CVDTO>> getMyCVs(Integer userId) {
        try {
            // Sử dụng query với eager fetch để tránh lazy loading issues
            List<CV> cvs = cvRepository.findByUserIdWithDetails(userId);

            if (cvs.isEmpty()) {
                return ApiResponse.success("No CVs found for user", cvs.stream()
                        .map(CVDTO::fromEntity)
                        .collect(Collectors.toList()));
            }

            List<CVDTO> cvDTOs = cvs.stream()
                    .map(CVDTO::fromEntity)
                    .collect(Collectors.toList());

            return ApiResponse.success("CVs retrieved successfully", cvDTOs);
        } catch (Exception e) {
            e.printStackTrace(); // Log the full stack trace
            return ApiResponse.error("Failed to retrieve CVs: " + e.getMessage());
        }
    }

    public ApiResponse<List<CVDTO>> getCVsByJobId(Integer jobId) {
        try {
            // Lấy tất cả CVs có JobID trùng với jobId được yêu cầu
            List<CV> cvs = cvRepository.findByJob_Id(jobId);

            List<CVDTO> cvDTOs = cvs.stream()
                    .map(cv -> {
                        CVDTO dto = CVDTO.fromEntity(cv);
                        // Thêm thông tin candidate từ user
                        if (cv.getUser() != null) {
                            dto.setCandidateName(cv.getUser().getFullName());
                            dto.setCandidateEmail(cv.getUser().getEmail());
                            dto.setCandidatePhone(cv.getUser().getPhoneNumber());
                        }

                        // Lấy trạng thái từ bảng Applications
                        List<com.example.firehire_ai.entity.Application> applications = applicationRepository
                                .findByCv_CvIdAndJob_Id(cv.getCvId(), jobId);

                        if (!applications.isEmpty()) {
                            // Nếu có application, lấy trạng thái
                            com.example.firehire_ai.entity.Application.ApplicationStatus status = applications.get(0)
                                    .getStatus();
                            dto.setStatus(convertStatusToVietnamese(status));
                        } else {
                            // Mặc định nếu chưa có application
                            dto.setStatus("Mới");
                        }

                        return dto;
                    })
                    .collect(Collectors.toList());

            return ApiResponse.success("CVs for job " + jobId + " retrieved successfully", cvDTOs);
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("Failed to retrieve CVs for job: " + e.getMessage());
        }
    }

    public ApiResponse<CVDTO> getCVById(Integer cvId) {
        try {
            CV cv = cvRepository.findById(cvId)
                    .orElseThrow(() -> new RuntimeException("CV not found"));

            return ApiResponse.success(CVDTO.fromEntity(cv));
        } catch (Exception e) {
            return ApiResponse.error("CV not found: " + e.getMessage());
        }
    }

    public ApiResponse<CVDTO> addSectionToCV(CVSectionRequest request) {
        try {
            CV cv = cvRepository.findById(request.getCvId())
                    .orElseThrow(() -> new RuntimeException("CV not found"));

            CVSection section = CVSection.builder()
                    .cv(cv)
                    .sectionType(CVSection.SectionType.valueOf(request.getSectionType().toLowerCase()))
                    .content(request.getContent())
                    .displayOrder(request.getDisplayOrder())
                    .build();

            cv.addSection(section);
            cv.setUpdatedAt(LocalDateTime.now());
            cv = cvRepository.save(cv);

            return ApiResponse.success("Section added successfully", CVDTO.fromEntity(cv));
        } catch (Exception e) {
            return ApiResponse.error("Failed to add section: " + e.getMessage());
        }
    }

    public ApiResponse<Void> deleteCV(Integer cvId) {
        try {
            if (!cvRepository.existsById(cvId)) {
                return ApiResponse.error("CV not found");
            }

            cvRepository.deleteById(cvId);
            return ApiResponse.success("CV deleted successfully");
        } catch (Exception e) {
            return ApiResponse.error("Failed to delete CV: " + e.getMessage());
        }
    }

    // New methods for CV download functionality
    public ApiResponse<byte[]> downloadCV(Integer cvId, String format) {
        try {
            CV cv = cvRepository.findById(cvId)
                    .orElseThrow(() -> new RuntimeException("CV not found"));

            if ("pdf".equalsIgnoreCase(format)) {
                byte[] pdfBytes = generatePDFFromCV(cv);
                return new ApiResponse<>(true, "PDF generated successfully", pdfBytes);
            } else if ("docx".equalsIgnoreCase(format)) {
                byte[] docxBytes = generateDocxFromCV(cv);
                return new ApiResponse<>(true, "DOCX generated successfully", docxBytes);
            } else {
                return ApiResponse.error("Unsupported format: " + format);
            }
        } catch (Exception e) {
            return ApiResponse.error("Failed to download CV: " + e.getMessage());
        }
    }

    public ApiResponse<String> generatePDFUrl(Integer cvId) {
        try {
            CV cv = cvRepository.findById(cvId)
                    .orElseThrow(() -> new RuntimeException("CV not found"));

            // Generate a temporary URL or file path
            String pdfUrl = "/api/cv/" + cvId + "/download?format=pdf";
            return new ApiResponse<>(true, "PDF URL generated successfully", pdfUrl);
        } catch (Exception e) {
            return ApiResponse.error("Failed to generate PDF URL: " + e.getMessage());
        }
    }

    private byte[] generatePDFFromCV(CV cv) {
        try {
            // Simplified PDF generation
            // In real implementation, use iText or similar library
            String content = "CV: " + cv.getTitle() + "\n" +
                    "Created: " + cv.getCreatedAt() + "\n" +
                    "Sections: " + cv.getSections().size();
            return content.getBytes();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    private byte[] generateDocxFromCV(CV cv) {
        try {
            // Simplified DOCX generation
            // In real implementation, use Apache POI
            String content = "CV: " + cv.getTitle() + "\n" +
                    "Created: " + cv.getCreatedAt() + "\n" +
                    "Sections: " + cv.getSections().size();
            return content.getBytes();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate DOCX", e);
        }
    }

    public ApiResponse<String> updateApplicantStatus(Integer cvId, Integer jobId, String status) {
        try {
            // Tìm Application bằng cvId và jobId
            List<com.example.firehire_ai.entity.Application> applications = applicationRepository
                    .findByCv_CvIdAndJob_Id(cvId, jobId);

            if (applications.isEmpty()) {
                // Nếu chưa có Application, tạo mới
                CV cv = cvRepository.findById(cvId)
                        .orElseThrow(() -> new RuntimeException("CV không tồn tại"));

                com.example.firehire_ai.entity.JobPosting job = jobPostingRepository.findById(jobId)
                        .orElseThrow(() -> new RuntimeException("Job không tồn tại"));

                com.example.firehire_ai.entity.Application newApplication = com.example.firehire_ai.entity.Application
                        .builder()
                        .cv(cv)
                        .job(job)
                        .status(parseStatus(status))
                        .build();

                applicationRepository.save(newApplication);
                return new ApiResponse<>(true, "Đã tạo và cập nhật trạng thái thành công", status);
            } else {
                // Cập nhật trạng thái của Application đầu tiên
                com.example.firehire_ai.entity.Application application = applications.get(0);
                application.setStatus(parseStatus(status));
                applicationRepository.save(application);
                return new ApiResponse<>(true, "Đã cập nhật trạng thái thành công", status);
            }
        } catch (Exception e) {
            return new ApiResponse<>(false, "Lỗi khi cập nhật trạng thái: " + e.getMessage(), null);
        }
    }

    private com.example.firehire_ai.entity.Application.ApplicationStatus parseStatus(String status) {
        switch (status.toLowerCase()) {
            case "mới":
            case "pending":
                return com.example.firehire_ai.entity.Application.ApplicationStatus.pending;
            case "đã xem":
            case "viewed":
                return com.example.firehire_ai.entity.Application.ApplicationStatus.viewed;
            case "phỏng vấn":
            case "interview":
                return com.example.firehire_ai.entity.Application.ApplicationStatus.interview;
            case "từ chối":
            case "rejected":
                return com.example.firehire_ai.entity.Application.ApplicationStatus.rejected;
            case "đã chọn":
            case "accepted":
                return com.example.firehire_ai.entity.Application.ApplicationStatus.accepted;
            default:
                return com.example.firehire_ai.entity.Application.ApplicationStatus.pending;
        }
    }

    private String convertStatusToVietnamese(com.example.firehire_ai.entity.Application.ApplicationStatus status) {
        switch (status) {
            case pending:
                return "Mới";
            case viewed:
                return "Đã xem";
            case interview:
                return "Phỏng vấn";
            case rejected:
                return "Từ chối";
            case accepted:
                return "Đã chọn";
            default:
                return "Mới";
        }
    }
}
