package com.example.firehire_ai.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserID")
    private Integer id;

    @Column(name = "FullName", length = 100)
    private String fullName;

    @Column(name = "Email", length = 100, unique = true)
    private String email;

    private String passwordHash;

    @Column(name = "PhoneNumber", length = 20)
    private String phoneNumber;

    @Convert(converter = UserRoleConverter.class)
    @Column(name = "Role", nullable = false)
    @Builder.Default
    private UserRole role = UserRole.CANDIDATE;

    @CreationTimestamp
    @Column(name = "CreatedAt", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonIgnore
    private Set<CV> cvs = new HashSet<>();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Employer employer;

    // Enum for user roles
    public enum UserRole {
        CANDIDATE, EMPLOYER, ADMIN
    }

    // Helper methods for bidirectional relationships
    public void addCV(CV cv) {
        cvs.add(cv);
        cv.setUser(this);
    }

    public void removeCV(CV cv) {
        cvs.remove(cv);
        cv.setUser(null);
    }

    public void setEmployer(Employer employer) {
        this.employer = employer;
        if (employer != null && employer.getUser() != this) {
            employer.setUser(this);
        }
    }
}