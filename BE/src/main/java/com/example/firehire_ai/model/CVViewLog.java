package com.example.firehire_ai.model;

import com.example.firehire_ai.entity.CV;
import com.example.firehire_ai.entity.Employer;
// JPA annotations removed
import lombok.*;

import java.time.LocalDateTime;

// Removed @Entity to avoid conflict with entity.CVViewLog
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CVViewLog {
    // Removed JPA annotations
    private Integer logId;

    // Removed JPA annotations
    private Employer employer;

    // Removed JPA annotations
    private CV cvId;

    private LocalDateTime viewedAt = LocalDateTime.now();
}
