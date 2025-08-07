package com.example.firehire_ai.controller;

import com.example.firehire_ai.dto.response.ApiResponse;
import com.example.firehire_ai.dto.response.JobPostingDTO;
import com.example.firehire_ai.service.JobSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "*")
public class ChatbotJobController {

    @Autowired
    private JobSearchService jobSearchService;

    @PostMapping("/search-jobs")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> searchJobsForChatbot(
            @RequestBody Map<String, String> request) {

        String query = request.get("query");
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Query không được để trống", null));
        }

        try {
            // Enhanced query processing for better search results
            String processedQuery = preprocessQuery(query);

            // Tìm kiếm jobs sử dụng enhanced service với processed query
            ApiResponse<List<JobPostingDTO>> searchResult = jobSearchService.advancedSearch(
                    processedQuery, null, null, null, null, null, null, null,
                    0, 20, "createdDate", "DESC"); // Increase limit for better results

            if (searchResult.isSuccess() && searchResult.getData() != null && !searchResult.getData().isEmpty()) {
                List<JobPostingDTO> jobs = searchResult.getData();

                // Format jobs cho chatbot response với enhanced information
                List<Map<String, Object>> jobSuggestions = jobs.stream().map(job -> {
                    Map<String, Object> jobInfo = new HashMap<>();
                    jobInfo.put("id", job.getId());
                    jobInfo.put("title", job.getTitle());
                    jobInfo.put("company", job.getCompanyName() != null ? job.getCompanyName() : "Chưa có thông tin");
                    jobInfo.put("location", job.getLocation() != null ? job.getLocation() : "Chưa có thông tin");
                    jobInfo.put("salary", job.getSalary() != null ? job.getSalary() : "Thỏa thuận");
                    jobInfo.put("jobLink", "http://localhost:3001/jobs/" + job.getId());
                    jobInfo.put("description", truncateDescription(job.getDescription(), 150));
                    jobInfo.put("industry", job.getIndustry());
                    jobInfo.put("jobType", job.getJobType());
                    jobInfo.put("experienceLevel", job.getExperienceLevel());
                    return jobInfo;
                }).collect(Collectors.toList());

                return ResponseEntity.ok(new ApiResponse<>(true,
                        "Tìm thấy " + jobs.size() + " công việc phù hợp với \"" + query + "\"", jobSuggestions));

            } else {
                return ResponseEntity.ok(new ApiResponse<>(false,
                        "Không tìm thấy công việc phù hợp với từ khóa: \"" + query + "\"", List.of()));
            }

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse<>(false, "Có lỗi xảy ra khi tìm kiếm công việc: " + e.getMessage(), null));
        }
    }

    // Enhanced query preprocessing
    private String preprocessQuery(String query) {
        if (query == null || query.trim().isEmpty())
            return "";

        // Normalize và xử lý query
        String processed = query.toLowerCase().trim();

        // Map common Vietnamese terms to English equivalents for better search
        processed = processed
                .replaceAll("lập trình viên|lap trinh vien", "developer")
                .replaceAll("thiết kế|thiet ke", "design")
                .replaceAll("quản lý|quan ly", "manager")
                .replaceAll("bán hàng|ban hang", "sales")
                .replaceAll("tiếp thị|tiep thi", "marketing")
                .replaceAll("nhân sự|nhan su", "hr human resources")
                .replaceAll("phân tích|phan tich", "analyst")
                .replaceAll("tư vấn|tu van", "consultant")
                .replaceAll("kinh doanh|kinh doanh", "business")
                .replaceAll("tài chính|tai chinh", "finance")
                .replaceAll("kế toán|ke toan", "accounting")
                .replaceAll("từ xa|tu xa|remote work|work from home", "remote")
                .replaceAll("bán thời gian|ban thoi gian", "part time")
                .replaceAll("toàn thời gian|toan thoi gian", "full time")
                .replaceAll("thực tập|thuc tap", "intern internship");

        return processed;
    }

    @GetMapping("/suggest-keywords")
    public ResponseEntity<Map<String, Object>> suggestJobKeywords(
            @RequestParam String input,
            @RequestParam(defaultValue = "10") int limit) {

        Map<String, Object> response = new HashMap<>();

        try {
            ApiResponse<List<String>> suggestions = jobSearchService.getSearchSuggestions(input, limit);

            response.put("success", true);
            response.put("keywords", suggestions.getData());
            response.put("message", "Gợi ý từ khóa tìm kiếm");

        } catch (Exception e) {
            response.put("success", false);
            response.put("keywords", List.of());
            response.put("message", "Không thể lấy gợi ý từ khóa");
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/job-categories")
    public ResponseEntity<Map<String, Object>> getJobCategories() {
        Map<String, Object> response = new HashMap<>();

        try {
            ApiResponse<List<String>> industries = jobSearchService.getAllJobIndustries();
            ApiResponse<List<String>> locations = jobSearchService.getAllJobLocations();
            ApiResponse<List<String>> jobTypes = jobSearchService.getAllJobTypes();

            response.put("success", true);
            response.put("industries", industries.getData());
            response.put("locations", locations.getData());
            response.put("jobTypes", jobTypes.getData());
            response.put("message", "Danh sách các danh mục công việc");

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Không thể lấy danh mục công việc");
        }

        return ResponseEntity.ok(response);
    }

    private String truncateDescription(String description, int maxLength) {
        if (description == null)
            return "Không có mô tả";
        if (description.length() <= maxLength)
            return description;
        return description.substring(0, maxLength) + "...";
    }
}
