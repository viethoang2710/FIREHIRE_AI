package com.example.firehire_ai.dto;

import lombok.Data;

@Data
public class JobPostRequest {
    private Integer employerId;
    private String title;
    private String description;
    private String location;
}
