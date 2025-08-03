package com.example.firehire_ai.controller;

import com.example.firehire_ai.dto.response.ApiResponse;
import com.example.firehire_ai.entity.User;
import com.example.firehire_ai.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.<List<User>>error("Failed to retrieve users: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable Integer id) {
        try {
            Optional<User> userOptional = userRepository.findById(id);
            if (userOptional.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", userOptional.get()));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.<User>error("Failed to retrieve user: " + e.getMessage()));
        }
    }

    @GetMapping("/candidates")
    public ResponseEntity<ApiResponse<List<User>>> getCandidates() {
        try {
            List<User> candidates = userRepository.findByRole(User.UserRole.CANDIDATE);
            return ResponseEntity.ok(ApiResponse.success("Candidates retrieved successfully", candidates));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.<List<User>>error("Failed to retrieve candidates: " + e.getMessage()));
        }
    }

    @GetMapping("/employers")
    public ResponseEntity<ApiResponse<List<User>>> getEmployers() {
        try {
            List<User> employers = userRepository.findByRole(User.UserRole.EMPLOYER);
            return ResponseEntity.ok(ApiResponse.success("Employers retrieved successfully", employers));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.<List<User>>error("Failed to retrieve employers: " + e.getMessage()));
        }
    }
}
