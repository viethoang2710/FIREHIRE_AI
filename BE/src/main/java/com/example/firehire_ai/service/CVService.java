package com.example.firehire_ai.service;

import com.example.firehire_ai.entity.CV;
import com.example.firehire_ai.repository.CVRepository;
import com.example.firehire_ai.repository.CVTemplateRepository;
import com.example.firehire_ai.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class CVService {

    @Autowired
    private CVRepository cvRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CVTemplateRepository cvTemplateRepository;

    public ResponseEntity<?> uploadCV(MultipartFile file, Integer userId, String title, Integer templateId) {
        try {
            CV cv = new CV();
            cv.setUser(userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found")));
            cv.setTitle(title);
            cv.setPdfData(file.getBytes());
            cv.setTemplate(cvTemplateRepository.findById(templateId).orElseThrow(() -> new RuntimeException("Template not found")));
            cvRepository.save(cv);

            return ResponseEntity.ok("CV uploaded successfully.");
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("File upload failed.");
        }
    }

    public ResponseEntity<?> getMyCVs(Integer userId) {
        List<CV> cvs = cvRepository.findByUserUserId(userId);
        return ResponseEntity.ok(cvs);
    }
}
