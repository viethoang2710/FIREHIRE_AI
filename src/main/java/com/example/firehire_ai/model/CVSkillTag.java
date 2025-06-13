package com.example.firehire_ai.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(CVSkillTag.CVSkillTagId.class)
public class CVSkillTag {

    @Id
    private Integer cvid;

    @Id
    private Integer skillId;

    @ManyToOne
    @JoinColumn(name = "cvid", insertable = false, updatable = false)
    private CV cv;

    @ManyToOne
    @JoinColumn(name = "skillId", insertable = false, updatable = false)
    private SkillTag skill;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CVSkillTagId implements java.io.Serializable {
        private Integer cvid;
        private Integer skillId;
    }
}
