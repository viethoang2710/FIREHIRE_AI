package com.example.firehire_ai.controller;

import com.example.firehire_ai.service.CVService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/cvs")
public class CVController {

    @Autowired
    private CVService cvService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadCV(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") Integer userId,
            @RequestParam("title") String title,
            @RequestParam(value = "templateId", required = false) Integer templateId
    ) {
        return cvService.uploadCV(file, userId, title, templateId);
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyCVs(@RequestParam("userId") Integer userId) {
        return cvService.getMyCVs(userId);
    }
}
