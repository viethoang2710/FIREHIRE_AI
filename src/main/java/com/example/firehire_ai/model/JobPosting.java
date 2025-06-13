package com.example.firehire_ai.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobPosting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer jobId;

    @ManyToOne
    @JoinColumn(name = "employerId")
    private Employer employer;

    private String title;
    private String description;
    private String location;
    private LocalDateTime createdAt = LocalDateTime.now();
}
