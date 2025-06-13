package com.example.firehire_ai.repository;

import com.example.firehire_ai.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Integer> {
    List<Application> findByJobId(Integer jobId);
    List<Application> findByCvid(Integer cvid);
}
