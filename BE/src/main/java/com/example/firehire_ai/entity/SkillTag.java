package com.example.firehire_ai.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Skill_Tags")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SkillID")
    private Integer skillId;

    @Column(name = "Name", length = 100, unique = true)
    private String name;

    @OneToMany(mappedBy = "skill", cascade = CascadeType.ALL)
    @Builder.Default
    private Set<CVSkillTag> cvSkillTags = new HashSet<>();
}
