package com.example.firehire_ai.dto.response;

import com.example.firehire_ai.entity.Application;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApplicationDTO {
    private Integer applicationId;
    private Integer cvId;
    private String cvTitle;
    private Integer jobId;
    private String jobTitle;
    private String companyName;
    private LocalDateTime appliedAt;
    private String status;

    // Candidate information
    private String candidateName;
    private String candidateEmail;
    private String candidatePhone;

    public static ApplicationDTO fromEntity(Application application) {
        if (application == null)
            return null;

        String companyName = null;
        if (application.getJob().getEmployer() != null) {
            companyName = application.getJob().getEmployer().getCompanyName();
        }

        // Get candidate information from CV's user
        String candidateName = null;
        String candidateEmail = null;
        String candidatePhone = null;

        if (application.getCv() != null && application.getCv().getUser() != null) {
            candidateName = application.getCv().getUser().getFullName();
            candidateEmail = application.getCv().getUser().getEmail();
            candidatePhone = application.getCv().getUser().getPhoneNumber();
        }

        return ApplicationDTO.builder()
                .applicationId(application.getApplicationId())
                .cvId(application.getCv().getCvId())
                .cvTitle(application.getCv().getTitle())
                .jobId(application.getJob().getId()) // Updated to use getId()
                .jobTitle(application.getJob().getTitle())
                .companyName(companyName)
                .appliedAt(application.getAppliedAt())
                .status(application.getStatus().name())
                .candidateName(candidateName)
                .candidateEmail(candidateEmail)
                .candidatePhone(candidatePhone)
                .build();
    }
}
