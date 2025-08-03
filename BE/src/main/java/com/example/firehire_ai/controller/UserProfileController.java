package com.example.firehire_ai.controller;

import com.example.firehire_ai.entity.UserProfile;
import com.example.firehire_ai.service.UserProfileService;
import com.example.firehire_ai.dto.UserProfileUpdateRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileService;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserProfile(@PathVariable Integer userId) {
        try {
            UserProfile profile = userProfileService.getUserProfile(userId);
            if (profile != null) {
                return ResponseEntity.ok(profile);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Không thể lấy thông tin profile: " + e.getMessage()));
        }
    }

    @GetMapping("/{userId}/full")
    public ResponseEntity<?> getFullProfile(@PathVariable Integer userId) {
        try {
            Map<String, Object> fullProfile = userProfileService.getFullProfileWithUserInfo(userId);
            return ResponseEntity.ok(fullProfile);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Không thể lấy thông tin đầy đủ: " + e.getMessage()));
        }
    }

    @PostMapping("/{userId}")
    public ResponseEntity<?> updateUserProfile(
            @PathVariable Integer userId,
            @RequestBody UserProfileUpdateRequest profileRequest) {

        try {
            UserProfile profile = profileRequest.toUserProfile();
            UserProfile updatedProfile = userProfileService.updateUserProfile(userId, profile, null);
            return ResponseEntity.ok(Map.of(
                    "message", "Cập nhật profile thành công",
                    "profile", updatedProfile));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Không thể cập nhật profile: " + e.getMessage()));
        }
    }

    @PostMapping(value = "/{userId}/with-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateUserProfileWithImage(
            @PathVariable Integer userId,
            @RequestPart("profile") UserProfileUpdateRequest profileRequest,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage) {

        try {
            UserProfile profile = profileRequest.toUserProfile();
            UserProfile updatedProfile = userProfileService.updateUserProfile(userId, profile, profileImage);
            return ResponseEntity.ok(Map.of(
                    "message", "Cập nhật profile thành công",
                    "profile", updatedProfile));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Không thể cập nhật profile: " + e.getMessage()));
        }
    }

    @PostMapping("/{userId}/image")
    public ResponseEntity<?> uploadProfileImage(
            @PathVariable Integer userId,
            @RequestParam("image") MultipartFile image) {

        try {
            if (image.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "File ảnh không được để trống"));
            }

            // Kiểm tra loại file
            String contentType = image.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "File phải là ảnh hợp lệ"));
            }

            // Kiểm tra kích thước file (5MB)
            if (image.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Kích thước ảnh không được vượt quá 5MB"));
            }

            String imageUrl = userProfileService.uploadProfileImage(userId, image);
            return ResponseEntity.ok(Map.of(
                    "message", "Upload ảnh thành công",
                    "imageUrl", imageUrl));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Không thể upload ảnh: " + e.getMessage()));
        }
    }

    @GetMapping("/{userId}/image")
    public ResponseEntity<byte[]> getProfileImage(@PathVariable Integer userId) {
        try {
            byte[] imageData = userProfileService.getProfileImage(userId);
            if (imageData != null) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG) // Default to JPEG, có thể cải thiện để detect type
                        .body(imageData);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{userId}/image")
    public ResponseEntity<?> deleteProfileImage(@PathVariable Integer userId) {
        try {
            userProfileService.deleteProfileImage(userId);
            return ResponseEntity.ok(Map.of("message", "Xóa ảnh đại diện thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Không thể xóa ảnh: " + e.getMessage()));
        }
    }

    @GetMapping("/{userId}/basic")
    public ResponseEntity<?> getBasicProfile(@PathVariable Integer userId) {
        try {
            Map<String, Object> basicProfile = userProfileService.getBasicProfile(userId);
            return ResponseEntity.ok(basicProfile);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Không thể lấy thông tin cơ bản: " + e.getMessage()));
        }
    }
}
