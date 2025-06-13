package com.example.firehire_ai.repository;

import com.example.firehire_ai.model.CVViewLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CVViewLogRepository extends JpaRepository<CVViewLog, Integer> {
    List<CVViewLog> findByEmployerId(Integer employerId);
    List<CVViewLog> findByCvid(Integer cvid);
}
