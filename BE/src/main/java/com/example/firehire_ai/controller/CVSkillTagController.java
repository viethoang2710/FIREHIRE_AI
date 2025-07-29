package com.example.firehire_ai.controller;

import com.example.firehire_ai.dto.request.CVSkillTagRequest;
import com.example.firehire_ai.dto.response.ApiResponse;
import com.example.firehire_ai.dto.response.CVDTO;
import com.example.firehire_ai.service.CVSkillTagService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cv-skills")
@CrossOrigin(origins = "*")
public class CVSkillTagController {

    @Autowired
    private CVSkillTagService cvSkillTagService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CVDTO>> addSkillToCV(@Valid @RequestBody CVSkillTagRequest request) {
        ApiResponse<CVDTO> response = cvSkillTagService.addSkillToCV(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/remove")
    public ResponseEntity<ApiResponse<CVDTO>> removeSkillFromCV(@Valid @RequestBody CVSkillTagRequest request) {
        ApiResponse<CVDTO> response = cvSkillTagService.removeSkillFromCV(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}
