package com.example.firehire_ai.service;

import com.example.firehire_ai.dto.request.EmployerProfileRequest;
import com.example.firehire_ai.dto.response.ApiResponse;
import com.example.firehire_ai.dto.response.EmployerDTO;
import com.example.firehire_ai.entity.Employer;
import com.example.firehire_ai.entity.User;
import com.example.firehire_ai.repository.EmployerRepository;
import com.example.firehire_ai.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class EmployerService {

    @Autowired
    private EmployerRepository employerRepository;

    @Autowired
    private UserRepository userRepository;

    public ApiResponse<EmployerDTO> createOrUpdateEmployerProfile(EmployerProfileRequest request) {
        try {
            // Tìm user theo userId từ request
            Optional<User> userOptional = userRepository.findById(request.getUserId());

            if (userOptional.isEmpty()) {
                return ApiResponse.error("User not found with ID: " + request.getUserId());
            }

            User user = userOptional.get();

            Employer employer;

            Optional<Employer> existingEmployer = employerRepository.findByUser_Id(request.getUserId());

            if (existingEmployer.isPresent()) {
                // Cập nhật thông tin employer hiện có
                employer = existingEmployer.get();
                employer.setCompanyName(request.getCompanyName());
                employer.setWebsite(request.getWebsite());
                employer.setDescription(request.getDescription());
            } else {
                // Tạo mới employer profile
                employer = Employer.builder()
                        .user(user)
                        .companyName(request.getCompanyName())
                        .website(request.getWebsite())
                        .description(request.getDescription())
                        .build();
            }

            Employer savedEmployer = employerRepository.save(employer);

            return ApiResponse.success("Employer profile saved successfully", EmployerDTO.fromEntity(savedEmployer));
        } catch (Exception e) {
            log.error("Error creating/updating employer profile", e);
            return ApiResponse.error("Error saving employer profile: " + e.getMessage());
        }
    }

    public ApiResponse<EmployerDTO> getEmployerByUserId(Integer userId) {
        try {
            Optional<Employer> employerOptional = employerRepository.findByUser_Id(userId);

            if (employerOptional.isEmpty()) {
                return ApiResponse.error("Employer profile not found for user ID: " + userId);
            }

            return ApiResponse.success(EmployerDTO.fromEntity(employerOptional.get()));
        } catch (Exception e) {
            log.error("Error fetching employer by userId: {}", userId, e);
            return ApiResponse.error("Failed to retrieve employer profile");
        }
    }

    public ApiResponse<EmployerDTO> getEmployerById(Integer employerId) {
        try {
            Optional<Employer> employerOptional = employerRepository.findById(employerId);

            if (employerOptional.isEmpty()) {
                return ApiResponse.error("Employer profile not found for ID: " + employerId);
            }

            return ApiResponse.success(EmployerDTO.fromEntity(employerOptional.get()));
        } catch (Exception e) {
            log.error("Error fetching employer by ID: {}", employerId, e);
            return ApiResponse.error("Failed to retrieve employer profile");
        }
    }

    public ApiResponse<List<EmployerDTO>> getAllEmployers() {
        try {
            List<Employer> employers = employerRepository.findAll();
            List<EmployerDTO> employerDTOs = employers.stream()
                    .map(EmployerDTO::fromEntity)
                    .collect(Collectors.toList());

            return ApiResponse.success(employerDTOs);
        } catch (Exception e) {
            log.error("Error fetching all employers", e);
            return ApiResponse.error("Failed to retrieve employers list");
        }
    }

    public ApiResponse<Void> deleteEmployerProfile(Integer employerId) {
        try {
            if (!employerRepository.existsById(employerId)) {
                return ApiResponse.error("Employer profile not found for ID: " + employerId);
            }

            employerRepository.deleteById(employerId);

            return ApiResponse.success("Employer profile deleted successfully");
        } catch (Exception e) {
            log.error("Error deleting employer profile: {}", employerId, e);
            return ApiResponse.error("Failed to delete employer profile");
        }
    }
}
