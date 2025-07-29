package com.example.firehire_ai.repository;

import com.example.firehire_ai.entity.CVSkillTag;
import com.example.firehire_ai.entity.CVSkillTagId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CVSkillTagRepository extends JpaRepository<CVSkillTag, CVSkillTagId> {
    List<CVSkillTag> findByCv_CvId(Integer cvId);
}
