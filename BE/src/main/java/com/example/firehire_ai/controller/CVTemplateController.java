package com.example.firehire_ai.controller;

import com.example.firehire_ai.dto.request.CVTemplateRequest;
import com.example.firehire_ai.dto.response.ApiResponse;
import com.example.firehire_ai.dto.response.CVTemplateDTO;
import com.example.firehire_ai.service.CVTemplateService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/templates")
@CrossOrigin(origins = "*")
public class CVTemplateController {

    @Autowired
    private CVTemplateService cvTemplateService;

    @PostMapping
    public ResponseEntity<ApiResponse<CVTemplateDTO>> createTemplate(@Valid @RequestBody CVTemplateRequest request) {
        ApiResponse<CVTemplateDTO> response = cvTemplateService.createTemplate(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CVTemplateDTO>>> getAllTemplates() {
        ApiResponse<List<CVTemplateDTO>> response = cvTemplateService.getAllTemplates();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{templateId}")
    public ResponseEntity<ApiResponse<CVTemplateDTO>> getTemplateById(@PathVariable Integer templateId) {
        ApiResponse<CVTemplateDTO> response = cvTemplateService.getTemplateById(templateId);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/creator/{userId}")
    public ResponseEntity<ApiResponse<List<CVTemplateDTO>>> getTemplatesByCreator(@PathVariable Integer userId) {
        ApiResponse<List<CVTemplateDTO>> response = cvTemplateService.getTemplatesByCreator(userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{templateId}")
    public ResponseEntity<ApiResponse<CVTemplateDTO>> updateTemplate(
            @PathVariable Integer templateId,
            @Valid @RequestBody CVTemplateRequest request) {
        ApiResponse<CVTemplateDTO> response = cvTemplateService.updateTemplate(templateId, request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/{templateId}")
    public ResponseEntity<ApiResponse<Void>> deleteTemplate(@PathVariable Integer templateId) {
        ApiResponse<Void> response = cvTemplateService.deleteTemplate(templateId);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}
