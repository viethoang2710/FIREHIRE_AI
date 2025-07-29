package com.example.firehire_ai.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Data
public class CVSkillTagRequest {
    @NotNull(message = "CV ID is required")
    private Integer cvId;

    @NotNull(message = "Skill ID is required")
    private Integer skillId;
}
