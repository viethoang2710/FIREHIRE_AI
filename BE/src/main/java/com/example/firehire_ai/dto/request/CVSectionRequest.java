package com.example.firehire_ai.dto.request;

import lombok.Data;

@Data
public class CVSectionRequest {
    private Integer cvId;
    private String sectionType;
    private String content;
    private Integer displayOrder;
}
