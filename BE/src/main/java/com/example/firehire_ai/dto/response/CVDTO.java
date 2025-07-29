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

    public static CVDTO fromEntity(CV cv) {
        if (cv == null)
            return null;

        List<CVSectionDTO> sectionDTOs = cv.getSections().stream()
                .map(CVSectionDTO::fromEntity)
                .collect(Collectors.toList());

        List<String> skillTagNames = cv.getSkillTags().stream()
                .map(skillTag -> skillTag.getSkill().getName())
                .collect(Collectors.toList());

        return CVDTO.builder()
                .cvId(cv.getCvId())
                .userId(cv.getUser().getId())
                .userFullName(cv.getUser().getFullName())
                .templateId(cv.getTemplate().getTemplateId())
                .templateName(cv.getTemplate().getName())
                .title(cv.getTitle())
                .createdAt(cv.getCreatedAt())
                .updatedAt(cv.getUpdatedAt())
                .sections(sectionDTOs)
                .skillTags(skillTagNames)
                .build();
    }
}
