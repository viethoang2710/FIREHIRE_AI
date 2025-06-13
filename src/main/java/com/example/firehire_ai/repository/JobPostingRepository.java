package com.example.firehire_ai.repository;

import com.example.firehire_ai.model.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobPostingRepository extends JpaRepository<JobPosting, Integer> {
    List<JobPosting> findByEmployerId(Integer employerId);
}
