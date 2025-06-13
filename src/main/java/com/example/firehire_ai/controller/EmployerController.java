package com.example.firehire_ai.controller;

import com.example.firehire_ai.dto.EmployerProfileRequest;
import com.example.firehire_ai.dto.JobPostRequest;
import com.example.firehire_ai.service.EmployerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/employers")
public class EmployerController {

    @Autowired
    private EmployerService employerService;

    @PostMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody EmployerProfileRequest request) {
        return employerService.updateProfile(request);
    }

    @PostMapping("/job-postings")
    public ResponseEntity<?> createJobPost(@RequestBody JobPostRequest request) {
        return employerService.createJobPost(request);
    }

    @GetMapping("/job-postings")
    public ResponseEntity<?> listJobs(@RequestParam("employerId") Integer employerId) {
        return employerService.listJobs(employerId);
    }

    @GetMapping("/job-postings/{jobId}/applications")
    public ResponseEntity<?> viewApplications(@PathVariable Integer jobId) {
        return employerService.viewApplications(jobId);
    }
}
