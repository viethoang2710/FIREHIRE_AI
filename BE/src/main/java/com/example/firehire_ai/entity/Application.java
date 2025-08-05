package com.example.firehire_ai.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ApplicationID")
    private Integer applicationId;

    @ManyToOne
    @JoinColumn(name = "CVID")
    private CV cv;

    @ManyToOne
    @JoinColumn(name = "JobID")
    private JobPosting job;

    @Column(name = "AppliedAt")
    @Builder.Default
    private LocalDateTime appliedAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "Status")
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.pending;

    public enum ApplicationStatus {
        pending, viewed, interview, rejected, accepted
    }
}
