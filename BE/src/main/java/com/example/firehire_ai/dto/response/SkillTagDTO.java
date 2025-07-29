package com.example.firehire_ai.dto.response;

import com.example.firehire_ai.entity.SkillTag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SkillTagDTO {
    private Integer skillId;
    private String name;

    public static SkillTagDTO fromEntity(SkillTag skillTag) {
        if (skillTag == null)
            return null;

        return SkillTagDTO.builder()
                .skillId(skillTag.getSkillId())
                .name(skillTag.getName())
                .build();
    }
}
