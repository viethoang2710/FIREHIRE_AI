package com.example.firehire_ai.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "user_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ProfileID")
    private Long profileId;

    @Column(name = "UserID", nullable = false)
    private Integer userId;

    @Column(name = "Title")
    private String title;

    @Column(name = "Bio", columnDefinition = "TEXT")
    private String bio;

    @Column(name = "Skills", columnDefinition = "TEXT")
    private String skills;

    @Column(name = "Experience")
    private String experience;

    @Column(name = "Phone", length = 20)
    private String phone;

    @Column(name = "Address", length = 500)
    private String address;

    @Column(name = "LinkedIn")
    private String linkedin;

    @Column(name = "GitHub")
    private String github;

    @Column(name = "Website")
    private String website;

    @Lob
    @Column(name = "ProfilePicture")
    private byte[] profilePicture;

    @Column(name = "PictureFileName")
    private String pictureFileName;

    @Column(name = "PictureFileSize")
    private Long pictureFileSize;

    @Column(name = "DateOfBirth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(name = "Gender")
    private Gender gender;

    @Column(name = "Nationality", length = 100)
    private String nationality;

    @Column(name = "Languages", columnDefinition = "TEXT")
    private String languages;

    @Column(name = "Education", columnDefinition = "TEXT")
    private String education;

    @Column(name = "Certifications", columnDefinition = "TEXT")
    private String certifications;

    @Enumerated(EnumType.STRING)
    @Column(name = "WorkPreference")
    private WorkPreference workPreference;

    @Column(name = "SalaryExpectation", length = 100)
    private String salaryExpectation;

    @Builder.Default
    @Column(name = "IsPublic")
    private Boolean isPublic = true;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;

    @Column(name = "UpdatedAt")
    private LocalDateTime updatedAt;

    // Enum definitions
    public enum Gender {
        MALE, FEMALE, OTHER
    }

    public enum WorkPreference {
        FULL_TIME, PART_TIME, CONTRACT, FREELANCE, REMOTE
    }

    // Constructor với userId
    public UserProfile(Integer userId) {
        this.userId = userId;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.isPublic = true;
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
