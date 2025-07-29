package com.example.firehire_ai.service;

import org.springframework.http.HttpStatus;
import com.example.firehire_ai.dto.AuthRequest;
import com.example.firehire_ai.dto.response.AuthResponse;
import com.example.firehire_ai.dto.RegisterCandidateRequest;
import com.example.firehire_ai.dto.RegisterEmployerRequest;
import com.example.firehire_ai.dto.RegisterResponse;
import com.example.firehire_ai.entity.Employer;
import com.example.firehire_ai.entity.User;
import com.example.firehire_ai.repository.EmployerRepository;
import com.example.firehire_ai.repository.UserRepository;
import com.example.firehire_ai.security.jwt.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployerRepository employerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public Optional<Employer> findEmployerByUserId(Integer userId) {
        return employerRepository.findByUser_Id(userId);
    }

    public ResponseEntity<?> registerCandidate(RegisterCandidateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new RegisterResponse("Email already in use.", false, request.getEmail()));
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(User.UserRole.CANDIDATE);
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);

        return ResponseEntity.ok(new RegisterResponse("Candidate registered successfully.", true, user.getEmail()));
    }

    public ResponseEntity<?> registerEmployer(RegisterEmployerRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new RegisterResponse("Email already in use.", false, request.getEmail()));
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(User.UserRole.EMPLOYER);
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);

        Employer employer = new Employer();
        employer.setUser(user);
        employer.setCompanyName(request.getCompanyName());
        employer.setWebsite(request.getWebsite());
        employer.setDescription(request.getDescription());

        employerRepository.save(employer);

        return ResponseEntity.ok(new RegisterResponse("Employer registered successfully.", true, user.getEmail()));
    }

    public ResponseEntity<?> login(AuthRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()
                || !passwordEncoder.matches(request.getPassword(), userOptional.get().getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        User user = userOptional.get();

        AuthResponse response = new AuthResponse();
        response.setUserId(user.getId());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setRole(user.getRole().toString()); // Convert enum to String

        String token = jwtUtil.createToken(user);
        response.setToken(token);

        if (user.getRole() == User.UserRole.EMPLOYER) {
            employerRepository.findByUser_Id(user.getId()).ifPresent(employer -> {
                response.setCompanyName(employer.getCompanyName());
                response.setWebsite(employer.getWebsite());
                response.setDescription(employer.getDescription());
            });
        }

        return ResponseEntity.ok(response);
    }

}
