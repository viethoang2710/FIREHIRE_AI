package com.example.firehire_ai.entity;

import com.example.firehire_ai.model.CVSection;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "CVs")
public class CV {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CVID")
    private Integer cvId;

    @ManyToOne
    @JoinColumn(name = "UserID")
    private User user;

    @ManyToOne
    @JoinColumn(name = "TemplateID")
    private CVTemplate template;

    @Column(name = "Title", length = 100)
    private String title;

    @Column(name = "CreatedAt")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "UpdatedAt")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "cv", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CVSection> sections = new ArrayList<>();

    @OneToMany(mappedBy = "cv", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<CVSkillTag> skillTags = new HashSet<>();

    @OneToMany(mappedBy = "cv", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Application> applications = new ArrayList<>();

    @OneToMany(mappedBy = "cv", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CVViewLog> viewLogs = new ArrayList<>();

    // Setter methods that update the timestamp
    public void setTitle(String title) {
        this.title = title;
        this.updatedAt = LocalDateTime.now();
    }

    public void setTemplate(CVTemplate template) {
        this.template = template;
        this.updatedAt = LocalDateTime.now();
    }

    public void setUser(User user) {
        this.user = user;
        this.updatedAt = LocalDateTime.now();
    }

    // Helper methods for managing relationships
    public void addSection(CVSection section) {
        sections.add(section);
        section.setCv(this);
        this.updatedAt = LocalDateTime.now();
    }

    public void removeSection(CVSection section) {
        sections.remove(section);
        section.setCv(null);
        this.updatedAt = LocalDateTime.now();
    }

    public void addSkillTag(CVSkillTag skillTag) {
        skillTags.add(skillTag);
        skillTag.setCv(this);
        this.updatedAt = LocalDateTime.now();
    }

    public void removeSkillTag(CVSkillTag skillTag) {
        skillTags.remove(skillTag);
        skillTag.setCv(null);
        this.updatedAt = LocalDateTime.now();
    }
}
