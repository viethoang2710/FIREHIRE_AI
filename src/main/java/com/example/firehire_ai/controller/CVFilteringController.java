package com.example.firehire_ai.controller;

import com.example.firehire_ai.service.CVFilteringService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/filter")
public class CVFilteringController {

    @Autowired
    private CVFilteringService cvFilteringService;

    @GetMapping("/job-postings/{id}/cvs")
    public ResponseEntity<?> filterCVs(
            @PathVariable Integer id,
            @RequestParam("keywords") String keywords
    ) {
        return cvFilteringService.filterCVsByKeywords(id, keywords);
    }
}
