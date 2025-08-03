package com.example.firehire_ai.service;

import com.example.firehire_ai.entity.UserProfile;
import com.example.firehire_ai.repository.UserProfileRepository;
import com.example.firehire_ai.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.function.Consumer;

@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserRepository userRepository;

    public UserProfile getUserProfile(Integer userId) {
        return userProfileRepository.findByUserId(userId).orElse(null);
    }

    public UserProfile createUserProfile(Integer userId) {
        // Kiểm tra xem user có tồn tại không
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User không tồn tại với ID: " + userId);
        }

        // Kiểm tra xem profile đã tồn tại chưa
        if (userProfileRepository.existsByUserId(userId)) {
            throw new RuntimeException("Profile đã tồn tại cho user ID: " + userId);
        }

        UserProfile profile = new UserProfile(userId);
        return userProfileRepository.save(profile);
    }

    public UserProfile updateUserProfile(Integer userId, UserProfile profileData, MultipartFile profileImage) {
        try {
            UserProfile existingProfile = userProfileRepository.findByUserId(userId)
                    .orElseGet(() -> {
                        UserProfile newProfile = new UserProfile();
                        newProfile.setUserId(userId);
                        return userProfileRepository.save(newProfile);
                    });

            // Cập nhật thông tin profile với safe checks
            updateFieldIfNotEmpty(existingProfile::setTitle, profileData.getTitle());
            updateFieldIfNotEmpty(existingProfile::setBio, profileData.getBio());
            updateFieldIfNotEmpty(existingProfile::setSkills, profileData.getSkills());
            updateFieldIfNotEmpty(existingProfile::setExperience, profileData.getExperience());
            updateFieldIfNotEmpty(existingProfile::setPhone, profileData.getPhone());
            updateFieldIfNotEmpty(existingProfile::setAddress, profileData.getAddress());
            updateFieldIfNotEmpty(existingProfile::setLinkedin, profileData.getLinkedin());
            updateFieldIfNotEmpty(existingProfile::setGithub, profileData.getGithub());
            updateFieldIfNotEmpty(existingProfile::setWebsite, profileData.getWebsite());
            updateFieldIfNotEmpty(existingProfile::setSalaryExpectation, profileData.getSalaryExpectation());
            updateFieldIfNotEmpty(existingProfile::setNationality, profileData.getNationality());
            updateFieldIfNotEmpty(existingProfile::setLanguages, profileData.getLanguages());
            updateFieldIfNotEmpty(existingProfile::setEducation, profileData.getEducation());
            updateFieldIfNotEmpty(existingProfile::setCertifications, profileData.getCertifications());

            // Update enum fields
            if (profileData.getWorkPreference() != null) {
                existingProfile.setWorkPreference(profileData.getWorkPreference());
            }
            if (profileData.getGender() != null) {
                existingProfile.setGender(profileData.getGender());
            }
            if (profileData.getDateOfBirth() != null) {
                existingProfile.setDateOfBirth(profileData.getDateOfBirth());
            }

            // Xử lý ảnh profile nếu có
            if (profileImage != null && !profileImage.isEmpty()) {
                // Validate image size
                if (profileImage.getSize() > 5 * 1024 * 1024) { // 5MB limit
                    throw new RuntimeException("Kích thước ảnh không được vượt quá 5MB");
                }

                try {
                    existingProfile.setProfilePicture(profileImage.getBytes());
                    existingProfile.setPictureFileName(profileImage.getOriginalFilename());
                    existingProfile.setPictureFileSize(profileImage.getSize());
                } catch (java.io.IOException e) {
                    throw new RuntimeException("Không thể đọc dữ liệu ảnh profile: " + e.getMessage(), e);
                } catch (Exception e) {
                    throw new RuntimeException("Không thể xử lý ảnh profile: " + e.getMessage(), e);
                }
            }

            // Save with detailed error handling
            try {
                return userProfileRepository.save(existingProfile);
            } catch (Exception saveException) {
                String errorMsg = saveException.getMessage();
                System.out.println("DEBUG: Save exception in updateUserProfile: " + errorMsg);
                // Skip the old error check since database is fixed
                throw new RuntimeException("Lỗi database khi cập nhật profile: " + errorMsg);
            }
        } catch (Exception e) {
            if (e instanceof RuntimeException) {
                throw e; // Re-throw với message đã được format
            }
            throw new RuntimeException("Không thể cập nhật profile: " + e.getMessage(), e);
        }
    }

    public String uploadProfileImage(Integer userId, MultipartFile image) {
        try {
            // Validate input
            if (image == null || image.isEmpty()) {
                throw new RuntimeException("File ảnh không được để trống");
            }

            if (image.getSize() > 5 * 1024 * 1024) { // 5MB limit
                throw new RuntimeException("Kích thước ảnh không được vượt quá 5MB");
            }

            // Get or create profile
            UserProfile profile = userProfileRepository.findByUserId(userId)
                    .orElseGet(() -> {
                        UserProfile newProfile = new UserProfile();
                        newProfile.setUserId(userId);
                        return newProfile;
                    });

            // Set image data
            try {
                profile.setProfilePicture(image.getBytes());
                profile.setPictureFileName(image.getOriginalFilename());
                profile.setPictureFileSize(image.getSize());
            } catch (java.io.IOException e) {
                throw new RuntimeException("Không thể đọc dữ liệu ảnh: " + e.getMessage(), e);
            }

            // Save with detailed error handling
            try {
                userProfileRepository.save(profile);
            } catch (Exception saveException) {
                String errorMsg = saveException.getMessage();
                System.out.println("DEBUG: Save exception: " + errorMsg);
                // Skip the old error check since database is fixed
                throw new RuntimeException("Lỗi database khi lưu ảnh: " + errorMsg);
            }

            // Trả về URL để frontend có thể hiển thị
            return "/api/profile/" + userId + "/image";

        } catch (Exception e) {
            if (e instanceof RuntimeException) {
                throw e; // Re-throw với message đã được format
            }
            throw new RuntimeException("Không thể upload ảnh: " + e.getMessage(), e);
        }
    }

    public void deleteProfileImage(Integer userId) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile không tồn tại"));

        profile.setProfilePicture(null);
        profile.setPictureFileName(null);
        profile.setPictureFileSize(null);

        userProfileRepository.save(profile);
    }

    public byte[] getProfileImage(Integer userId) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElse(null);

        return profile != null ? profile.getProfilePicture() : null;
    }

    public Map<String, Object> getBasicProfile(Integer userId) {
        Optional<UserProfile> profileOpt = userProfileRepository.findByUserId(userId);
        Map<String, Object> result = new HashMap<>();

        if (profileOpt.isPresent()) {
            UserProfile profile = profileOpt.get();
            result.put("profileId", profile.getProfileId());
            result.put("userId", profile.getUserId());
            result.put("title", profile.getTitle());
            result.put("bio", profile.getBio());
            result.put("skills", profile.getSkills());
            result.put("experience", profile.getExperience());
            result.put("hasProfileImage", profile.getProfilePicture() != null);
            result.put("workPreference", profile.getWorkPreference());
            result.put("salaryExpectation", profile.getSalaryExpectation());
            result.put("phone", profile.getPhone());
            result.put("address", profile.getAddress());
            result.put("linkedin", profile.getLinkedin());
            result.put("github", profile.getGithub());
            result.put("website", profile.getWebsite());
        }

        return result;
    }

    public boolean hasProfileImage(Integer userId) {
        return userProfileRepository.hasProfileImage(userId);
    }

    public Map<String, Object> getFullProfileWithUserInfo(Integer userId) {
        Map<String, Object> result = new HashMap<>();

        // Lấy thông tin user cơ bản
        var user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new RuntimeException("User không tồn tại");
        }

        // Lấy thông tin profile
        UserProfile profile = userProfileRepository.findByUserId(userId).orElse(null);

        // Combine user info + profile info
        result.put("userId", user.getId());
        result.put("fullName", user.getFullName()); // Match với User entity
        result.put("email", user.getEmail());
        result.put("phoneNumber", user.getPhoneNumber()); // From User entity

        if (profile != null) {
            result.put("title", profile.getTitle());
            result.put("bio", profile.getBio());
            result.put("skills", profile.getSkills());
            result.put("experience", profile.getExperience());
            result.put("address", profile.getAddress());
            result.put("linkedinUrl", profile.getLinkedin()); // Match với frontend field
            result.put("githubUrl", profile.getGithub()); // Match với frontend field
            result.put("websiteUrl", profile.getWebsite()); // Match với frontend field
            result.put("workPreference", profile.getWorkPreference());
            result.put("salaryExpectation", profile.getSalaryExpectation());
            result.put("hasProfileImage", profile.getProfilePicture() != null);
        }

        return result;
    }

    // Helper method để update field chỉ khi có giá trị
    private void updateFieldIfNotEmpty(Consumer<String> setter, String value) {
        if (value != null && !value.trim().isEmpty()) {
            setter.accept(value);
        }
    }
}
