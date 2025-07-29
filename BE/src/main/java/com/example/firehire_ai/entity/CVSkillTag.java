package com.example.firehire_ai.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "CV_Skill_Tags")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CVSkillTag {

    @EmbeddedId
    @Builder.Default
    private CVSkillTagId id = new CVSkillTagId();

    @ManyToOne
    @MapsId("cvId")
    @JoinColumn(name = "CVID")
    private CV cv;

    @ManyToOne
    @MapsId("skillId")
    @JoinColumn(name = "SkillID")
    private SkillTag skill;
}
