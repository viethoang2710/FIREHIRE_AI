package com.example.firehire_ai.model;

import com.example.firehire_ai.entity.CV;
import jakarta.persistence.*;
import lombok.*;
import lombok.Builder;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CVSection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer sectionId;

    @ManyToOne
    @JoinColumn(name = "CVID")
    private CV cv;

    @Enumerated(EnumType.STRING)
    private SectionType sectionType;

    private String content;
    private Integer displayOrder;

    public enum SectionType {
        profile, education, experience, skill, project, language, certification
    }
}
