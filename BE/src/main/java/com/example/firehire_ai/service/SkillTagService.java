package com.example.firehire_ai.service;

import com.example.firehire_ai.dto.request.SkillTagRequest;
import com.example.firehire_ai.dto.response.ApiResponse;
import com.example.firehire_ai.dto.response.SkillTagDTO;
import com.example.firehire_ai.entity.SkillTag;
import com.example.firehire_ai.repository.SkillTagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SkillTagService {

    @Autowired
    private SkillTagRepository skillTagRepository;

    public ApiResponse<SkillTagDTO> createSkillTag(SkillTagRequest request) {
        try {
            // Check if skill tag already exists
            Optional<SkillTag> existingSkillTag = skillTagRepository.findByName(request.getName());

            if (existingSkillTag.isPresent()) {
                return ApiResponse.<SkillTagDTO>error("Skill tag already exists");
            }

            // Create new skill tag
            SkillTag skillTag = SkillTag.builder()
                    .name(request.getName())
                    .build();

            skillTag = skillTagRepository.save(skillTag);

            return ApiResponse.success("Skill tag created successfully", SkillTagDTO.fromEntity(skillTag));
        } catch (Exception e) {
            return ApiResponse.<SkillTagDTO>error("Failed to create skill tag: " + e.getMessage());
        }
    }

    public ApiResponse<List<SkillTagDTO>> getAllSkillTags() {
        List<SkillTag> skillTags = skillTagRepository.findAll();

        List<SkillTagDTO> skillTagDTOs = skillTags.stream()
                .map(SkillTagDTO::fromEntity)
                .collect(Collectors.toList());

        return ApiResponse.success(skillTagDTOs);
    }

    public ApiResponse<SkillTagDTO> getSkillTagById(Integer skillId) {
        Optional<SkillTag> skillTagOptional = skillTagRepository.findById(skillId);

        if (skillTagOptional.isEmpty()) {
            return ApiResponse.<SkillTagDTO>error("Skill tag not found");
        }

        return ApiResponse.success(SkillTagDTO.fromEntity(skillTagOptional.get()));
    }

    public ApiResponse<SkillTagDTO> getSkillTagByName(String name) {
        Optional<SkillTag> skillTagOptional = skillTagRepository.findByName(name);

        if (skillTagOptional.isEmpty()) {
            return ApiResponse.<SkillTagDTO>error("Skill tag not found");
        }

        return ApiResponse.success(SkillTagDTO.fromEntity(skillTagOptional.get()));
    }

    public ApiResponse<Void> deleteSkillTag(Integer skillId) {
        if (!skillTagRepository.existsById(skillId)) {
            return ApiResponse.<Void>error("Skill tag not found");
        }

        skillTagRepository.deleteById(skillId);

        return ApiResponse.success("Skill tag deleted successfully");
    }
}
