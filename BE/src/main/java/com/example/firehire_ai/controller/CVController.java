package com.example.firehire_ai.controller;

import com.example.firehire_ai.dto.request.CVCreateRequest;
import com.example.firehire_ai.dto.request.CVSectionRequest;
import com.example.firehire_ai.dto.response.ApiResponse;
import com.example.firehire_ai.dto.response.CVDTO;
import com.example.firehire_ai.entity.CV;
import com.example.firehire_ai.service.CVService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cv")
@CrossOrigin(origins = "*")
public class CVController {

    @Autowired
    private CVService cvService;

    @PostMapping
    public ResponseEntity<ApiResponse<CVDTO>> createCV(@Valid @RequestBody CVCreateRequest request) {
        ApiResponse<CVDTO> response = cvService.createCV(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<CVDTO>>> getAllCVs() {
        ApiResponse<List<CVDTO>> response = cvService.getAllCVs();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<CVDTO>>> getMyCVs(@PathVariable Integer userId) {
        ApiResponse<List<CVDTO>> response = cvService.getMyCVs(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<ApiResponse<List<CVDTO>>> getCVsByJobId(@PathVariable Integer jobId) {
        ApiResponse<List<CVDTO>> response = cvService.getCVsByJobId(jobId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{cvId:[0-9]+}")
    public ResponseEntity<ApiResponse<CVDTO>> getCVById(@PathVariable Integer cvId) {
        ApiResponse<CVDTO> response = cvService.getCVById(cvId);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/section")
    public ResponseEntity<ApiResponse<CVDTO>> addSectionToCV(@Valid @RequestBody CVSectionRequest request) {
        ApiResponse<CVDTO> response = cvService.addSectionToCV(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/{cvId:[0-9]+}")
    public ResponseEntity<ApiResponse<Void>> deleteCV(@PathVariable Integer cvId) {
        ApiResponse<Void> response = cvService.deleteCV(cvId);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{cvId:[0-9]+}/download")
    public ResponseEntity<?> downloadCV(@PathVariable Integer cvId,
            @RequestParam(defaultValue = "pdf") String format) {
        try {
            ApiResponse<byte[]> response;

            // If requesting original file, return the uploaded file
            if ("original".equalsIgnoreCase(format)) {
                response = cvService.downloadOriginalCVFile(cvId);
            } else {
                // Otherwise generate PDF/DOCX
                response = cvService.downloadCV(cvId, format);
            }

            if (!response.isSuccess()) {
                return ResponseEntity.badRequest().body(response);
            }

            HttpHeaders headers = new HttpHeaders();
            String fileName;

            if ("original".equalsIgnoreCase(format)) {
                // Get CV info to use original filename
                ApiResponse<CV> cvResponse = cvService.getCVWithFileData(cvId);
                if (cvResponse.isSuccess() && cvResponse.getData().getFileName() != null) {
                    fileName = cvResponse.getData().getFileName();
                } else {
                    fileName = "CV_Original_" + cvId + ".pdf";
                }
                headers.setContentType(MediaType.APPLICATION_PDF);
            } else {
                fileName = "CV_Generated_" + cvId + "." + format.toLowerCase();

                if ("pdf".equalsIgnoreCase(format)) {
                    headers.setContentType(MediaType.APPLICATION_PDF);
                } else if ("docx".equalsIgnoreCase(format)) {
                    headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
                } else {
                    return ResponseEntity.badRequest().body(
                            new ApiResponse<>(false, "Định dạng không được hỗ trợ. Chỉ hỗ trợ PDF và DOCX.", null));
                }
            }

            headers.setContentDispositionFormData("attachment", fileName);
            headers.setContentLength(response.getData().length);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(response.getData());

        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>(false, "Lỗi khi tải xuống CV: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // New endpoint specifically for original file download
    @GetMapping("/{cvId:[0-9]+}/file")
    public ResponseEntity<?> downloadOriginalFile(@PathVariable Integer cvId) {
        try {
            ApiResponse<CV> cvResponse = cvService.getCVWithFileData(cvId);

            if (!cvResponse.isSuccess()) {
                return ResponseEntity.badRequest().body(cvResponse);
            }

            CV cv = cvResponse.getData();
            if (cv.getFileData() == null) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse<>(false, "No original file data found for this CV", null));
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);

            // Use original filename if available, otherwise use default
            String fileName = cv.getFileName();
            if (fileName == null || fileName.isEmpty()) {
                fileName = "CV_Original_" + cvId + ".pdf";
            }

            headers.setContentDispositionFormData("attachment", fileName);
            headers.setContentLength(cv.getFileData().length);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(cv.getFileData());

        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>(false, "Lỗi khi tải xuống CV gốc: " + e.getMessage(),
                    null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/{cvId:[0-9]+}/generate-pdf")
    public ResponseEntity<ApiResponse<String>> generatePDF(@PathVariable Integer cvId) {
        ApiResponse<String> response = cvService.generatePDFUrl(cvId);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PatchMapping("/{cvId:[0-9]+}/status")
    public ResponseEntity<ApiResponse<String>> updateApplicantStatus(
            @PathVariable Integer cvId,
            @RequestParam Integer jobId,
            @RequestParam String status) {
        try {
            ApiResponse<String> response = cvService.updateApplicantStatus(cvId, jobId, status);
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    new ApiResponse<>(false, "Không thể cập nhật trạng thái: " + e.getMessage(), null));
        }
    }
}
