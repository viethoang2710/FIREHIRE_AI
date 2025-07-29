package com.example.firehire_ai.dto.request;

import lombok.Data;

/**
 * DTO cho yêu cầu tạo/cập nhật tin tuyển dụng
 */
@Data
public class JobPostingRequest {
    private Integer employerId;
    private String title;
    private String description;
    private String location;
    private String salary;
    private String jobType;
    private String industry;
    private String experienceLevel;
    private String skillsRequired;
    private String benefits;
    private String status;
}
