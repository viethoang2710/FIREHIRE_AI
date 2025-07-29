package com.example.firehire_ai.controller;

import com.example.firehire_ai.dto.request.ApplicationRequest;
import com.example.firehire_ai.dto.response.ApiResponse;
import com.example.firehire_ai.dto.response.ApplicationDTO;
import com.example.firehire_ai.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<ApiResponse<ApplicationDTO>> createApplication(
            @Valid @RequestBody ApplicationRequest request) {
        ApiResponse<ApplicationDTO> response = applicationService.createApplication(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<ApiResponse<List<ApplicationDTO>>> getApplicationsByJobId(@PathVariable Integer jobId) {
        ApiResponse<List<ApplicationDTO>> response = applicationService.getApplicationsByJobId(jobId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/cv/{cvId}")
    public ResponseEntity<ApiResponse<List<ApplicationDTO>>> getApplicationsByCvId(@PathVariable Integer cvId) {
        ApiResponse<List<ApplicationDTO>> response = applicationService.getApplicationsByCvId(cvId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<ApiResponse<ApplicationDTO>> updateApplicationStatus(
            @PathVariable Integer applicationId,
            @RequestParam String status) {
        ApiResponse<ApplicationDTO> response = applicationService.updateApplicationStatus(applicationId, status);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/apply-with-cv")
    public ResponseEntity<ApiResponse<ApplicationDTO>> applyWithCVFile(
            @RequestParam("jobId") Integer jobId,
            @RequestParam("candidateId") Integer candidateId,
            @RequestParam("cvFile") MultipartFile cvFile,
            @RequestParam(value = "coverLetter", required = false) String coverLetter) {

        // Validate file
        if (cvFile.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Vui lòng chọn file CV", null));
        }

        // Check file type
        String contentType = cvFile.getContentType();
        if (!isValidCVFileType(contentType)) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Chỉ chấp nhận file PDF, DOC hoặc DOCX", null));
        }

        // Check file size (max 5MB)
        if (cvFile.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "File CV quá lớn. Vui lòng chọn file nhỏ hơn 5MB", null));
        }

        try {
            ApiResponse<ApplicationDTO> response = applicationService.applyWithCVFile(jobId, candidateId, cvFile,
                    coverLetter);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Không thể nộp đơn ứng tuyển: " + e.getMessage(), null));
        }
    }

    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<ApiResponse<List<ApplicationDTO>>> getApplicationsByCandidate(
            @PathVariable Integer candidateId) {
        ApiResponse<List<ApplicationDTO>> response = applicationService.getApplicationsByCandidate(candidateId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/employer/{employerId}")
    public ResponseEntity<ApiResponse<List<ApplicationDTO>>> getApplicationsByEmployer(
            @PathVariable Integer employerId) {
        ApiResponse<List<ApplicationDTO>> response = applicationService.getApplicationsByEmployer(employerId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{applicationId}/shortlist")
    public ResponseEntity<ApiResponse<ApplicationDTO>> shortlistApplication(@PathVariable Integer applicationId) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(applicationId, "SHORTLISTED"));
    }

    @PostMapping("/{applicationId}/reject")
    public ResponseEntity<ApiResponse<ApplicationDTO>> rejectApplication(@PathVariable Integer applicationId) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(applicationId, "REJECTED"));
    }

    @PostMapping("/{applicationId}/interview")
    public ResponseEntity<ApiResponse<ApplicationDTO>> scheduleInterview(@PathVariable Integer applicationId) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(applicationId, "INTERVIEW_SCHEDULED"));
    }

    private boolean isValidCVFileType(String contentType) {
        return contentType != null && (contentType.equals("application/pdf") ||
                contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
                contentType.equals("application/msword"));
    }

    @DeleteMapping("/{applicationId}")
    public ResponseEntity<ApiResponse<Void>> deleteApplication(@PathVariable Integer applicationId) {
        ApiResponse<Void> response = applicationService.deleteApplication(applicationId);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}
