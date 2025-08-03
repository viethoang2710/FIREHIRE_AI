package com.example.firehire_ai.repository;

import com.example.firehire_ai.entity.JobPosting;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface JobPostingRepository extends JpaRepository<JobPosting, Integer> {
        List<JobPosting> findByEmployerId(Integer employerId);

        // Find jobs by location (exact match)
        List<JobPosting> findByLocation(String location);

        // Find jobs by title containing keyword
        List<JobPosting> findByTitleContainingIgnoreCase(String keyword);

        // Find jobs by description containing keyword
        List<JobPosting> findByDescriptionContainingIgnoreCase(String keyword);

        // Find jobs by title or description containing keyword
        @Query("SELECT j FROM JobPosting j WHERE LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
        List<JobPosting> searchByTitleOrDescription(@Param("keyword") String keyword);

        // Find jobs by location containing keyword - with pagination
        Page<JobPosting> findByLocationContainingIgnoreCase(String location, Pageable pageable);

        // Without pagination
        List<JobPosting> findByLocationContainingIgnoreCase(String location);

        // Find jobs by industry containing keyword - with pagination
        Page<JobPosting> findByIndustryContainingIgnoreCase(String industry, Pageable pageable);

        // Without pagination
        List<JobPosting> findByIndustryContainingIgnoreCase(String industry);

        // Find jobs by experience level
        List<JobPosting> findByExperienceLevelContainingIgnoreCase(String experienceLevel);

        // Find jobs by job type
        List<JobPosting> findByJobTypeContainingIgnoreCase(String jobType);

        // Find jobs by status
        List<JobPosting> findByStatus(String status);

        // Find active jobs
        @Query("SELECT j FROM JobPosting j WHERE j.status = 'ACTIVE' AND (j.expiryDate IS NULL OR j.expiryDate > :currentDate)")
        List<JobPosting> findActiveJobs(@Param("currentDate") LocalDateTime currentDate);

        // Find jobs ordered by creation date (newest first)
        List<JobPosting> findAllByOrderByCreatedDateDesc();

        // Find hot jobs (urgent, high view count, or recently created)
        @Query("SELECT j FROM JobPosting j WHERE j.status = 'ACTIVE' AND (j.isUrgent = true OR j.viewCount > 50 OR j.createdDate > :weekAgo) ORDER BY j.viewCount DESC, j.createdDate DESC")
        List<JobPosting> findHotJobs(@Param("weekAgo") LocalDateTime weekAgo, Pageable pageable);

        // Find latest jobs
        @Query("SELECT j FROM JobPosting j WHERE j.status = 'ACTIVE' ORDER BY j.createdDate DESC")
        List<JobPosting> findLatestJobs(Pageable pageable);

        // Get distinct locations
        @Query("SELECT DISTINCT j.location FROM JobPosting j WHERE j.location IS NOT NULL AND j.status = 'ACTIVE'")
        List<String> findDistinctLocations();

        // Get distinct industries
        @Query("SELECT DISTINCT j.industry FROM JobPosting j WHERE j.industry IS NOT NULL AND j.status = 'ACTIVE'")
        List<String> findDistinctIndustries();

        // Get distinct experience levels
        @Query("SELECT DISTINCT j.experienceLevel FROM JobPosting j WHERE j.experienceLevel IS NOT NULL AND j.status = 'ACTIVE'")
        List<String> findDistinctExperienceLevels();

        // Get distinct job types
        @Query("SELECT DISTINCT j.jobType FROM JobPosting j WHERE j.jobType IS NOT NULL AND j.status = 'ACTIVE'")
        List<String> findDistinctJobTypes();

        // Find similar jobs by industry and location
        @Query("SELECT j FROM JobPosting j WHERE j.id != :jobId AND j.status = 'ACTIVE' AND (j.industry = :industry OR j.location = :location)")
        List<JobPosting> findSimilarJobs(@Param("jobId") Integer jobId, @Param("industry") String industry,
                        @Param("location") String location, Pageable pageable);

        // Advanced search with multiple criteria
        @Query("SELECT j FROM JobPosting j WHERE " +
                        "(:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND "
                        +
                        "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
                        "(:industry IS NULL OR LOWER(j.industry) LIKE LOWER(CONCAT('%', :industry, '%'))) AND " +
                        "(:experienceLevel IS NULL OR LOWER(j.experienceLevel) LIKE LOWER(CONCAT('%', :experienceLevel, '%'))) AND "
                        +
                        "(:jobType IS NULL OR LOWER(j.jobType) LIKE LOWER(CONCAT('%', :jobType, '%'))) AND " +
                        "j.status = 'ACTIVE'")
        Page<JobPosting> advancedSearch(@Param("keyword") String keyword,
                        @Param("location") String location,
                        @Param("industry") String industry,
                        @Param("experienceLevel") String experienceLevel,
                        @Param("jobType") String jobType,
                        Pageable pageable);

        // Count jobs by various criteria
        long countByStatus(String status);

        long countByIndustry(String industry);

        long countByLocation(String location);

        long countByEmployerId(Integer employerId);

        // Find jobs posted in the last N days
        @Query("SELECT j FROM JobPosting j WHERE j.createdDate >= :startDate AND j.status = 'ACTIVE'")
        List<JobPosting> findRecentJobs(@Param("startDate") LocalDateTime startDate);

        // Find expiring jobs
        @Query("SELECT j FROM JobPosting j WHERE j.expiryDate BETWEEN :startDate AND :endDate AND j.status = 'ACTIVE'")
        List<JobPosting> findExpiringJobs(@Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);

        // Statistics methods
        Long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

        Long countByCreatedAtBetweenAndStatus(LocalDateTime startDate, LocalDateTime endDate, String status);

        @Query("SELECT j.industry, COUNT(j) FROM JobPosting j GROUP BY j.industry ORDER BY COUNT(j) DESC")
        List<Object[]> findCategoryDistribution();
}
