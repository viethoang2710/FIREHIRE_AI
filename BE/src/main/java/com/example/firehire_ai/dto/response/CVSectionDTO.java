package com.example.firehire_ai.dto.response;

import com.example.firehire_ai.model.CVSection;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CVSectionDTO {
    private Integer sectionId;
    private Integer cvId;
    private String sectionType;
    private String content;
    private Integer displayOrder;

    public static CVSectionDTO fromEntity(CVSection section) {
        if (section == null)
            return null;

        return CVSectionDTO.builder()
                .sectionId(section.getSectionId())
                .cvId(section.getCv().getCvId())
                .sectionType(section.getSectionType().name())
                .content(section.getContent())
                .displayOrder(section.getDisplayOrder())
                .build();
    }
}
