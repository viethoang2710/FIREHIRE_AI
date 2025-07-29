package com.example.firehire_ai.repository;

import com.example.firehire_ai.entity.User;
import com.example.firehire_ai.entity.User.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(UserRole role);

    Optional<User> findByEmailAndPasswordHash(String email, String passwordHash);
}
