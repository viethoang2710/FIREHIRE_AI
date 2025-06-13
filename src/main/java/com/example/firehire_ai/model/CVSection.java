package com.example.firehire_ai.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CVSection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer sectionId;

    @ManyToOne
    @JoinColumn(name = "cvid")
    private CV cv;

    @Enumerated(EnumType.STRING)
    private SectionType sectionType;

    private String content;
    private Integer displayOrder;

    public enum SectionType {
        PROFILE, EDUCATION, EXPERIENCE, SKILL, PROJECT, LANGUAGE, CERTIFICATION
    }
}
