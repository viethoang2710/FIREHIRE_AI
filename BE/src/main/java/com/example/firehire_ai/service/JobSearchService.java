package com.example.firehire_ai.service;

import com.example.firehire_ai.dto.response.ApiResponse;
import com.example.firehire_ai.dto.response.JobPostingDTO;
import com.example.firehire_ai.entity.JobPosting;
import com.example.firehire_ai.repository.JobPostingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class JobSearchService {

    @Autowired
    private JobPostingRepository jobPostingRepository;

    public ApiResponse<List<JobPostingDTO>> advancedSearch(String keyword, String location, String industry,
            String experienceLevel, String salaryMin, String salaryMax,
            String jobType, String companySize, int page, int size,
            String sortBy, String sortDirection) {
        try {
            Sort.Direction direction = Sort.Direction.fromString(sortDirection);
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

            // Get all jobs first
            List<JobPosting> jobs = jobPostingRepository.findAll();

            // Enhanced filtering with better case-insensitive and Unicode support
            List<JobPosting> filteredJobs = jobs.stream()
                    .filter(job -> keyword == null || matchesKeyword(job, keyword))
                    .filter(job -> location == null || matchesLocation(job, location))
                    .filter(job -> industry == null || matchesIndustry(job, industry))
                    .filter(job -> experienceLevel == null || matchesExperienceLevel(job, experienceLevel))
                    .filter(job -> jobType == null || matchesJobType(job, jobType))
                    .collect(Collectors.toList());

            // Convert to DTOs with pagination
            List<JobPostingDTO> jobDTOs = filteredJobs.stream()
                    .skip((long) page * size)
                    .limit(size)
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            return new ApiResponse<>(true, "Tìm kiếm thành công", jobDTOs);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Lỗi tìm kiếm: " + e.getMessage(), null);
        }
    }

    // Enhanced keyword matching with Unicode normalization
    private boolean matchesKeyword(JobPosting job, String keyword) {
        if (keyword == null || keyword.trim().isEmpty())
            return true;

        String normalizedKeyword = normalizeString(keyword);
        String[] keywords = normalizedKeyword.split("\\s+");

        String jobTitle = normalizeString(job.getTitle());
        String jobDescription = normalizeString(job.getDescription() != null ? job.getDescription() : "");
        String companyName = normalizeString(job.getEmployer() != null && job.getEmployer().getCompanyName() != null
                ? job.getEmployer().getCompanyName()
                : "");

        return Arrays.stream(keywords).anyMatch(kw -> jobTitle.contains(kw) ||
                jobDescription.contains(kw) ||
                companyName.contains(kw));
    }

    private boolean matchesLocation(JobPosting job, String location) {
        if (location == null || job.getLocation() == null)
            return true;
        return normalizeString(job.getLocation()).contains(normalizeString(location));
    }

    private boolean matchesIndustry(JobPosting job, String industry) {
        if (industry == null || job.getIndustry() == null)
            return true;
        return normalizeString(job.getIndustry()).contains(normalizeString(industry));
    }

    private boolean matchesExperienceLevel(JobPosting job, String experienceLevel) {
        if (experienceLevel == null || job.getExperienceLevel() == null)
            return true;
        return normalizeString(job.getExperienceLevel()).contains(normalizeString(experienceLevel));
    }

    private boolean matchesJobType(JobPosting job, String jobType) {
        if (jobType == null || job.getJobType() == null)
            return true;
        return normalizeString(job.getJobType()).contains(normalizeString(jobType));
    }

    // Utility method to normalize strings for better matching
    private String normalizeString(String input) {
        if (input == null)
            return "";

        return input.toLowerCase()
                .trim()
                // Normalize Unicode to remove Vietnamese accents
                .replaceAll("à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ", "a")
                .replaceAll("è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ", "e")
                .replaceAll("ì|í|ị|ỉ|ĩ", "i")
                .replaceAll("ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ", "o")
                .replaceAll("ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ", "u")
                .replaceAll("ỳ|ý|ỵ|ỷ|ỹ", "y")
                .replaceAll("đ", "d")
                .replaceAll("À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ", "a")
                .replaceAll("È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ", "e")
                .replaceAll("Ì|Í|Ị|Ỉ|Ĩ", "i")
                .replaceAll("Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ", "o")
                .replaceAll("Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ", "u")
                .replaceAll("Ỳ|Ý|Ỵ|Ỷ|Ỹ", "y")
                .replaceAll("Đ", "d");
    }

    public ApiResponse<List<JobPostingDTO>> searchByLocation(String location, int page, int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<JobPosting> jobPage = jobPostingRepository.findByLocationContainingIgnoreCase(location, pageable);
            List<JobPosting> jobs = jobPage.getContent();

            List<JobPostingDTO> jobDTOs = jobs.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            return new ApiResponse<>(true, "Tìm kiếm theo địa điểm thành công", jobDTOs);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Lỗi tìm kiếm theo địa điểm: " + e.getMessage(), null);
        }
    }

    public ApiResponse<List<JobPostingDTO>> searchByIndustry(String industry, int page, int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<JobPosting> jobPage = jobPostingRepository.findByIndustryContainingIgnoreCase(industry, pageable);
            List<JobPosting> jobs = jobPage.getContent();

            List<JobPostingDTO> jobDTOs = jobs.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            return new ApiResponse<>(true, "Tìm kiếm theo ngành nghề thành công", jobDTOs);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Lỗi tìm kiếm theo ngành nghề: " + e.getMessage(), null);
        }
    }

    public ApiResponse<List<String>> getSearchSuggestions(String query, int limit) {
        try {
            List<JobPosting> jobs = jobPostingRepository.findAll();
            String normalizedQuery = normalizeString(query);

            Set<String> suggestions = jobs.stream()
                    .filter(job -> {
                        String normalizedTitle = normalizeString(job.getTitle());
                        return normalizedTitle.contains(normalizedQuery);
                    })
                    .map(JobPosting::getTitle)
                    .limit(limit)
                    .collect(Collectors.toSet());

            // Also add some common search suggestions based on query
            if (normalizedQuery.contains("java")) {
                suggestions.add("Java Developer");
                suggestions.add("Java Backend Developer");
                suggestions.add("Java Full Stack Developer");
            }
            if (normalizedQuery.contains("react")) {
                suggestions.add("React Developer");
                suggestions.add("React Frontend Developer");
                suggestions.add("React Native Developer");
            }
            if (normalizedQuery.contains("marketing")) {
                suggestions.add("Digital Marketing");
                suggestions.add("Marketing Manager");
                suggestions.add("Content Marketing");
            }

            return new ApiResponse<>(true, "Lấy gợi ý thành công",
                    suggestions.stream().limit(limit).collect(Collectors.toList()));
        } catch (Exception e) {
            return new ApiResponse<>(false, "Lỗi lấy gợi ý: " + e.getMessage(), null);
        }
    }

    public ApiResponse<List<String>> getAllJobLocations() {
        try {
            List<String> locations = jobPostingRepository.findDistinctLocations();
            return new ApiResponse<>(true, "Lấy danh sách địa điểm thành công", locations);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Lỗi lấy danh sách địa điểm: " + e.getMessage(), null);
        }
    }

    public ApiResponse<List<String>> getAllJobIndustries() {
        try {
            List<String> industries = jobPostingRepository.findDistinctIndustries();
            return new ApiResponse<>(true, "Lấy danh sách ngành nghề thành công", industries);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Lỗi lấy danh sách ngành nghề: " + e.getMessage(), null);
        }
    }

    public ApiResponse<List<String>> getAllExperienceLevels() {
        try {
            List<String> experienceLevels = Arrays.asList(
                    "Intern", "Fresher", "Junior", "Mid-level", "Senior", "Lead", "Manager", "Director");
            return new ApiResponse<>(true, "Lấy danh sách kinh nghiệm thành công", experienceLevels);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Lỗi lấy danh sách kinh nghiệm: " + e.getMessage(), null);
        }
    }

    public ApiResponse<List<String>> getAllJobTypes() {
        try {
            List<String> jobTypes = Arrays.asList(
                    "Full-time", "Part-time", "Contract", "Freelance", "Internship", "Remote");
            return new ApiResponse<>(true, "Lấy danh sách loại công việc thành công", jobTypes);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Lỗi lấy danh sách loại công việc: " + e.getMessage(), null);
        }
    }

    public ApiResponse<List<String>> getPopularKeywords(int limit) {
        try {
            // This is a simplified version - in real implementation, you might want to
            // track search frequencies
            List<String> popularKeywords = Arrays.asList(
                    "Java", "Python", "React", "Angular", "Spring Boot", "MySQL", "MongoDB",
                    "Marketing", "Sales", "Project Manager", "Business Analyst", "Data Analyst",
                    "Frontend Developer", "Backend Developer", "Full Stack", "DevOps");

            return new ApiResponse<>(true, "Lấy từ khóa phổ biến thành công",
                    popularKeywords.stream().limit(limit).collect(Collectors.toList()));
        } catch (Exception e) {
            return new ApiResponse<>(false, "Lỗi lấy từ khóa phổ biến: " + e.getMessage(), null);
        }
    }

    public ApiResponse<List<JobPostingDTO>> getRecommendedJobs(Integer candidateId, int limit) {
        try {
            // Simplified recommendation - in real implementation, use ML algorithms
            List<JobPosting> allJobs = jobPostingRepository.findAll();
            Collections.shuffle(allJobs); // Random recommendation for now

            List<JobPostingDTO> recommendedJobs = allJobs.stream()
                    .limit(limit)
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            return new ApiResponse<>(true, "Lấy công việc gợi ý thành công", recommendedJobs);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Lỗi lấy công việc gợi ý: " + e.getMessage(), null);
        }
    }

    public ApiResponse<Map<String, Object>> getJobSearchStats() {
        try {
            long totalJobs = jobPostingRepository.count();
            List<String> topIndustries = jobPostingRepository.findDistinctIndustries().stream()
                    .limit(5)
                    .collect(Collectors.toList());
            List<String> topLocations = jobPostingRepository.findDistinctLocations().stream()
                    .limit(5)
                    .collect(Collectors.toList());

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalJobs", totalJobs);
            stats.put("topIndustries", topIndustries);
            stats.put("topLocations", topLocations);
            stats.put("newJobsThisWeek", Math.min(totalJobs, 50)); // Mock data

            return new ApiResponse<>(true, "Lấy thống kê thành công", stats);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Lỗi lấy thống kê: " + e.getMessage(), null);
        }
    }

    public ApiResponse<String> saveSearch(Integer candidateId, String searchQuery, String searchFilters) {
        try {
            // In real implementation, save to database
            // For now, just return success message
            return new ApiResponse<>(true, "Lưu tìm kiếm thành công", "Search saved successfully");
        } catch (Exception e) {
            return new ApiResponse<>(false, "Lỗi lưu tìm kiếm: " + e.getMessage(), null);
        }
    }

    public ApiResponse<List<Map<String, Object>>> getSavedSearches(Integer candidateId) {
        try {
            // Mock data - in real implementation, get from database
            List<Map<String, Object>> savedSearches = new ArrayList<>();
            Map<String, Object> search1 = new HashMap<>();
            search1.put("id", 1);
            search1.put("query", "Java Developer");
            search1.put("location", "Ho Chi Minh City");
            search1.put("savedDate", "2024-01-01");
            savedSearches.add(search1);

            return new ApiResponse<>(true, "Lấy tìm kiếm đã lưu thành công", savedSearches);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Lỗi lấy tìm kiếm đã lưu: " + e.getMessage(), null);
        }
    }

    private JobPostingDTO convertToDTO(JobPosting jobPosting) {
        JobPostingDTO dto = new JobPostingDTO();
        dto.setId(jobPosting.getId());
        dto.setTitle(jobPosting.getTitle());
        dto.setDescription(jobPosting.getDescription());
        dto.setLocation(jobPosting.getLocation());
        dto.setSalary(jobPosting.getSalary());
        dto.setIndustry(jobPosting.getIndustry());
        dto.setExperienceLevel(jobPosting.getExperienceLevel());
        dto.setJobType(jobPosting.getJobType());

        String companyName = null;
        if (jobPosting.getEmployer() != null) {
            companyName = jobPosting.getEmployer().getCompanyName();
        }
        dto.setCompanyName(companyName);

        dto.setEmployerId(jobPosting.getEmployerId());
        dto.setCreatedDate(jobPosting.getCreatedDate());
        dto.setExpiryDate(jobPosting.getExpiryDate());
        dto.setStatus(jobPosting.getStatus());
        return dto;
    }
}
