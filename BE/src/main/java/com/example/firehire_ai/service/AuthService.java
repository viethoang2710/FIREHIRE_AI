package com.example.firehire_ai.service;

import com.example.firehire_ai.dto.AuthRequest;
import com.example.firehire_ai.dto.RegisterCandidateRequest;
import com.example.firehire_ai.dto.RegisterEmployerRequest;
import com.example.firehire_ai.entity.Employer;
import com.example.firehire_ai.entity.User;
import com.example.firehire_ai.repository.EmployerRepository;
import com.example.firehire_ai.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired    private EmployerRepository employerRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private com.example.firehire_ai.security.jwt.JwtUtil jwtUtil;

    @Autowired
    public AuthService(EmployerRepository employerRepository) {
        this.employerRepository = employerRepository;
    }    public Optional<Employer> findEmployerByUserId(Integer userId) {
        return employerRepository.findByUserUserId(userId);
    }
    
    public ResponseEntity<?> registerCandidate(RegisterCandidateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already in use.");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.CANDIDATE);
        user.setCreatedAt(java.time.LocalDateTime.now());
        userRepository.save(user);        return ResponseEntity.ok(new com.example.firehire_ai.dto.RegisterResponse(
            "Candidate registered successfully.", true, user.getEmail()));
    }
    
    public ResponseEntity<?> registerEmployer(RegisterEmployerRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already in use.");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.EMPLOYER);
        user.setCreatedAt(java.time.LocalDateTime.now());
        userRepository.save(user);

        Employer employer = new Employer();
        employer.setUser(user);
        employer.setCompanyName(request.getCompanyName());
        employer.setWebsite(request.getWebsite());
        employer.setDescription(request.getDescription());
        employerRepository.save(employer);        return ResponseEntity.ok(new com.example.firehire_ai.dto.RegisterResponse(
            "Employer registered successfully.", true, user.getEmail()));
    }
    
    public ResponseEntity<?> login(AuthRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPasswordHash())) {
            return ResponseEntity.status(401).body("Invalid credentials.");
        }

        User user = userOpt.get();
        
        // Generate JWT token
        String jwt = jwtUtil.generateToken(user.getEmail());
        
        // Create response with user details and token
        return ResponseEntity.ok(new com.example.firehire_ai.dto.JwtResponse(jwt, user));
    }
}
