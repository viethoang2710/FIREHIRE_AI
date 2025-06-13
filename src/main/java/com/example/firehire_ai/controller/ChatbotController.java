package com.example.firehire_ai.controller;

import com.example.firehire_ai.dto.ChatbotRequest;
import com.example.firehire_ai.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chatbot")
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    @PostMapping("/ask")
    public ResponseEntity<?> askBot(@RequestBody ChatbotRequest request) {
        return chatbotService.respondToQuestion(request);
    }
}
