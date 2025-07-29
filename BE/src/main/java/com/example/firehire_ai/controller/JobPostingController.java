package com.example.firehire_ai.controller;

import com.example.firehire_ai.dto.request.JobPostingRequest;
import com.example.firehire_ai.dto.response.ApiResponse;
import com.example.firehire_ai.dto.response.JobPostingDTO;
import com.example.firehire_ai.service.JobPostingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:3000")
public class JobPostingController {

    @Autowired
    private JobPostingService jobPostingService;

    @PostMapping
    public ResponseEntity<ApiResponse<JobPostingDTO>> createJobPosting(@RequestBody JobPostingRequest request) {
        return ResponseEntity.ok(jobPostingService.createJobPosting(request));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<JobPostingDTO>>> getAllJobPostings() {
        return ResponseEntity.ok(jobPostingService.getAllJobPostings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobPostingDTO>> getJobPostingById(@PathVariable Integer id) {
        return ResponseEntity.ok(jobPostingService.getJobPostingById(id));
    }

    @GetMapping("/employer/{employerId}")
    public ResponseEntity<ApiResponse<List<JobPostingDTO>>> getJobPostingsByEmployer(@PathVariable Integer employerId) {
        return ResponseEntity.ok(jobPostingService.getJobPostingsByEmployer(employerId));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<JobPostingDTO>>> searchJobPostings(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String industry,
            @RequestParam(required = false) String experienceLevel,
            @RequestParam(required = false) String salaryRange,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(jobPostingService.searchJobPostings(keyword, location, industry, experienceLevel,
                salaryRange, page, size));
    }

    @GetMapping("/location")
    public ResponseEntity<ApiResponse<List<JobPostingDTO>>> getJobPostingsByLocation(@RequestParam String location) {
        return ResponseEntity.ok(jobPostingService.getJobPostingsByLocation(location));
    }

    @GetMapping("/industry")
    public ResponseEntity<ApiResponse<List<JobPostingDTO>>> getJobPostingsByIndustry(@RequestParam String industry) {
        return ResponseEntity.ok(jobPostingService.getJobPostingsByIndustry(industry));
    }

    @GetMapping("/locations")
    public ResponseEntity<ApiResponse<List<String>>> getAllLocations() {
        return ResponseEntity.ok(jobPostingService.getAllLocations());
    }

    @GetMapping("/industries")
    public ResponseEntity<ApiResponse<List<String>>> getAllIndustries() {
        return ResponseEntity.ok(jobPostingService.getAllIndustries());
    }

    @GetMapping("/experience-levels")
    public ResponseEntity<ApiResponse<List<String>>> getAllExperienceLevels() {
        return ResponseEntity.ok(jobPostingService.getAllExperienceLevels());
    }

    @GetMapping("/hot-jobs")
    public ResponseEntity<ApiResponse<List<JobPostingDTO>>> getHotJobs(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(jobPostingService.getHotJobs(limit));
    }

    @GetMapping("/latest-jobs")
    public ResponseEntity<ApiResponse<List<JobPostingDTO>>> getLatestJobs(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(jobPostingService.getLatestJobs(limit));
    }

    @GetMapping("/similar/{jobId}")
    public ResponseEntity<ApiResponse<List<JobPostingDTO>>> getSimilarJobs(
            @PathVariable Integer jobId,
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(jobPostingService.getSimilarJobs(jobId, limit));
    }

    @PostMapping("/{jobId}/apply")
    public ResponseEntity<ApiResponse<String>> applyForJob(
            @PathVariable Integer jobId,
            @RequestParam("cvFile") org.springframework.web.multipart.MultipartFile cvFile,
            @RequestParam("candidateId") Integer candidateId,
            @RequestParam(value = "coverLetter", required = false) String coverLetter) {

        try {
            ApiResponse<String> response = jobPostingService.applyForJob(jobId, candidateId, cvFile, coverLetter);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Không thể nộp đơn ứng tuyển: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteJobPosting(@PathVariable Integer id) {
        return ResponseEntity.ok(jobPostingService.deleteJobPosting(id));
    }
}
