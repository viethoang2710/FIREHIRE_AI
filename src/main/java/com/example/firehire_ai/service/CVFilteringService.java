package com.example.firehire_ai.service;

import com.example.firehire_ai.model.CVs;
import com.example.firehire_ai.repository.CVRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CVFilteringService {

    @Autowired
    private CVRepository cvRepository;

    public ResponseEntity<?> filterCVsByKeywords(Integer jobId, String keywords) {
        String[] keys = keywords.toLowerCase().split(",");

        List<CVs> allCVs = cvRepository.findAll();
        List<CVs> filtered = allCVs.stream()
                .filter(cv -> {
                    String text = cv.getTitle().toLowerCase();
                    for (String key : keys) {
                        if (text.contains(key.trim())) return true;
                    }
                    return false;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(filtered);
    }
}
