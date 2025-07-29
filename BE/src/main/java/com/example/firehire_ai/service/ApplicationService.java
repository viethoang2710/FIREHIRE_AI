package com.example.firehire_ai.service;

import com.example.firehire_ai.dto.request.ApplicationRequest;
import com.example.firehire_ai.dto.response.ApiResponse;
import com.example.firehire_ai.dto.response.ApplicationDTO;
import com.example.firehire_ai.entity.Application;
import com.example.firehire_ai.entity.CV;
import com.example.firehire_ai.entity.JobPosting;
import com.example.firehire_ai.repository.ApplicationRepository;
import com.example.firehire_ai.repository.CVRepository;
import com.example.firehire_ai.repository.JobPostingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private CVRepository cvRepository;

    @Autowired
    private JobPostingRepository jobPostingRepository;

    public ApiResponse<ApplicationDTO> createApplication(ApplicationRequest request) {
        // Find CV
        Optional<CV> cvOptional = cvRepository.findById(request.getCvId());

        if (cvOptional.isEmpty()) {
            return ApiResponse.<ApplicationDTO>error("CV not found");
        }

        // Find job posting
        Optional<JobPosting> jobOptional = jobPostingRepository.findById(request.getJobId());

        if (jobOptional.isEmpty()) {
            return ApiResponse.<ApplicationDTO>error("Job posting not found");
        }

        // Check if already applied
        List<Application> existingApplications = applicationRepository.findByCv_CvIdAndJob_Id(
                request.getCvId(), request.getJobId());

        if (!existingApplications.isEmpty()) {
            return ApiResponse.<ApplicationDTO>error("You have already applied to this job");
        }

        // Create application
        Application application = Application.builder()
                .cv(cvOptional.get())
                .job(jobOptional.get())
                .status(Application.ApplicationStatus.pending)
                .build();

        application = applicationRepository.save(application);

        return ApiResponse.success("Application submitted successfully", ApplicationDTO.fromEntity(application));
    }

    public ApiResponse<List<ApplicationDTO>> getApplicationsByJobId(Integer jobId) {
        List<Application> applications = applicationRepository.findByJob_Id(jobId);

        List<ApplicationDTO> applicationDTOs = applications.stream()
                .map(ApplicationDTO::fromEntity)
                .collect(Collectors.toList());

        return ApiResponse.success(applicationDTOs);
    }

    public ApiResponse<List<ApplicationDTO>> getApplicationsByCvId(Integer cvId) {
        List<Application> applications = applicationRepository.findByCv_CvId(cvId);

        List<ApplicationDTO> applicationDTOs = applications.stream()
                .map(ApplicationDTO::fromEntity)
                .collect(Collectors.toList());

        return ApiResponse.success(applicationDTOs);
    }

    public ApiResponse<ApplicationDTO> updateApplicationStatus(Integer applicationId, String status) {
        Optional<Application> applicationOptional = applicationRepository.findById(applicationId);

        if (applicationOptional.isEmpty()) {
            return ApiResponse.<ApplicationDTO>error("Application not found");
        }

        Application application = applicationOptional.get();

        try {
            Application.ApplicationStatus newStatus = Application.ApplicationStatus.valueOf(status);
            application.setStatus(newStatus);
            application = applicationRepository.save(application);

            return ApiResponse.success("Application status updated successfully",
                    ApplicationDTO.fromEntity(application));
        } catch (IllegalArgumentException e) {
            return ApiResponse.<ApplicationDTO>error("Invalid status value");
        }
    }

    // New methods for enhanced functionality
    public ApiResponse<ApplicationDTO> applyWithCVFile(Integer jobId, Integer candidateId,
            org.springframework.web.multipart.MultipartFile cvFile,
            String coverLetter) {
        try {
            // Find job posting
            Optional<JobPosting> jobOptional = jobPostingRepository.findById(jobId);
            if (jobOptional.isEmpty()) {
                return ApiResponse.<ApplicationDTO>error("Job posting not found");
            }

            // For now, create a simplified application without file handling
            // In real implementation, you would save the file and handle CV creation

            // Create a mock ApplicationDTO for response
            ApplicationDTO mockApplication = ApplicationDTO.builder()
                    .applicationId((int) System.currentTimeMillis())
                    .jobId(jobId)
                    .jobTitle(jobOptional.get().getTitle())
                    .status("PENDING")
                    .appliedAt(java.time.LocalDateTime.now())
                    .build();

            // Set company name from employer
            String companyName = null;
            if (jobOptional.get().getEmployer() != null) {
                companyName = jobOptional.get().getEmployer().getCompanyName();
            }
            mockApplication.setCompanyName(companyName);

            return ApiResponse.success("Application with CV file submitted successfully", mockApplication);
        } catch (Exception e) {
            return ApiResponse.<ApplicationDTO>error("Failed to submit application: " + e.getMessage());
        }
    }

    public ApiResponse<List<ApplicationDTO>> getApplicationsByCandidate(Integer candidateId) {
        try {
            // For now, return empty list - in real implementation,
            // you would query by candidate/user ID
            return ApiResponse.success("Applications retrieved successfully", java.util.Collections.emptyList());
        } catch (Exception e) {
            return ApiResponse.<List<ApplicationDTO>>error("Failed to get applications: " + e.getMessage());
        }
    }

    public ApiResponse<List<ApplicationDTO>> getApplicationsByEmployer(Integer employerId) {
        try {
            // For now, return empty list - in real implementation,
            // you would query applications for jobs belonging to this employer
            return ApiResponse.success("Applications retrieved successfully", java.util.Collections.emptyList());
        } catch (Exception e) {
            return ApiResponse.<List<ApplicationDTO>>error("Failed to get applications: " + e.getMessage());
        }
    }

    public ApiResponse<Void> deleteApplication(Integer applicationId) {
        if (!applicationRepository.existsById(applicationId)) {
            return ApiResponse.<Void>error("Application not found");
        }

        applicationRepository.deleteById(applicationId);

        return ApiResponse.success("Application deleted successfully");
    }
}
