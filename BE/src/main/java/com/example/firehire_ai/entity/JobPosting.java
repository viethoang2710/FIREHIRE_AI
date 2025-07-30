package com.example.firehire_ai.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Job_Postings") // Đổi tên bảng cho đúng với SQL
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPosting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "JobID") // Đổi tên cột cho đúng với SQL
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EmployerID") // Đổi tên cột cho đúng với SQL
    private Employer employer;

    @Column(name = "EmployerID", insertable = false, updatable = false)
    private Integer employerId;

    @Column(name = "Title", length = 255, nullable = false)
    private String title;

    @Column(name = "CompanyName", length = 255) // Cột mới được thêm vào database
    private String companyName;

    @Column(name = "Description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "Location", length = 100)
    private String location;

    @Column(name = "CreatedAt", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "salary", length = 100)
    private String salary;

    @Column(name = "industry", length = 100)
    private String industry;

    @Column(name = "experience_level", length = 50)
    private String experienceLevel;

    @Column(name = "job_type", length = 50)
    private String jobType; // Full-time, Part-time, Contract, etc.

    @Column(name = "skills_required", columnDefinition = "TEXT")
    private String skillsRequired;

    @Column(name = "benefits", columnDefinition = "TEXT")
    private String benefits;

    @Column(name = "application_deadline")
    private LocalDateTime applicationDeadline;

    @Column(name = "is_urgent")
    @Builder.Default
    private Boolean isUrgent = false;

    @Column(name = "view_count")
    @Builder.Default
    private Integer viewCount = 0;

    @Column(name = "application_count")
    @Builder.Default
    private Integer applicationCount = 0;

    @Column(name = "status", length = 20)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, INACTIVE, CLOSED, EXPIRED

    @Column(name = "created_date")
    @Builder.Default
    private LocalDateTime createdDate = LocalDateTime.now();

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Application> applications = new ArrayList<>();

    // Helper methods for relationship management
    public void setEmployer(Employer employer) {
        this.employer = employer;
        if (employer != null) {
            this.employerId = employer.getId();
        }
    }

    public void addApplication(Application application) {
        applications.add(application);
        application.setJob(this);
        this.applicationCount = applications.size();
    }

    public void removeApplication(Application application) {
        applications.remove(application);
        application.setJob(null);
        this.applicationCount = applications.size();
    }

    public void incrementViewCount() {
        this.viewCount++;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedDate = LocalDateTime.now();
    }
}
