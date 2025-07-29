package com.example.firehire_ai.service;

import com.example.firehire_ai.dto.UserDTO;
import com.example.firehire_ai.dto.request.RegisterRequest;
import com.example.firehire_ai.dto.response.ApiResponse;
import com.example.firehire_ai.dto.response.AuthResponse;
import com.example.firehire_ai.entity.User;
import com.example.firehire_ai.repository.UserRepository;
import com.example.firehire_ai.security.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public ApiResponse<AuthResponse> register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return ApiResponse.<AuthResponse>error("Email already registered");
        }

        // Create new user
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(User.UserRole.valueOf(request.getRole()))
                .build();

        user = userRepository.save(user);

        // Generate JWT token
        String token = jwtService.generateToken(user.getEmail());

        // Create response
        AuthResponse authResponse = AuthResponse.builder()
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().toString()) // Convert enum to String
                .token(token)
                .build();

        return ApiResponse.success("Registration successful", authResponse);
    }

    public ApiResponse<AuthResponse> login(AuthResponse request) {
        // Find user by email
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            return ApiResponse.<AuthResponse>error("Invalid email or password");
        }

        User user = userOptional.get();

        // Check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return ApiResponse.<AuthResponse>error("Invalid email or password");
        }

        // Generate JWT token
        String token = jwtService.generateToken(user.getEmail());

        // Create response
        AuthResponse authResponse = AuthResponse.builder()
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().toString()) // Convert enum to String
                .token(token)
                .build();

        return ApiResponse.success("Login successful", authResponse);
    }

    public ApiResponse<UserDTO> getUserById(Integer id) {
        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isEmpty()) {
            return ApiResponse.<UserDTO>error("User not found");
        }

        return ApiResponse.success(UserDTO.fromEntity(userOptional.get()));
    }

    public ApiResponse<List<UserDTO>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDTO> userDTOs = users.stream()
                .map(UserDTO::fromEntity)
                .collect(Collectors.toList());

        return ApiResponse.success(userDTOs);
    }

    public ApiResponse<List<UserDTO>> getUsersByRole(String role) {
        try {
            User.UserRole userRole = User.UserRole.valueOf(role);
            List<User> users = userRepository.findByRole(userRole);
            List<UserDTO> userDTOs = users.stream()
                    .map(UserDTO::fromEntity)
                    .collect(Collectors.toList());

            return ApiResponse.success(userDTOs);
        } catch (IllegalArgumentException e) {
            return ApiResponse.<List<UserDTO>>error("Invalid role: " + role);
        }
    }
}
