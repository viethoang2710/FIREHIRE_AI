package com.example.firehire_ai.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "CV_Templates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CVTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TemplateID")
    private Integer templateId;

    @Column(name = "Name", length = 100)
    private String name;

    @Column(name = "Description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "PreviewURL")
    private String previewURL;

    @ManyToOne
    @JoinColumn(name = "CreatedBy")
    private User createdBy;

    @OneToMany(mappedBy = "template", cascade = CascadeType.ALL)
    @Builder.Default
    private List<CV> cvs = new ArrayList<>();
}
