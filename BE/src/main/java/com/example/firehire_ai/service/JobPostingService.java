package com.example.firehire_ai.service;

import com.example.firehire_ai.entity.Application;
import com.example.firehire_ai.entity.JobPosting;
import com.example.firehire_ai.repository.ApplicationRepository;
import com.example.firehire_ai.repository.CVRepository;
import com.example.firehire_ai.repository.JobPostingRepository;
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
        List<JobPosting> jobs = jobPostingRepository.findAll();
        return ResponseEntity.ok(jobs);
    }

    public ResponseEntity<?> getJobById(Integer id) {
        JobPosting job = jobPostingRepository.findById(id).orElseThrow();
        return ResponseEntity.ok(job);
    }

    public ResponseEntity<?> applyToJob(Integer jobId, Integer cvId) {
        Application app = new Application();
        app.setJob(jobPostingRepository.findById(jobId).orElseThrow());
        app.setCv(cvRepository.findById(cvId).orElseThrow());
        applicationRepository.save(app);

        return ResponseEntity.ok("Application submitted.");
    }
}
