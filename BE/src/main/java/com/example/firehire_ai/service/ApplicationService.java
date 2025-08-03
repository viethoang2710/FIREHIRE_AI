package com.example.firehire_ai.service;

import com.example.firehire_ai.dto.request.ApplicationRequest;
import com.example.firehire_ai.dto.response.ApiResponse;
import com.example.firehire_ai.dto.response.ApplicationDTO;
import com.example.firehire_ai.entity.Application;
import com.example.firehire_ai.entity.CV;
import com.example.firehire_ai.entity.JobPosting;
import com.example.firehire_ai.entity.User;
import com.example.firehire_ai.repository.ApplicationRepository;
import com.example.firehire_ai.repository.CVRepository;
import com.example.firehire_ai.repository.JobPostingRepository;
import com.example.firehire_ai.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
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

    @Autowired
    private UserRepository userRepository;

    public ApiResponse<List<ApplicationDTO>> getAllApplications() {
        try {
            List<Application> applications = applicationRepository.findAll();
            List<ApplicationDTO> applicationDTOs = applications.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return ApiResponse.success(applicationDTOs);
        } catch (Exception e) {
            return ApiResponse.<List<ApplicationDTO>>error("Failed to fetch all applications: " + e.getMessage());
        }
    }

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
            MultipartFile cvFile, String coverLetter) {
        try {
            // Find job posting
            Optional<JobPosting> jobOptional = jobPostingRepository.findById(jobId);
            if (jobOptional.isEmpty()) {
                return ApiResponse.<ApplicationDTO>error("Job posting not found");
            }

            // Find candidate user
            Optional<User> candidateOptional = userRepository.findById(candidateId);
            if (candidateOptional.isEmpty()) {
                return ApiResponse.<ApplicationDTO>error("Candidate not found");
            }

            User candidate = candidateOptional.get();
            JobPosting job = jobOptional.get();

            // Check if candidate already applied to this job
            List<Application> existingApplications = applicationRepository.findByJob_IdAndCv_User_Id(jobId,
                    candidateId);
            if (!existingApplications.isEmpty()) {
                return ApiResponse.<ApplicationDTO>error("You have already applied to this job");
            }

            // Create new CV record with uploaded file data
            CV cv = CV.builder()
                    .user(candidate)
                    .job(job) // Link CV to the job being applied for
                    .title("CV for " + job.getTitle() + " - " + candidate.getFullName())
                    .fileName(cvFile.getOriginalFilename())
                    .fileSize(cvFile.getSize())
                    .fileType(cvFile.getContentType())
                    .coverLetter(coverLetter)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            // Save file data as byte array
            try {
                cv.setFileData(cvFile.getBytes());
            } catch (IOException e) {
                return ApiResponse.<ApplicationDTO>error("Failed to process CV file: " + e.getMessage());
            }

            // Save CV to database
            cv = cvRepository.save(cv);

            // Create application linking CV to job
            Application application = Application.builder()
                    .cv(cv)
                    .job(job)
                    .status(Application.ApplicationStatus.pending)
                    .appliedAt(LocalDateTime.now())
                    .build();

            application = applicationRepository.save(application);

            // Create response DTO
            ApplicationDTO responseDTO = ApplicationDTO.fromEntity(application);

            return ApiResponse.success("Application with CV submitted successfully to database", responseDTO);

        } catch (Exception e) {
            return ApiResponse.<ApplicationDTO>error("Failed to submit application: " + e.getMessage());
        }
    }

    public ApiResponse<List<ApplicationDTO>> getApplicationsByCandidate(Integer candidateId) {
        try {
            // Find all CVs by candidate and get their applications
            List<CV> candidateCVs = cvRepository.findByUser_Id(candidateId);
            List<Application> allApplications = candidateCVs.stream()
                    .flatMap(cv -> applicationRepository.findByCv_CvId(cv.getCvId()).stream())
                    .collect(Collectors.toList());

            List<ApplicationDTO> applicationDTOs = allApplications.stream()
                    .map(ApplicationDTO::fromEntity)
                    .collect(Collectors.toList());

            return ApiResponse.success("Applications retrieved successfully", applicationDTOs);
        } catch (Exception e) {
            return ApiResponse.<List<ApplicationDTO>>error("Failed to get applications: " + e.getMessage());
        }
    }

    public ApiResponse<List<ApplicationDTO>> getApplicationsByEmployer(Integer employerId) {
        try {
            // Find all jobs by employer and get their applications
            List<JobPosting> employerJobs = jobPostingRepository.findByEmployerId(employerId);
            List<Application> allApplications = employerJobs.stream()
                    .flatMap(job -> applicationRepository.findByJob_Id(job.getId()).stream())
                    .collect(Collectors.toList());

            List<ApplicationDTO> applicationDTOs = allApplications.stream()
                    .map(ApplicationDTO::fromEntity)
                    .collect(Collectors.toList());

            return ApiResponse.success("Applications retrieved successfully", applicationDTOs);
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

    public ApiResponse<byte[]> downloadCVFile(Integer cvId) {
        try {
            Optional<CV> cvOptional = cvRepository.findById(cvId);
            if (cvOptional.isEmpty()) {
                return ApiResponse.<byte[]>error("CV not found");
            }

            CV cv = cvOptional.get();
            if (cv.getFileData() == null) {
                return ApiResponse.<byte[]>error("No file data found for this CV");
            }

            return ApiResponse.success("CV file retrieved successfully", cv.getFileData());
        } catch (Exception e) {
            return ApiResponse.<byte[]>error("Failed to download CV file: " + e.getMessage());
        }
    }

    private ApplicationDTO convertToDTO(Application application) {
        ApplicationDTO dto = ApplicationDTO.builder()
                .applicationId(application.getApplicationId())
                .status(application.getStatus().name())
                .appliedAt(application.getAppliedAt())
                .build();

        // Set job information
        if (application.getJob() != null) {
            dto.setJobId(application.getJob().getId());
            dto.setJobTitle(application.getJob().getTitle());

            // Set company name from employer
            if (application.getJob().getEmployer() != null) {
                dto.setCompanyName(application.getJob().getEmployer().getCompanyName());
            }
        }

        // Set CV information
        if (application.getCv() != null) {
            dto.setCvId(application.getCv().getCvId());
            dto.setCvTitle(application.getCv().getTitle());

            // Set candidate information from CV's user
            if (application.getCv().getUser() != null) {
                dto.setCandidateName(application.getCv().getUser().getFullName());
                dto.setCandidateEmail(application.getCv().getUser().getEmail());
                dto.setCandidatePhone(application.getCv().getUser().getPhoneNumber());
            }
        }

        return dto;
    }
}
