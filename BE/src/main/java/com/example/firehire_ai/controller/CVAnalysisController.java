package com.example.firehire_ai.controller;

import com.example.firehire_ai.dto.response.ApiResponse;
import com.example.firehire_ai.dto.response.CVAnalysisDTO;
import com.example.firehire_ai.service.CVAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/cv-analysis")
@CrossOrigin(origins = "*")
public class CVAnalysisController {

    @Autowired
    private CVAnalysisService cvAnalysisService;

    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse<CVAnalysisDTO>> analyzeCV(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "targetPosition", required = false) String targetPosition) {

        // Validate file
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Vui lòng tải lên file CV", null));
        }

        // Check file type
        String contentType = file.getContentType();
        if (!isValidFileType(contentType)) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Chỉ chấp nhận file PDF hoặc DOCX", null));
        }

        // Check file size (max 10MB)
        if (file.getSize() > 10 * 1024 * 1024) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "File quá lớn. Vui lòng chọn file nhỏ hơn 10MB", null));
        }

        try {
            ApiResponse<CVAnalysisDTO> response = cvAnalysisService.analyzeCV(file, targetPosition);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    new ApiResponse<>(false, "Có lỗi xảy ra khi phân tích CV: " + e.getMessage(), null));
        }
    }

    @GetMapping("/analysis-history/{userId}")
    public ResponseEntity<ApiResponse<java.util.List<CVAnalysisDTO>>> getAnalysisHistory(
            @PathVariable Integer userId) {
        try {
            ApiResponse<java.util.List<CVAnalysisDTO>> response = cvAnalysisService.getAnalysisHistory(userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    new ApiResponse<>(false, "Không thể lấy lịch sử phân tích CV", null));
        }
    }

    @PostMapping("/analyze-text")
    public ResponseEntity<ApiResponse<CVAnalysisDTO>> analyzeCVFromText(
            @RequestBody String cvText,
            @RequestParam(value = "targetPosition", required = false) String targetPosition) {

        if (cvText == null || cvText.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Nội dung CV không được để trống", null));
        }

        try {
            ApiResponse<CVAnalysisDTO> response = cvAnalysisService.analyzeCVFromText(cvText, targetPosition);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    new ApiResponse<>(false, "Có lỗi xảy ra khi phân tích CV: " + e.getMessage(), null));
        }
    }

    private boolean isValidFileType(String contentType) {
        return contentType != null && (contentType.equals("application/pdf") ||
                contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
                contentType.equals("application/msword"));
    }
}
