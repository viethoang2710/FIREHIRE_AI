package com.example.firehire_ai.repository;

import com.example.firehire_ai.model.CVSkillTag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CVSkillTagRepository extends JpaRepository<CVSkillTag, CVSkillTag.CVSkillTagId> {
    List<CVSkillTag> findByCvid(Integer cvid);
}
