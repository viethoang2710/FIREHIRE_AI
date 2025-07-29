package com.example.firehire_ai.controller;

import com.example.firehire_ai.dto.request.SkillTagRequest;
import com.example.firehire_ai.dto.response.ApiResponse;
import com.example.firehire_ai.dto.response.SkillTagDTO;
import com.example.firehire_ai.service.SkillTagService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin(origins = "*")
public class SkillTagController {

    @Autowired
    private SkillTagService skillTagService;

    @PostMapping
    public ResponseEntity<ApiResponse<SkillTagDTO>> createSkillTag(@Valid @RequestBody SkillTagRequest request) {
        ApiResponse<SkillTagDTO> response = skillTagService.createSkillTag(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SkillTagDTO>>> getAllSkillTags() {
        ApiResponse<List<SkillTagDTO>> response = skillTagService.getAllSkillTags();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{skillId}")
    public ResponseEntity<ApiResponse<SkillTagDTO>> getSkillTagById(@PathVariable Integer skillId) {
        ApiResponse<SkillTagDTO> response = skillTagService.getSkillTagById(skillId);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<ApiResponse<SkillTagDTO>> getSkillTagByName(@PathVariable String name) {
        ApiResponse<SkillTagDTO> response = skillTagService.getSkillTagByName(name);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{skillId}")
    public ResponseEntity<ApiResponse<Void>> deleteSkillTag(@PathVariable Integer skillId) {
        ApiResponse<Void> response = skillTagService.deleteSkillTag(skillId);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}
