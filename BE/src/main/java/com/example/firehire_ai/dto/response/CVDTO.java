package com.example.firehire_ai.dto.response;

import com.example.firehire_ai.entity.CV;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CVDTO {
    private Integer cvId;
    private Integer userId;
    private String userFullName;
    private Integer templateId;
    private String templateName;
    private String title;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CVSectionDTO> sections;
    private List<String> skillTags;

    // File information
    private String fileName;
    private Long fileSize;
    private String fileType;
    private String coverLetter;

    // Job information
    private JobPostingDTO job;

    // Candidate information (for employer view)
    private String candidateName;
    private String candidateEmail;
    private String candidatePhone;

    // Application status (for employer view)
    private String status;

    public static CVDTO fromEntity(CV cv) {
        if (cv == null)
            return null;

        List<CVSectionDTO> sectionDTOs = cv.getSections() != null ? cv.getSections().stream()
                .map(CVSectionDTO::fromEntity)
                .collect(Collectors.toList()) : List.of();

        List<String> skillTagNames = cv.getSkillTags() != null ? cv.getSkillTags().stream()
                .map(skillTag -> skillTag.getSkill().getName())
                .collect(Collectors.toList()) : List.of();

        return CVDTO.builder()
                .cvId(cv.getCvId())
                .userId(cv.getUser() != null ? cv.getUser().getId() : null)
                .userFullName(cv.getUser() != null ? cv.getUser().getFullName() : null)
                .templateId(cv.getTemplate() != null ? cv.getTemplate().getTemplateId() : null)
                .templateName(cv.getTemplate() != null ? cv.getTemplate().getName() : null)
                .title(cv.getTitle())
                .createdAt(cv.getCreatedAt())
                .updatedAt(cv.getUpdatedAt())
                .sections(sectionDTOs)
                .skillTags(skillTagNames)
                .fileName(cv.getFileName())
                .fileSize(cv.getFileSize())
                .fileType(cv.getFileType())
                .coverLetter(cv.getCoverLetter())
                .job(cv.getJob() != null ? JobPostingDTO.fromEntity(cv.getJob()) : null)
                .build();
    }
}
