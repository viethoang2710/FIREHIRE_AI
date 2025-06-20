package com.example.firehire_ai.service;

import com.example.firehire_ai.dto.EmployerProfileRequest;
import com.example.firehire_ai.dto.JobPostRequest;
import com.example.firehire_ai.entity.Application;
import com.example.firehire_ai.entity.Employer;
import com.example.firehire_ai.entity.JobPosting;
import com.example.firehire_ai.repository.ApplicationRepository;
import com.example.firehire_ai.repository.EmployerRepository;
import com.example.firehire_ai.repository.JobPostingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployerService {

    @Autowired
    private EmployerRepository employerRepository;

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    public ResponseEntity<?> updateProfile(EmployerProfileRequest request) {
        Employer employer = employerRepository.findByUserUserId(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Employer not found"));
        employer.setCompanyName(request.getCompanyName());
        employer.setWebsite(request.getWebsite());
        employer.setDescription(request.getDescription());
        employerRepository.save(employer);

        return ResponseEntity.ok("Profile updated.");
    }

    public ResponseEntity<?> createJobPost(JobPostRequest request) {
        Employer employer = employerRepository.findById(request.getEmployerId()).orElseThrow(
                () -> new RuntimeException("Employer not found")
        );

        JobPosting job = new JobPosting();
        job.setEmployer(employer);
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        jobPostingRepository.save(job);

        return ResponseEntity.ok("Job posted.");
    }

    public ResponseEntity<?> listJobs(Integer employerId) {
        List<JobPosting> jobs = jobPostingRepository.findByEmployerId(employerId);
        return ResponseEntity.ok(jobs);
    }

    public ResponseEntity<?> viewApplications(Integer jobId) {
        List<Application> apps = applicationRepository.findByJobId(Long.valueOf(jobId));
        return ResponseEntity.ok(apps);
    }
}
