package com.example.firehire_ai.dto.request;

import lombok.Data;

@Data
public class CVCreateRequest {
    private Integer userId;
    private Integer templateId;
    private String title;
}
