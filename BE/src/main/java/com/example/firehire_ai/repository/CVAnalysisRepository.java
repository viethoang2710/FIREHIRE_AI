package com.example.firehire_ai.repository;

import com.example.firehire_ai.entity.CVAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CVAnalysisRepository extends JpaRepository<CVAnalysis, Integer> {

    List<CVAnalysis> findByUserIdOrderByAnalysisDateDesc(Integer userId);

    List<CVAnalysis> findByUserIdAndStatusOrderByAnalysisDateDesc(Integer userId, String status);

    @Query("SELECT c FROM CVAnalysis c WHERE c.userId = :userId AND c.analysisDate >= :startDate")
    List<CVAnalysis> findByUserIdAndAnalysisDateAfter(@Param("userId") Integer userId,
            @Param("startDate") LocalDateTime startDate);

    @Query("SELECT COUNT(c) FROM CVAnalysis c WHERE c.userId = :userId AND c.analysisDate >= :startDate")
    Long countByUserIdAndAnalysisDateAfter(@Param("userId") Integer userId,
            @Param("startDate") LocalDateTime startDate);

    @Query("SELECT AVG(c.score) FROM CVAnalysis c WHERE c.userId = :userId")
    Double getAverageScoreByUserId(@Param("userId") Integer userId);

    List<CVAnalysis> findByTargetPositionContainingIgnoreCase(String targetPosition);

    @Query("SELECT c FROM CVAnalysis c WHERE c.score >= :minScore AND c.score <= :maxScore")
    List<CVAnalysis> findByScoreRange(@Param("minScore") Integer minScore,
            @Param("maxScore") Integer maxScore);
}
