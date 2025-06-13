package com.example.firehire_ai.repository;

import com.example.firehire_ai.model.CV;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CVRepository extends JpaRepository<CV, Integer> {
    List<CV> findByUserId(Integer userId);
}
