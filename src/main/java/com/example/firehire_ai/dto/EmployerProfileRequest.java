package com.example.firehire_ai.dto;

import lombok.Data;

@Data
public class EmployerProfileRequest {
    private Integer userId;
    private String companyName;
    private String website;
    private String description;
}
