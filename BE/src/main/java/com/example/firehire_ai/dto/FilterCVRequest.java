package com.example.firehire_ai.dto;

import lombok.Data;

@Data
public class FilterCVRequest {
    private Integer jobId;
    private String keywords;
}
