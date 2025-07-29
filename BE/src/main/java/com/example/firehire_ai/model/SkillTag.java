package com.example.firehire_ai.model;

// Removed JPA annotations
import lombok.*;
import lombok.Builder;

// Removed @Entity annotation to avoid conflict with entity.SkillTag
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillTag {
    // Removed JPA annotations
    private Integer skillId;

    // Removed JPA annotations
    private String name;
}
