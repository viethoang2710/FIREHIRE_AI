package com.example.firehire_ai.service;

import com.example.firehire_ai.dto.EmployerProfileRequest;
import com.example.firehire_ai.dto.JobPostRequest;
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
        Employers employer = employerRepository.findByUserId(request.getUserId()).orElseThrow();
        employer.setCompanyName(request.getCompanyName());
        employer.setWebsite(request.getWebsite());
        employer.setDescription(request.getDescription());
        employerRepository.save(employer);

        return ResponseEntity.ok("Profile updated.");
    }

    public ResponseEntity<?> createJobPost(JobPostRequest request) {
        Employers employer = employerRepository.findById(request.getEmployerId()).orElseThrow();

        JobPostings job = new JobPostings();
        job.setEmployer(employer);
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        jobPostingRepository.save(job);

        return ResponseEntity.ok("Job posted.");
    }

    public ResponseEntity<?> listJobs(Integer employerId) {
        List<JobPostings> jobs = jobPostingRepository.findByEmployerEmployerID(employerId);
        return ResponseEntity.ok(jobs);
    }

    public ResponseEntity<?> viewApplications(Integer jobId) {
        List<Applications> apps = applicationRepository.findByJobJobID(jobId);
        return ResponseEntity.ok(apps);
    }
}
