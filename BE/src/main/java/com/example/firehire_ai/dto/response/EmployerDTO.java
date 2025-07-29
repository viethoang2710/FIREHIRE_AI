package com.example.firehire_ai.dto.response;

import com.example.firehire_ai.entity.Employer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployerDTO {
    private Integer employerId;
    private Integer userId;
    private String userFullName;
    private String email;
    private String companyName;
    private String website;
    private String description;

    public static EmployerDTO fromEntity(Employer employer) {
        if (employer == null)
            return null;

        return EmployerDTO.builder()
                .employerId(employer.getEmployerId())
                .userId(employer.getUser().getId())
                .userFullName(employer.getUser().getFullName())
                .email(employer.getUser().getEmail())
                .companyName(employer.getCompanyName())
                .website(employer.getWebsite())
                .description(employer.getDescription())
                .build();
    }
}
