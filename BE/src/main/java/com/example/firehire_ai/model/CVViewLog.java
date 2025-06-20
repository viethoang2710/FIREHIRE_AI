package com.example.firehire_ai.model;

import com.example.firehire_ai.entity.CV;
import com.example.firehire_ai.entity.Employer;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CVViewLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer logId;

    @ManyToOne
    @JoinColumn(name = "employerId")
    private Employer employer;

    @ManyToOne
    @JoinColumn(name = "cvid")
    private CV cv;

    private LocalDateTime viewedAt = LocalDateTime.now();
}
