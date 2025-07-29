package com.example.firehire_ai.repository;

import com.example.firehire_ai.entity.CVTemplate;
import com.example.firehire_ai.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CVTemplateRepository extends JpaRepository<CVTemplate, Integer> {
    List<CVTemplate> findByCreatedBy(User admin);

    List<CVTemplate> findByNameContainingIgnoreCase(String name);
}
