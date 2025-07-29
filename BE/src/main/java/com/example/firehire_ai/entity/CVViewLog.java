package com.example.firehire_ai.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "CV_View_Log")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CVViewLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LogID")
    private Integer logId;

    @ManyToOne
    @JoinColumn(name = "EmployerID")
    private Employer employer;

    @ManyToOne
    @JoinColumn(name = "CVID")
    private CV cv;

    @Column(name = "ViewedAt")
    @Builder.Default
    private LocalDateTime viewedAt = LocalDateTime.now();
}
