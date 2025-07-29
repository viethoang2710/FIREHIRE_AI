package com.example.firehire_ai.repository;

import com.example.firehire_ai.entity.CVViewLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CVViewLogRepository extends JpaRepository<CVViewLog, Integer> {
    List<CVViewLog> findByEmployer_EmployerId(Integer employerId);

    List<CVViewLog> findByCv_CvId(Integer cvId);
}
