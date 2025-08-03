package com.example.firehire_ai.repository;

import com.example.firehire_ai.entity.User;
import com.example.firehire_ai.entity.User.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(UserRole role);

    Optional<User> findByEmailAndPasswordHash(String email, String passwordHash);

    // Statistics methods
    Long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    Long countByCreatedAtBefore(LocalDateTime date);

    @Query("SELECT COUNT(u) FROM User u WHERE u.lastLogin > :date")
    Long countByLastLoginAfter(@Param("date") LocalDateTime date);
}
