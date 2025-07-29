package com.example.firehire_ai.controller;

import com.example.firehire_ai.dto.request.CVViewLogRequest;
import com.example.firehire_ai.dto.response.ApiResponse;
import com.example.firehire_ai.dto.response.CVViewLogDTO;
import com.example.firehire_ai.service.CVViewLogService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cv-views")
@CrossOrigin(origins = "*")
public class CVViewLogController {

    @Autowired
    private CVViewLogService cvViewLogService;

    @PostMapping
    public ResponseEntity<ApiResponse<CVViewLogDTO>> logCVView(@Valid @RequestBody CVViewLogRequest request) {
        ApiResponse<CVViewLogDTO> response = cvViewLogService.logCVView(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/cv/{cvId}")
    public ResponseEntity<ApiResponse<List<CVViewLogDTO>>> getCVViewLogsByCV(@PathVariable Integer cvId) {
        ApiResponse<List<CVViewLogDTO>> response = cvViewLogService.getCVViewLogsByCV(cvId);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/employer/{employerId}")
    public ResponseEntity<ApiResponse<List<CVViewLogDTO>>> getCVViewLogsByEmployer(@PathVariable Integer employerId) {
        ApiResponse<List<CVViewLogDTO>> response = cvViewLogService.getCVViewLogsByEmployer(employerId);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}
