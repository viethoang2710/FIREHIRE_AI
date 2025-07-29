package com.example.firehire_ai.controller;

import com.example.firehire_ai.entity.Employer;
import com.example.firehire_ai.entity.User;
import com.example.firehire_ai.repository.EmployerRepository;
import com.example.firehire_ai.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/test-data")
@CrossOrigin(origins = "*")
public class TestDataController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployerRepository employerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/create-test-users")
    public ResponseEntity<?> createTestUsers() {
        try {
            // Tạo admin user
            if (!userRepository.existsByEmail("admin@test.com")) {
                User admin = new User();
                admin.setFullName("Admin Test");
                admin.setEmail("admin@test.com");
                admin.setPasswordHash(passwordEncoder.encode("123456"));
                admin.setPhoneNumber("0901234567");
                admin.setRole(User.UserRole.ADMIN);
                admin.setCreatedAt(LocalDateTime.now());
                userRepository.save(admin);
            }

            // Tạo employer user
            if (!userRepository.existsByEmail("employer@test.com")) {
                User employer = new User();
                employer.setFullName("Employer Test");
                employer.setEmail("employer@test.com");
                employer.setPasswordHash(passwordEncoder.encode("123456"));
                employer.setPhoneNumber("0901234568");
                employer.setRole(User.UserRole.EMPLOYER);
                employer.setCreatedAt(LocalDateTime.now());
                userRepository.save(employer);

                // Tạo employer profile
                Employer employerProfile = new Employer();
                employerProfile.setUser(employer);
                employerProfile.setCompanyName("Test Company");
                employerProfile.setWebsite("https://testcompany.com");
                employerProfile.setDescription("Test company description");
                employerRepository.save(employerProfile);
            }

            // Tạo candidate user
            if (!userRepository.existsByEmail("candidate@test.com")) {
                User candidate = new User();
                candidate.setFullName("Candidate Test");
                candidate.setEmail("candidate@test.com");
                candidate.setPasswordHash(passwordEncoder.encode("123456"));
                candidate.setPhoneNumber("0901234569");
                candidate.setRole(User.UserRole.CANDIDATE);
                candidate.setCreatedAt(LocalDateTime.now());
                userRepository.save(candidate);
            }

            return ResponseEntity.ok("Test users created successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating test users: " + e.getMessage());
        }
    }

    @DeleteMapping("/clear-users")
    public ResponseEntity<?> clearAllUsers() {
        try {
            employerRepository.deleteAll();
            userRepository.deleteAll();
            return ResponseEntity.ok("All users cleared!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error clearing users: " + e.getMessage());
        }
    }
}
