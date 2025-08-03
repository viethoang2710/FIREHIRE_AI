package com.example.firehire_ai.repository;

import com.example.firehire_ai.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    Optional<UserProfile> findByUserId(Integer userId);

    boolean existsByUserId(Integer userId);

    @Query("SELECT up FROM UserProfile up WHERE up.userId = :userId")
    Optional<UserProfile> findUserProfileByUserId(@Param("userId") Integer userId);

    void deleteByUserId(Integer userId);

    @Query("SELECT COUNT(up) > 0 FROM UserProfile up WHERE up.userId = :userId AND up.profilePicture IS NOT NULL")
    boolean hasProfileImage(@Param("userId") Integer userId);
}
