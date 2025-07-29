package com.example.firehire_ai.service;

import com.example.firehire_ai.dto.request.CVTemplateRequest;
import com.example.firehire_ai.dto.response.ApiResponse;
import com.example.firehire_ai.dto.response.CVTemplateDTO;
import com.example.firehire_ai.entity.CVTemplate;
import com.example.firehire_ai.entity.User;
import com.example.firehire_ai.repository.CVTemplateRepository;
import com.example.firehire_ai.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CVTemplateService {

    @Autowired
    private CVTemplateRepository cvTemplateRepository;

    @Autowired
    private UserRepository userRepository;

    public ApiResponse<CVTemplateDTO> createTemplate(CVTemplateRequest request) {
        try {
            User creator = null;
            if (request.getCreatedById() != null) {
                Optional<User> userOptional = userRepository.findById(request.getCreatedById());
                if (userOptional.isPresent()) {
                    creator = userOptional.get();
                }
            }

            CVTemplate template = CVTemplate.builder()
                    .name(request.getName())
                    .description(request.getDescription())
                    .previewURL(request.getPreviewURL())
                    .createdBy(creator)
                    .build();

            template = cvTemplateRepository.save(template);

            return ApiResponse.success("CV template created successfully", CVTemplateDTO.fromEntity(template));
        } catch (Exception e) {
            return ApiResponse.<CVTemplateDTO>error("Failed to create CV template: " + e.getMessage());
        }
    }

    public ApiResponse<List<CVTemplateDTO>> getAllTemplates() {
        List<CVTemplate> templates = cvTemplateRepository.findAll();

        List<CVTemplateDTO> templateDTOs = templates.stream()
                .map(CVTemplateDTO::fromEntity)
                .collect(Collectors.toList());

        return ApiResponse.success(templateDTOs);
    }

    public ApiResponse<CVTemplateDTO> getTemplateById(Integer templateId) {
        Optional<CVTemplate> templateOptional = cvTemplateRepository.findById(templateId);

        if (templateOptional.isEmpty()) {
            return ApiResponse.<CVTemplateDTO>error("CV template not found");
        }

        return ApiResponse.success(CVTemplateDTO.fromEntity(templateOptional.get()));
    }

    public ApiResponse<List<CVTemplateDTO>> getTemplatesByCreator(Integer userId) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isEmpty()) {
            return ApiResponse.<List<CVTemplateDTO>>error("User not found");
        }

        List<CVTemplate> templates = cvTemplateRepository.findByCreatedBy(userOptional.get());

        List<CVTemplateDTO> templateDTOs = templates.stream()
                .map(CVTemplateDTO::fromEntity)
                .collect(Collectors.toList());

        return ApiResponse.success(templateDTOs);
    }

    public ApiResponse<CVTemplateDTO> updateTemplate(Integer templateId, CVTemplateRequest request) {
        try {
            Optional<CVTemplate> templateOptional = cvTemplateRepository.findById(templateId);

            if (templateOptional.isEmpty()) {
                return ApiResponse.<CVTemplateDTO>error("CV template not found");
            }

            CVTemplate template = templateOptional.get();
            template.setName(request.getName());
            template.setDescription(request.getDescription());
            template.setPreviewURL(request.getPreviewURL());

            template = cvTemplateRepository.save(template);

            return ApiResponse.success("CV template updated successfully", CVTemplateDTO.fromEntity(template));
        } catch (Exception e) {
            return ApiResponse.<CVTemplateDTO>error("Failed to update CV template: " + e.getMessage());
        }
    }

    public ApiResponse<Void> deleteTemplate(Integer templateId) {
        if (!cvTemplateRepository.existsById(templateId)) {
            return ApiResponse.<Void>error("CV template not found");
        }

        cvTemplateRepository.deleteById(templateId);

        return ApiResponse.success("CV template deleted successfully");
    }
}
