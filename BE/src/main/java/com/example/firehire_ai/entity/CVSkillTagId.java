package com.example.firehire_ai.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CVSkillTagId implements Serializable {
    private static final long serialVersionUID = 1L;

    @Column(name = "CVID")
    private Integer cvId;

    @Column(name = "SkillID")
    private Integer skillId;
}
