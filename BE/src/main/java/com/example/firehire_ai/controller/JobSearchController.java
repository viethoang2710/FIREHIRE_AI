package com.example.firehire_ai.controller;

import com.example.firehire_ai.dto.response.ApiResponse;
import com.example.firehire_ai.dto.response.JobPostingDTO;
import com.example.firehire_ai.service.JobSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/job-search")
@CrossOrigin(origins = "*")
public class JobSearchController {

    @Autowired
    private JobSearchService jobSearchService;

    @GetMapping("/advanced")
    public ResponseEntity<ApiResponse<List<JobPostingDTO>>> advancedJobSearch(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String industry,
            @RequestParam(required = false) String experienceLevel,
            @RequestParam(required = false) String salaryMin,
            @RequestParam(required = false) String salaryMax,
            @RequestParam(required = false) String jobType,
            @RequestParam(required = false) String companySize,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {

        try {
            ApiResponse<List<JobPostingDTO>> response = jobSearchService.advancedSearch(
                    keyword, location, industry, experienceLevel, salaryMin, salaryMax,
                    jobType, companySize, page, size, sortBy, sortDirection);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Lỗi tìm kiếm: " + e.getMessage(), null));
        }
    }

    @GetMapping("/by-location")
    public ResponseEntity<ApiResponse<List<JobPostingDTO>>> searchJobsByLocation(
            @RequestParam String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        try {
            ApiResponse<List<JobPostingDTO>> response = jobSearchService.searchByLocation(location, page, size);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Lỗi tìm kiếm theo địa điểm: " + e.getMessage(), null));
        }
    }

    @GetMapping("/by-industry")
    public ResponseEntity<ApiResponse<List<JobPostingDTO>>> searchJobsByIndustry(
            @RequestParam String industry,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        try {
            ApiResponse<List<JobPostingDTO>> response = jobSearchService.searchByIndustry(industry, page, size);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Lỗi tìm kiếm theo ngành nghề: " + e.getMessage(), null));
        }
    }

    @GetMapping("/suggestions")
    public ResponseEntity<ApiResponse<List<String>>> getSearchSuggestions(
            @RequestParam String query,
            @RequestParam(defaultValue = "10") int limit) {

        try {
            ApiResponse<List<String>> response = jobSearchService.getSearchSuggestions(query, limit);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Lỗi lấy gợi ý tìm kiếm: " + e.getMessage(), null));
        }
    }

    @GetMapping("/filters/locations")
    public ResponseEntity<ApiResponse<List<String>>> getAllJobLocations() {
        try {
            ApiResponse<List<String>> response = jobSearchService.getAllJobLocations();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Lỗi lấy danh sách địa điểm: " + e.getMessage(), null));
        }
    }

    @GetMapping("/filters/industries")
    public ResponseEntity<ApiResponse<List<String>>> getAllJobIndustries() {
        try {
            ApiResponse<List<String>> response = jobSearchService.getAllJobIndustries();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Lỗi lấy danh sách ngành nghề: " + e.getMessage(), null));
        }
    }

    @GetMapping("/filters/experience-levels")
    public ResponseEntity<ApiResponse<List<String>>> getAllExperienceLevels() {
        try {
            ApiResponse<List<String>> response = jobSearchService.getAllExperienceLevels();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Lỗi lấy danh sách kinh nghiệm: " + e.getMessage(), null));
        }
    }

    @GetMapping("/filters/job-types")
    public ResponseEntity<ApiResponse<List<String>>> getAllJobTypes() {
        try {
            ApiResponse<List<String>> response = jobSearchService.getAllJobTypes();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Lỗi lấy danh sách loại công việc: " + e.getMessage(), null));
        }
    }

    @GetMapping("/popular-keywords")
    public ResponseEntity<ApiResponse<List<String>>> getPopularKeywords(
            @RequestParam(defaultValue = "20") int limit) {
        try {
            ApiResponse<List<String>> response = jobSearchService.getPopularKeywords(limit);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Lỗi lấy từ khóa phổ biến: " + e.getMessage(), null));
        }
    }

    @GetMapping("/recommended")
    public ResponseEntity<ApiResponse<List<JobPostingDTO>>> getRecommendedJobs(
            @RequestParam Integer candidateId,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            ApiResponse<List<JobPostingDTO>> response = jobSearchService.getRecommendedJobs(candidateId, limit);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Lỗi lấy công việc gợi ý: " + e.getMessage(), null));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getJobSearchStats() {
        try {
            ApiResponse<Map<String, Object>> response = jobSearchService.getJobSearchStats();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Lỗi lấy thống kê tìm kiếm: " + e.getMessage(), null));
        }
    }

    @PostMapping("/save-search")
    public ResponseEntity<ApiResponse<String>> saveSearch(
            @RequestParam Integer candidateId,
            @RequestParam String searchQuery,
            @RequestParam String searchFilters) {
        try {
            ApiResponse<String> response = jobSearchService.saveSearch(candidateId, searchQuery, searchFilters);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Lỗi lưu tìm kiếm: " + e.getMessage(), null));
        }
    }

    @GetMapping("/saved-searches/{candidateId}")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getSavedSearches(@PathVariable Integer candidateId) {
        try {
            ApiResponse<List<Map<String, Object>>> response = jobSearchService.getSavedSearches(candidateId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Lỗi lấy tìm kiếm đã lưu: " + e.getMessage(), null));
        }
    }
}
