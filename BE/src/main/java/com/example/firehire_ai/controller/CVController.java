package com.example.firehire_ai.controller;

import com.example.firehire_ai.dto.request.CVCreateRequest;
import com.example.firehire_ai.dto.request.CVSectionRequest;
import com.example.firehire_ai.dto.response.ApiResponse;
import com.example.firehire_ai.dto.response.CVDTO;
import com.example.firehire_ai.service.CVService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
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

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<CVDTO>>> getMyCVs(@PathVariable Integer userId) {
        ApiResponse<List<CVDTO>> response = cvService.getMyCVs(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{cvId}")
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

    @DeleteMapping("/{cvId}")
    public ResponseEntity<ApiResponse<Void>> deleteCV(@PathVariable Integer cvId) {
        ApiResponse<Void> response = cvService.deleteCV(cvId);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{cvId}/download")
    public ResponseEntity<?> downloadCV(@PathVariable Integer cvId,
            @RequestParam(defaultValue = "pdf") String format) {
        try {
            ApiResponse<byte[]> response = cvService.downloadCV(cvId, format);

            if (!response.isSuccess()) {
                return ResponseEntity.badRequest().body(response);
            }

            HttpHeaders headers = new HttpHeaders();
            String fileName = "CV_" + cvId + "." + format.toLowerCase();

            if ("pdf".equalsIgnoreCase(format)) {
                headers.setContentType(MediaType.APPLICATION_PDF);
            } else if ("docx".equalsIgnoreCase(format)) {
                headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            } else {
                return ResponseEntity.badRequest().body(
                        new ApiResponse<>(false, "Định dạng không được hỗ trợ. Chỉ hỗ trợ PDF và DOCX.", null));
            }

            headers.setContentDispositionFormData("attachment", fileName);
            headers.setContentLength(response.getData().length);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(new ByteArrayResource(response.getData()));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    new ApiResponse<>(false, "Không thể tải xuống CV: " + e.getMessage(), null));
        }
    }

    @PostMapping("/{cvId}/generate-pdf")
    public ResponseEntity<ApiResponse<String>> generatePDF(@PathVariable Integer cvId) {
        ApiResponse<String> response = cvService.generatePDFUrl(cvId);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}
