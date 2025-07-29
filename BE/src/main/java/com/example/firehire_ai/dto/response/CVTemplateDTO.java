package com.example.firehire_ai.dto.response;

import com.example.firehire_ai.entity.CVTemplate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CVTemplateDTO {
    private Integer templateId;
    private String name;
    private String description;
    private String previewURL;
    private Integer createdById;
    private String createdByName;

    public static CVTemplateDTO fromEntity(CVTemplate template) {
        if (template == null)
            return null;

        return CVTemplateDTO.builder()
                .templateId(template.getTemplateId())
                .name(template.getName())
                .description(template.getDescription())
                .previewURL(template.getPreviewURL())
                .createdById(template.getCreatedBy() != null ? template.getCreatedBy().getId() : null)
                .createdByName(template.getCreatedBy() != null ? template.getCreatedBy().getFullName() : null)
                .build();
    }
}
