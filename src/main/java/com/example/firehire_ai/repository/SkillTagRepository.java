package com.example.firehire_ai.repository;

import com.example.firehire_ai.model.SkillTag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SkillTagRepository extends JpaRepository<SkillTag, Integer> {
    Optional<SkillTag> findByName(String name);
}
