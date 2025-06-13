package com.example.firehire_ai.repository;

import com.example.firehire_ai.model.Employer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployerRepository extends JpaRepository<Employer, Integer> {
    Employer findByUserId(Integer userId);
}
