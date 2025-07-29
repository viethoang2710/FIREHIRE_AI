package com.example.firehire_ai.dto;

import lombok.Data;

@Data
public class CVUploadRequest {
    private Integer userId;
    private Integer templateId;
    private String title;
    private byte[] pdfData;
}
