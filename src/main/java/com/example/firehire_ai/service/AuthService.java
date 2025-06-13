package com.example.firehire_ai.service;

import com.example.firehire_ai.dto.AuthRequest;
import com.example.firehire_ai.dto.RegisterCandidateRequest;
import com.example.firehire_ai.dto.RegisterEmployerRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployerRepository employerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public ResponseEntity<?> registerCandidate(RegisterCandidateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already in use.");
        }

        Users user = new Users();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole("candidate");
        userRepository.save(user);

        return ResponseEntity.ok("Candidate registered successfully.");
    }

    public ResponseEntity<?> registerEmployer(RegisterEmployerRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already in use.");
        }

        Users user = new Users();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole("employer");
        userRepository.save(user);

        Employers employer = new Employers();
        employer.setUser(user);
        employer.setCompanyName(request.getCompanyName());
        employer.setWebsite(request.getWebsite());
        employer.setDescription(request.getDescription());
        employerRepository.save(employer);

        return ResponseEntity.ok("Employer registered successfully.");
    }

    public ResponseEntity<?> login(AuthRequest request) {
        Optional<Users> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPasswordHash())) {
            return ResponseEntity.status(401).body("Invalid credentials.");
        }

        // Dummy token return; replace with JWT logic
        return ResponseEntity.ok("Login successful for: " + userOpt.get().getRole());
    }
}
