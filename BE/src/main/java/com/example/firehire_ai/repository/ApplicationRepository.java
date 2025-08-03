package com.example.firehire_ai.repository;

import com.example.firehire_ai.entity.Application;
import com.example.firehire_ai.entity.Application.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Integer> {
    // Find applications by job ID
    List<Application> findByJob_Id(Integer jobId);

    // Find applications by CV ID
    List<Application> findByCv_CvId(Integer cvId);

    // Find applications by status
    List<Application> findByStatus(ApplicationStatus status);

    // Find applications by job ID and status
    List<Application> findByJob_IdAndStatus(Integer jobId, ApplicationStatus status);

    // Find applications by CV ID and status
    List<Application> findByCv_CvIdAndStatus(Integer cvId, ApplicationStatus status);

    // Find applications by CV ID and job ID
    List<Application> findByCv_CvIdAndJob_Id(Integer cvId, Integer jobId);

    // Find applications by job ID and user ID (through CV)
    List<Application> findByJob_IdAndCv_User_Id(Integer jobId, Integer userId);

    // Statistics methods
    Long countByAppliedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.appliedAt BETWEEN :startDate AND :endDate AND a.status = :status")
    Long countByAppliedAtBetweenAndStatus(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("status") String status);
}
