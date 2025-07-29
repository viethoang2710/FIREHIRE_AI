package com.example.firehire_ai.repository;

import com.example.firehire_ai.model.CVSection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CVSectionRepository extends JpaRepository<CVSection, Integer> {
    List<CVSection> findByCv_CvId(Integer cvId);

    List<CVSection> findByCv_CvIdOrderByDisplayOrder(Integer cvId);
}
