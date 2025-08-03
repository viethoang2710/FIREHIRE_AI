package com.example.firehire_ai.controller;

import com.example.firehire_ai.dto.response.AuthResponse;
import com.example.firehire_ai.dto.RegisterEmployerRequest;
import com.example.firehire_ai.dto.AuthRequest;
import com.example.firehire_ai.entity.User;
import com.example.firehire_ai.service.AuthService;
import com.example.firehire_ai.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
@CrossOrigin(origins = "*")
public class DebugController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserProfileService userProfileService;

    @GetMapping("/test-roles")
    public AuthResponse testRoles() {
        AuthResponse response = new AuthResponse();
        response.setUserId(1);
        response.setFullName("Test User");
        response.setEmail("test@example.com");
        response.setRole("EMPLOYER"); // Now using String
        response.setToken("test-token");
        return response;
    }

    @GetMapping("/test-all-roles")
    public Object testAllRoles() {
        return new Object() {
            public final String ADMIN = User.UserRole.ADMIN.toString();
            public final String EMPLOYER = User.UserRole.EMPLOYER.toString();
            public final String CANDIDATE = User.UserRole.CANDIDATE.toString();
            public final User.UserRole adminEnum = User.UserRole.ADMIN;
            public final User.UserRole employerEnum = User.UserRole.EMPLOYER;
            public final User.UserRole candidateEnum = User.UserRole.CANDIDATE;
        };
    }

    @PostMapping("/create-test-employer")
    public ResponseEntity<?> createTestEmployer() {
        RegisterEmployerRequest request = new RegisterEmployerRequest();
        request.setFullName("Test Employer");
        request.setEmail("test@employer.com");
        request.setPassword("password123");
        request.setPhoneNumber("123456789");
        request.setCompanyName("Test Company");
        request.setWebsite("https://test.com");
        request.setDescription("Test company description");

        return authService.registerEmployer(request);
    }

    @PostMapping("/test-login")
    public ResponseEntity<?> testLogin() {
        AuthRequest request = new AuthRequest();
        request.setEmail("test@employer.com");
        request.setPassword("password123");

        ResponseEntity<?> result = authService.login(request);

        // Debug logging
        System.out.println("=== BACKEND LOGIN DEBUG ===");
        System.out.println("Response: " + result.getBody());
        if (result.getBody() instanceof AuthResponse) {
            AuthResponse authResponse = (AuthResponse) result.getBody();
            System.out.println("Role: " + authResponse.getRole());
        }

        return result;
    }

    @PostMapping("/image-info")
    public ResponseEntity<?> analyzeImageUpload(@RequestParam("image") MultipartFile image) {
        try {
            Map<String, Object> info = new HashMap<>();

            // Basic file info
            info.put("fileName", image.getOriginalFilename());
            info.put("fileSize", image.getSize());
            info.put("contentType", image.getContentType());
            info.put("isEmpty", image.isEmpty());

            // Size analysis
            long sizeInMB = image.getSize() / (1024 * 1024);
            info.put("sizeInMB", sizeInMB);
            info.put("isOverLimit", sizeInMB > 5); // 5MB limit

            // Try to get bytes info
            try {
                byte[] bytes = image.getBytes();
                info.put("bytesLength", bytes.length);
                info.put("canReadBytes", true);

                // Check if it's a valid image
                if (bytes.length > 0) {
                    // Check image signature
                    String hex = String.format("%02X%02X", bytes[0], bytes[1]);
                    info.put("fileSignature", hex);

                    if (hex.equals("FFD8")) {
                        info.put("imageType", "JPEG");
                    } else if (hex.equals("8950")) {
                        info.put("imageType", "PNG");
                    } else {
                        info.put("imageType", "UNKNOWN");
                    }
                }
            } catch (Exception e) {
                info.put("canReadBytes", false);
                info.put("bytesError", e.getMessage());
            }

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", info,
                    "message", "Image analysis completed"));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", "Analysis failed: " + e.getMessage()));
        }
    }

    @PostMapping("/test-profile-image/{userId}")
    public ResponseEntity<?> testProfileImageUpload(
            @PathVariable Integer userId,
            @RequestParam("image") MultipartFile image) {
        try {

            // First analyze the image
            Map<String, Object> analysis = new HashMap<>();
            analysis.put("fileName", image.getOriginalFilename());
            analysis.put("fileSize", image.getSize());
            analysis.put("contentType", image.getContentType());

            // Try uploading step by step
            Map<String, Object> steps = new HashMap<>();

            // Step 1: Check if file is readable
            try {
                byte[] bytes = image.getBytes();
                steps.put("step1_readBytes", "SUCCESS - " + bytes.length + " bytes read");
            } catch (Exception e) {
                steps.put("step1_readBytes", "FAILED - " + e.getMessage());
                return ResponseEntity.status(500).body(Map.of(
                        "success", false,
                        "analysis", analysis,
                        "steps", steps));
            }

            // Step 2: Try to save to database
            try {
                String result = userProfileService.uploadProfileImage(userId, image);
                steps.put("step2_saveToDb", "SUCCESS - " + result);

                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "analysis", analysis,
                        "steps", steps,
                        "message", "Profile image uploaded successfully"));

            } catch (Exception e) {
                steps.put("step2_saveToDb", "FAILED - " + e.getMessage());

                return ResponseEntity.status(500).body(Map.of(
                        "success", false,
                        "analysis", analysis,
                        "steps", steps,
                        "error", "Database save failed: " + e.getMessage()));
            }

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", "Test failed: " + e.getMessage()));
        }
    }
}
