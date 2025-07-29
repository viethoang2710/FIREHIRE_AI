package com.example.firehire_ai.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Employers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EmployerID")
    private Integer employerId;

    @OneToOne
    @JoinColumn(name = "UserID")
    private User user;

    @Column(name = "CompanyName", length = 255)
    private String companyName;

    @Column(name = "Website", length = 255)
    private String website;

    @Column(name = "Description", columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "employer", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<JobPosting> jobPostings = new ArrayList<>();

    @OneToMany(mappedBy = "employer", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CVViewLog> viewLogs = new ArrayList<>();

    // Helper methods for bidirectional relationship management
    public Integer getId() {
        return this.employerId;
    }

    public void addJobPosting(JobPosting jobPosting) {
        jobPostings.add(jobPosting);
        jobPosting.setEmployer(this);
    }

    public void removeJobPosting(JobPosting jobPosting) {
        jobPostings.remove(jobPosting);
        jobPosting.setEmployer(null);
    }

    public void setUser(User user) {
        this.user = user;
        if (user != null && user.getEmployer() != this) {
            user.setEmployer(this);
        }
    }
}
