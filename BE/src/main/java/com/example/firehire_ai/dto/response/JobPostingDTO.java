package com.example.firehire_ai.dto.response;

import com.example.firehire_ai.entity.JobPosting;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JobPostingDTO {
    private Integer id;
    private Integer jobId; // Keep for backward compatibility
    private Integer employerId;
    private String companyName;
    private String title;
    private String description;
    private String location;
    private String salary;
    private String industry;
    private String experienceLevel;
    private String jobType;
    private String skillsRequired;
    private String benefits;
    private LocalDateTime applicationDeadline;
    private Boolean isUrgent;
    private Integer viewCount;
    private Integer applicationCount;
    private String status;
    private LocalDateTime createdDate;
    private LocalDateTime createdAt; // Keep for backward compatibility
    private LocalDateTime updatedDate;
    private LocalDateTime expiryDate;

    public static JobPostingDTO fromEntity(JobPosting jobPosting) {
        if (jobPosting == null)
            return null;

        String companyName = null;
        // Ưu tiên cột CompanyName mới trong Job_Postings, fallback sang Employer nếu
        // null
        if (jobPosting.getCompanyName() != null && !jobPosting.getCompanyName().isEmpty()) {
            companyName = jobPosting.getCompanyName();
        } else if (jobPosting.getEmployer() != null) {
            companyName = jobPosting.getEmployer().getCompanyName();
        }

        return JobPostingDTO.builder()
                .id(jobPosting.getId())
                .jobId(jobPosting.getId()) // For backward compatibility
                .employerId(jobPosting.getEmployerId())
                .companyName(companyName)
                .title(jobPosting.getTitle())
                .description(jobPosting.getDescription())
                .location(jobPosting.getLocation())
                .salary(jobPosting.getSalary())
                .industry(jobPosting.getIndustry())
                .experienceLevel(jobPosting.getExperienceLevel())
                .jobType(jobPosting.getJobType())
                .skillsRequired(jobPosting.getSkillsRequired())
                .benefits(jobPosting.getBenefits())
                .applicationDeadline(jobPosting.getApplicationDeadline())
                .isUrgent(jobPosting.getIsUrgent())
                .viewCount(jobPosting.getViewCount())
                .applicationCount(jobPosting.getApplicationCount())
                .status(jobPosting.getStatus())
                .createdDate(jobPosting.getCreatedDate())
                .createdAt(jobPosting.getCreatedDate()) // For backward compatibility
                .updatedDate(jobPosting.getUpdatedDate())
                .expiryDate(jobPosting.getExpiryDate())
                .build();
    }
}
