package com.example.firehire_ai.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class CVTemplateRequest {
    @NotBlank(message = "Template name is required")
    @Size(min = 1, max = 100, message = "Template name must be between 1 and 100 characters")
    private String name;

    private String description;

    private String previewURL;

    private Integer createdById;
}
