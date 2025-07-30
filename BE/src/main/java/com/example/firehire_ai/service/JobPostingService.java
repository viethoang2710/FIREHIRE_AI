package com.example.firehire_ai.service;

import com.example.firehire_ai.dto.request.JobPostingRequest;
import com.example.firehire_ai.dto.response.ApiResponse;
import com.example.firehire_ai.dto.response.JobPostingDTO;
import com.example.firehire_ai.entity.Employer;
import com.example.firehire_ai.entity.JobPosting;
import com.example.firehire_ai.repository.EmployerRepository;
import com.example.firehire_ai.repository.JobPostingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Objects;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class JobPostingService {

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @Autowired
    private EmployerRepository employerRepository;

    public ApiResponse<JobPostingDTO> createJobPosting(JobPostingRequest request) {
        try {
            // Tìm nhà tuyển dụng
            Optional<Employer> employerOptional = employerRepository.findById(request.getEmployerId());

            if (employerOptional.isEmpty()) {
                return ApiResponse.<JobPostingDTO>error("Không tìm thấy thông tin nhà tuyển dụng");
            }

            Employer employer = employerOptional.get();

            // Tạo tin tuyển dụng mới
            JobPosting jobPosting = JobPosting.builder()
                    .employer(employer)
                    .title(request.getTitle())
                    .description(request.getDescription())
                    .location(request.getLocation())
                    .salary(request.getSalary())
                    .jobType(request.getJobType())
                    .industry(request.getIndustry())
                    .experienceLevel(request.getExperienceLevel())
                    .skillsRequired(request.getSkillsRequired())
                    .benefits(request.getBenefits())
                    .companyName(request.getCompanyName())
                    .status("ACTIVE")
                    .createdDate(LocalDateTime.now())
                    .build();

            // Lưu vào database
            jobPosting = jobPostingRepository.save(jobPosting);

            return ApiResponse.success("Đã tạo tin tuyển dụng thành công", JobPostingDTO.fromEntity(jobPosting));
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi tạo tin tuyển dụng: " + e.getMessage());
        }
    }

    /**
     * Cập nhật tin tuyển dụng
     */
    public ApiResponse<JobPostingDTO> updateJobPosting(Integer jobId, JobPostingRequest request) {
        try {
            // Kiểm tra tin tuyển dụng có tồn tại không
            Optional<JobPosting> jobPostingOptional = jobPostingRepository.findById(jobId);
            if (jobPostingOptional.isEmpty()) {
                return ApiResponse.error("Không tìm thấy tin tuyển dụng");
            }

            JobPosting existingJob = jobPostingOptional.get();

            // Kiểm tra quyền sở hữu (có thể thêm logic phức tạp hơn)
            if (request.getEmployerId() != null
                    && !Objects.equals(existingJob.getEmployerId(), request.getEmployerId())) {
                return ApiResponse.error("Không có quyền sửa tin tuyển dụng này");
            }

            // Cập nhật thông tin
            existingJob.setTitle(request.getTitle() != null ? request.getTitle() : existingJob.getTitle());
            existingJob.setDescription(
                    request.getDescription() != null ? request.getDescription() : existingJob.getDescription());
            existingJob.setLocation(request.getLocation() != null ? request.getLocation() : existingJob.getLocation());
            existingJob.setSalary(request.getSalary() != null ? request.getSalary() : existingJob.getSalary());
            existingJob.setJobType(request.getJobType() != null ? request.getJobType() : existingJob.getJobType());
            existingJob.setIndustry(request.getIndustry() != null ? request.getIndustry() : existingJob.getIndustry());
            existingJob.setExperienceLevel(request.getExperienceLevel() != null ? request.getExperienceLevel()
                    : existingJob.getExperienceLevel());
            existingJob.setSkillsRequired(request.getSkillsRequired() != null ? request.getSkillsRequired()
                    : existingJob.getSkillsRequired());
            existingJob.setBenefits(request.getBenefits() != null ? request.getBenefits() : existingJob.getBenefits());
            existingJob.setCompanyName(
                    request.getCompanyName() != null ? request.getCompanyName() : existingJob.getCompanyName());
            existingJob.setStatus(request.getStatus() != null ? request.getStatus() : existingJob.getStatus());
            existingJob.setUpdatedDate(LocalDateTime.now());

            // Lưu lại vào database
            existingJob = jobPostingRepository.save(existingJob);

            return ApiResponse.success("Cập nhật tin tuyển dụng thành công", JobPostingDTO.fromEntity(existingJob));
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi cập nhật tin tuyển dụng: " + e.getMessage());
        }
    }

    public ApiResponse<List<JobPostingDTO>> getAllJobPostings() {
        List<JobPosting> jobPostings = jobPostingRepository.findAllByOrderByCreatedDateDesc();

        List<JobPostingDTO> jobPostingDTOs = jobPostings.stream()
                .map(JobPostingDTO::fromEntity)
                .collect(Collectors.toList());

        return ApiResponse.success(jobPostingDTOs);
    }

    public ApiResponse<List<JobPostingDTO>> getJobPostingsByEmployer(Integer employerId) {
        List<JobPosting> jobPostings = jobPostingRepository.findByEmployerId(employerId);

        List<JobPostingDTO> jobPostingDTOs = jobPostings.stream()
                .map(JobPostingDTO::fromEntity)
                .collect(Collectors.toList());

        return ApiResponse.success(jobPostingDTOs);
    }

    public ApiResponse<JobPostingDTO> getJobPostingById(Integer jobId) {
        Optional<JobPosting> jobPostingOptional = jobPostingRepository.findById(jobId);

        if (jobPostingOptional.isEmpty()) {
            return ApiResponse.<JobPostingDTO>error("Job posting not found");
        }

        return ApiResponse.success(JobPostingDTO.fromEntity(jobPostingOptional.get()));
    }

    public ApiResponse<List<JobPostingDTO>> searchJobPostings(String keyword) {
        List<JobPosting> jobPostings = jobPostingRepository.searchByTitleOrDescription(keyword);

        List<JobPostingDTO> jobPostingDTOs = jobPostings.stream()
                .map(JobPostingDTO::fromEntity)
                .collect(Collectors.toList());

        return ApiResponse.success(jobPostingDTOs);
    }

    public ApiResponse<List<JobPostingDTO>> getJobPostingsByLocation(String location) {
        List<JobPosting> jobPostings = jobPostingRepository.findByLocationContainingIgnoreCase(location);

        List<JobPostingDTO> jobPostingDTOs = jobPostings.stream()
                .map(JobPostingDTO::fromEntity)
                .collect(Collectors.toList());

        return ApiResponse.success(jobPostingDTOs);
    }

    // New methods for enhanced functionality
    public ApiResponse<List<JobPostingDTO>> getJobPostingsByIndustry(String industry) {
        List<JobPosting> jobPostings = jobPostingRepository.findByIndustryContainingIgnoreCase(industry);

        List<JobPostingDTO> jobPostingDTOs = jobPostings.stream()
                .map(JobPostingDTO::fromEntity)
                .collect(Collectors.toList());

        return ApiResponse.success(jobPostingDTOs);
    }

    public ApiResponse<List<String>> getAllLocations() {
        List<String> locations = jobPostingRepository.findDistinctLocations();
        return ApiResponse.success(locations);
    }

    public ApiResponse<List<String>> getAllIndustries() {
        List<String> industries = jobPostingRepository.findDistinctIndustries();
        return ApiResponse.success(industries);
    }

    public ApiResponse<List<String>> getAllExperienceLevels() {
        List<String> levels = jobPostingRepository.findDistinctExperienceLevels();
        return ApiResponse.success(levels);
    }

    public ApiResponse<List<JobPostingDTO>> getHotJobs(int limit) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(0, limit);
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        List<JobPosting> jobPostings = jobPostingRepository.findHotJobs(weekAgo, pageable);

        List<JobPostingDTO> jobPostingDTOs = jobPostings.stream()
                .map(JobPostingDTO::fromEntity)
                .collect(Collectors.toList());

        return ApiResponse.success(jobPostingDTOs);
    }

    public ApiResponse<List<JobPostingDTO>> getLatestJobs(int limit) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(0, limit);
        List<JobPosting> jobPostings = jobPostingRepository.findLatestJobs(pageable);

        List<JobPostingDTO> jobPostingDTOs = jobPostings.stream()
                .map(JobPostingDTO::fromEntity)
                .collect(Collectors.toList());

        return ApiResponse.success(jobPostingDTOs);
    }

    public ApiResponse<List<JobPostingDTO>> getSimilarJobs(Integer jobId, int limit) {
        Optional<JobPosting> jobOptional = jobPostingRepository.findById(jobId);
        if (jobOptional.isEmpty()) {
            return ApiResponse.<List<JobPostingDTO>>error("Job not found");
        }

        JobPosting job = jobOptional.get();
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(0, limit);
        List<JobPosting> similarJobs = jobPostingRepository.findSimilarJobs(
                jobId, job.getIndustry(), job.getLocation(), pageable);

        List<JobPostingDTO> jobPostingDTOs = similarJobs.stream()
                .map(JobPostingDTO::fromEntity)
                .collect(Collectors.toList());

        return ApiResponse.success(jobPostingDTOs);
    }

    public ApiResponse<String> applyForJob(Integer jobId, Integer candidateId,
            org.springframework.web.multipart.MultipartFile cvFile,
            String coverLetter) {
        try {
            // This is a simplified implementation
            // In real implementation, you would save the file and create application record
            return new ApiResponse<>(true, "Application submitted successfully",
                    "Application ID: " + System.currentTimeMillis());
        } catch (Exception e) {
            return ApiResponse.<String>error("Failed to submit application: " + e.getMessage());
        }
    }

    public ApiResponse<List<JobPostingDTO>> searchJobPostings(String keyword, String location, String industry,
            String experienceLevel, String salaryRange,
            int page, int size) {
        try {
            org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page,
                    size);
            org.springframework.data.domain.Page<JobPosting> jobPage = jobPostingRepository.advancedSearch(
                    keyword, location, industry, experienceLevel, null, pageable);

            List<JobPostingDTO> jobPostingDTOs = jobPage.getContent().stream()
                    .map(JobPostingDTO::fromEntity)
                    .collect(Collectors.toList());

            return ApiResponse.success(jobPostingDTOs);
        } catch (Exception e) {
            return ApiResponse.<List<JobPostingDTO>>error("Search failed: " + e.getMessage());
        }
    }

    public ApiResponse<Void> deleteJobPosting(Integer jobId) {
        if (!jobPostingRepository.existsById(jobId)) {
            return ApiResponse.<Void>error("Job posting not found");
        }

        jobPostingRepository.deleteById(jobId);

        return ApiResponse.success("Job posting deleted successfully");
    }

    // Admin methods
    public List<JobPosting> getAllJobs() {
        return jobPostingRepository.findAll();
    }

    public void updateJobStatus(Integer id, String status, String reason) {
        Optional<JobPosting> jobOpt = jobPostingRepository.findById(id);
        if (jobOpt.isPresent()) {
            JobPosting job = jobOpt.get();
            // TODO: Add status field to JobPosting entity if needed
            // job.setStatus(status);
            // if (reason != null && !reason.isEmpty()) {
            // job.setRejectionReason(reason);
            // }
            jobPostingRepository.save(job);
        } else {
            throw new RuntimeException("Job not found");
        }
    }

    public void deleteJob(Integer id) {
        if (jobPostingRepository.existsById(id)) {
            jobPostingRepository.deleteById(id);
        } else {
            throw new RuntimeException("Job not found");
        }
    }
}
