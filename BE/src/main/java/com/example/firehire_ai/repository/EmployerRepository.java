package com.example.firehire_ai.repository;

import com.example.firehire_ai.entity.Employer;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface EmployerRepository extends JpaRepository<Employer, Integer> {
    // Đúng theo field mới là "id" trong User
    Optional<Employer> findByUser_Id(Integer id);

    // Statistics methods
    @Query("SELECT e.companyName, COUNT(j), COALESCE(SUM(j.applicationCount), 0) " +
            "FROM Employer e LEFT JOIN e.jobPostings j " +
            "GROUP BY e.id, e.companyName " +
            "ORDER BY COUNT(j) DESC")
    List<Object[]> findTopCompaniesByJobCount(Pageable pageable);
}
