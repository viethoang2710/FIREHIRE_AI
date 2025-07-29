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

            cv = cvRepository.save(cv);

            return ApiResponse.success("CV created successfully", CVDTO.fromEntity(cv));
        } catch (Exception e) {
            return ApiResponse.error("CV creation failed: " + e.getMessage());
        }
    }

    public ApiResponse<List<CVDTO>> getMyCVs(Integer userId) {
        try {
            List<CV> cvs = cvRepository.findByUser_Id(userId);
            List<CVDTO> cvDTOs = cvs.stream()
                    .map(CVDTO::fromEntity)
                    .collect(Collectors.toList());

            return ApiResponse.success(cvDTOs);
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve CVs: " + e.getMessage());
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
}
