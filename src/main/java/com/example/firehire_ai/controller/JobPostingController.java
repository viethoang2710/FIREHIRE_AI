package com.example.firehire_ai.controller;

import com.example.firehire_ai.service.JobPostingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/jobs")
public class JobPostingController {

    @Autowired
    private JobPostingService jobPostingService;

    @GetMapping
    public ResponseEntity<?> getAllJobs() {
        return jobPostingService.getAllJobs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable Integer id) {
        return jobPostingService.getJobById(id);
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<?> applyToJob(
            @PathVariable Integer id,
            @RequestParam("cvId") Integer cvId
    ) {
        return jobPostingService.applyToJob(id, cvId);
    }
}
