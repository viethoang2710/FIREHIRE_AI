package com.example.firehire_ai.service;

import com.example.firehire_ai.dto.request.CVSkillTagRequest;
import com.example.firehire_ai.dto.response.ApiResponse;
import com.example.firehire_ai.dto.response.CVDTO;
import com.example.firehire_ai.entity.CV;
import com.example.firehire_ai.entity.SkillTag;
import com.example.firehire_ai.repository.CVRepository;
import com.example.firehire_ai.repository.CVSkillTagRepository;
import com.example.firehire_ai.repository.SkillTagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class CVSkillTagService {

    @Autowired
    private CVRepository cvRepository;

    @Autowired
    private SkillTagRepository skillTagRepository;

    @Autowired
    private CVSkillTagRepository cvSkillTagRepository;

    public ApiResponse<CVDTO> addSkillToCV(CVSkillTagRequest request) {
        try {
            // Find CV
            Optional<CV> cvOptional = cvRepository.findById(request.getCvId());
            if (cvOptional.isEmpty()) {
                return ApiResponse.<CVDTO>error("CV not found");
            }

            // Find skill tag
            Optional<SkillTag> skillTagOptional = skillTagRepository.findById(request.getSkillId());
            if (skillTagOptional.isEmpty()) {
                return ApiResponse.<CVDTO>error("Skill tag not found");
            }

            CV cv = cvOptional.get();
            SkillTag skillTag = skillTagOptional.get();

            // Create a compatible ID for repository check
            com.example.firehire_ai.entity.CVSkillTagId entityId = new com.example.firehire_ai.entity.CVSkillTagId(
                    cv.getCvId(), skillTag.getSkillId());
            if (cvSkillTagRepository.existsById(entityId)) {
                return ApiResponse.<CVDTO>error("Skill tag already added to this CV");
            }

            // Create CV-Skill relationship in the entity package for repository
            com.example.firehire_ai.entity.CVSkillTag entityCvSkillTag = new com.example.firehire_ai.entity.CVSkillTag();
            entityCvSkillTag.setId(entityId);
            entityCvSkillTag.setCv(cv);
            entityCvSkillTag.setSkill(skillTag);

            // Save the relationship through the repository
            cvSkillTagRepository.save(entityCvSkillTag);
            cv.setUpdatedAt(LocalDateTime.now());
            cv = cvRepository.save(cv);

            return ApiResponse.success("Skill tag added to CV successfully", CVDTO.fromEntity(cv));
        } catch (Exception e) {
            return ApiResponse.<CVDTO>error("Failed to add skill tag to CV: " + e.getMessage());
        }
    }

    public ApiResponse<CVDTO> removeSkillFromCV(CVSkillTagRequest request) {
        try {
            // Find CV
            Optional<CV> cvOptional = cvRepository.findById(request.getCvId());
            if (cvOptional.isEmpty()) {
                return ApiResponse.<CVDTO>error("CV not found");
            }

            // Find skill tag
            Optional<SkillTag> skillTagOptional = skillTagRepository.findById(request.getSkillId());
            if (skillTagOptional.isEmpty()) {
                return ApiResponse.<CVDTO>error("Skill tag not found");
            }

            // Check if relationship exists
            // Create a compatible ID for repository check
            com.example.firehire_ai.entity.CVSkillTagId entityId = new com.example.firehire_ai.entity.CVSkillTagId(
                    request.getCvId(), request.getSkillId());
            Optional<com.example.firehire_ai.entity.CVSkillTag> cvSkillTagOptional = cvSkillTagRepository
                    .findById(entityId);
            if (cvSkillTagOptional.isEmpty()) {
                return ApiResponse.<CVDTO>error("Skill tag is not associated with this CV");
            }

            CV cv = cvOptional.get();
            com.example.firehire_ai.entity.CVSkillTag entityCvSkillTag = cvSkillTagOptional.get();

            // We need to find the equivalent entity skill tag in the cv's collection
            // Just delete it from the repository instead
            cvSkillTagRepository.delete(entityCvSkillTag);

            cv.setUpdatedAt(LocalDateTime.now());
            cv = cvRepository.save(cv);

            return ApiResponse.success("Skill tag removed from CV successfully", CVDTO.fromEntity(cv));
        } catch (Exception e) {
            return ApiResponse.<CVDTO>error("Failed to remove skill tag from CV: " + e.getMessage());
        }
    }
}
