package com.example.firehire_ai.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class CVCreateRequest {
    private Integer userId;
    private Integer templateId;
    private String title;
    private List<CVSectionRequest> sections;
}
