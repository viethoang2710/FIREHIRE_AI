package com.example.firehire_ai.repository;

import com.example.firehire_ai.entity.CV;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CVRepository extends JpaRepository<CV, Integer> {
    List<CV> findByUser_Id(Integer userId);

    List<CV> findByJob_Id(Integer jobId);

    @Query("SELECT c FROM CV c " +
            "LEFT JOIN FETCH c.user " +
            "LEFT JOIN FETCH c.template " +
            "LEFT JOIN FETCH c.job " +
            "LEFT JOIN FETCH c.sections " +
            "LEFT JOIN FETCH c.skillTags st " +
            "LEFT JOIN FETCH st.skill " +
            "WHERE c.user.id = :userId " +
            "ORDER BY c.createdAt DESC")
    List<CV> findByUserIdWithDetails(@Param("userId") Integer userId);
}
