package com.example.firehire_ai.repository;

import com.example.firehire_ai.entity.Application;
import com.example.firehire_ai.entity.Application.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

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
}
