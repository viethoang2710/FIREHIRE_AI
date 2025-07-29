package com.example.firehire_ai.model;

import com.example.firehire_ai.entity.CV;
import com.example.firehire_ai.entity.SkillTag;
import jakarta.persistence.*;
import lombok.*;
import lombok.Builder;

@Entity(name = "ModelCVSkillTag")
@Table(name = "CV_Skill_Tags_Model")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(CVSkillTag.CVSkillTagId.class)
public class CVSkillTag {

    @Id
    private Integer cvId;

    @Id
    private Integer skillId;

    @ManyToOne
    @JoinColumn(name = "cvId", insertable = false, updatable = false)
    private CV cv;

    @ManyToOne
    @JoinColumn(name = "skillId", insertable = false, updatable = false)
    private SkillTag skill;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CVSkillTagId implements java.io.Serializable {
        private Integer cvId;
        private Integer skillId;
    }
}
