package com.example.firehire_ai.repository;

import com.example.firehire_ai.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByJobId(Long jobId);
    List<Application> findByCvid(Long cvid); // Nếu CV ID là Long
}
