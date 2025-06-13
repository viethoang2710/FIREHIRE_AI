package com.example.firehire_ai.controller;

import com.example.firehire_ai.dto.AuthRequest;
import com.example.firehire_ai.dto.RegisterCandidateRequest;
import com.example.firehire_ai.dto.RegisterEmployerRequest;
import com.example.firehire_ai.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register/candidate")
    public ResponseEntity<?> registerCandidate(@RequestBody RegisterCandidateRequest request) {
        return authService.registerCandidate(request);
    }

    @PostMapping("/register/employer")
    public ResponseEntity<?> registerEmployer(@RequestBody RegisterEmployerRequest request) {
        return authService.registerEmployer(request);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        return authService.login(request);
    }
}
