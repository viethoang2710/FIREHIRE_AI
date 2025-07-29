package com.example.firehire_ai.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Data
public class CVViewLogRequest {
    @NotNull(message = "CV ID is required")
    private Integer cvId;

    @NotNull(message = "Employer ID is required")
    private Integer employerId;
}
