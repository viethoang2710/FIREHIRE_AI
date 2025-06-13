package com.example.firehire_ai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobPostingService {

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private CVRepository cvRepository;

    public ResponseEntity<?> getAllJobs() {
        List<JobPostings> jobs = jobPostingRepository.findAll();
        return ResponseEntity.ok(jobs);
    }

    public ResponseEntity<?> getJobById(Integer id) {
        JobPostings job = jobPostingRepository.findById(id).orElseThrow();
        return ResponseEntity.ok(job);
    }

    public ResponseEntity<?> applyToJob(Integer jobId, Integer cvId) {
        Applications app = new Applications();
        app.setJob(jobPostingRepository.findById(jobId).orElseThrow());
        app.setCv(cvRepository.findById(cvId).orElseThrow());
        applicationRepository.save(app);

        return ResponseEntity.ok("Application submitted.");
    }
}
