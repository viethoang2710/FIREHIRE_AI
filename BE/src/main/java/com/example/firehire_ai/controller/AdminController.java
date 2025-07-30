package com.example.firehire_ai.controller;

import com.example.firehire_ai.entity.User;
import com.example.firehire_ai.entity.JobPosting;
import com.example.firehire_ai.service.UserService;
import com.example.firehire_ai.service.JobPostingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private JobPostingService jobPostingService;

    // Get all users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        try {
            System.out.println("AdminController: Getting all users...");
            List<User> users = userService.getAllUsersForAdmin();
            System.out.println("AdminController: Found " + users.size() + " users");
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            System.err.println("AdminController: Error getting users: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    // Update user status
    @PutMapping("/users/{id}/status")
    public ResponseEntity<Map<String, String>> updateUserStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            userService.updateUserStatus(id, status);

            Map<String, String> response = new HashMap<>();
            response.put("message", "User status updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Failed to update user status");
            return ResponseEntity.status(500).body(response);
        }
    }

    // Delete user
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Integer id) {
        try {
            userService.deleteUser(id);

            Map<String, String> response = new HashMap<>();
            response.put("message", "User deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Failed to delete user");
            return ResponseEntity.status(500).body(response);
        }
    }

    // Get all jobs
    @GetMapping("/jobs")
    public ResponseEntity<List<JobPosting>> getAllJobs() {
        try {
            List<JobPosting> jobs = jobPostingService.getAllJobs();
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    // Get job statistics
    @GetMapping("/jobs/stats")
    public ResponseEntity<Map<String, Integer>> getJobStats() {
        try {
            List<JobPosting> jobs = jobPostingService.getAllJobs();

            Map<String, Integer> stats = new HashMap<>();
            stats.put("total", jobs.size());
            stats.put("pending", (int) jobs.stream().filter(job -> "PENDING".equals(job.getStatus())).count());
            stats.put("approved", (int) jobs.stream().filter(job -> "APPROVED".equals(job.getStatus())).count());
            stats.put("rejected", (int) jobs.stream().filter(job -> "REJECTED".equals(job.getStatus())).count());

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    // Update job status
    @PutMapping("/jobs/{id}/status")
    public ResponseEntity<Map<String, String>> updateJobStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            String reason = request.get("reason");
            jobPostingService.updateJobStatus(id, status, reason);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Job status updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Failed to update job status");
            return ResponseEntity.status(500).body(response);
        }
    }

    // Delete job
    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Map<String, String>> deleteJob(@PathVariable Integer id) {
        try {
            jobPostingService.deleteJob(id);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Job deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Failed to delete job");
            return ResponseEntity.status(500).body(response);
        }
    }
}
