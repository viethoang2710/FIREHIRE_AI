package com.example.firehire_ai.controller;

import com.example.firehire_ai.dto.request.EmployerProfileRequest;
import com.example.firehire_ai.dto.response.ApiResponse;
import com.example.firehire_ai.dto.response.ApplicationDTO;
import com.example.firehire_ai.dto.response.EmployerDTO;
import com.example.firehire_ai.service.ApplicationService;
import com.example.firehire_ai.service.EmployerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employers")
@CrossOrigin(origins = "*")
public class EmployerController {

    @Autowired
    private EmployerService employerService;

    @Autowired
    private ApplicationService applicationService;

    @PostMapping("/profile")
    public ResponseEntity<ApiResponse<EmployerDTO>> createOrUpdateProfile(
            @Valid @RequestBody EmployerProfileRequest request) {
        ApiResponse<EmployerDTO> response = employerService.createOrUpdateEmployerProfile(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<EmployerDTO>> getEmployerByUserId(@PathVariable Integer userId) {
        ApiResponse<EmployerDTO> response = employerService.getEmployerByUserId(userId);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{employerId}")
    public ResponseEntity<ApiResponse<EmployerDTO>> getEmployerById(@PathVariable Integer employerId) {
        ApiResponse<EmployerDTO> response = employerService.getEmployerById(employerId);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EmployerDTO>>> getAllEmployers() {
        ApiResponse<List<EmployerDTO>> response = employerService.getAllEmployers();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{employerId}")
    public ResponseEntity<ApiResponse<Void>> deleteEmployerProfile(@PathVariable Integer employerId) {
        ApiResponse<Void> response = employerService.deleteEmployerProfile(employerId);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/job/{jobId}/applications")
    public ResponseEntity<ApiResponse<List<ApplicationDTO>>> getApplicationsByJobId(@PathVariable Integer jobId) {
        ApiResponse<List<ApplicationDTO>> response = applicationService.getApplicationsByJobId(jobId);
        return ResponseEntity.ok(response);
    }
}
