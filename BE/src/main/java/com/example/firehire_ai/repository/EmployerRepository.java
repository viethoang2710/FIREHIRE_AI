package com.example.firehire_ai.repository;

import com.example.firehire_ai.entity.Employer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployerRepository extends JpaRepository<Employer, Integer> {
    Optional<Employer> findByUserUserId(Integer userId);
}
