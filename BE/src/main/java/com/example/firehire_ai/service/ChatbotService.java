package com.example.firehire_ai.service;

import com.example.firehire_ai.dto.ChatbotRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class ChatbotService {

    public ResponseEntity<?> respondToQuestion(ChatbotRequest request) {
        String question = request.getQuestion().toLowerCase();
        String answer;

        if (question.contains("cv")) {
            answer = "Bạn có thể tạo CV từ mẫu hoặc upload file PDF.";
        } else if (question.contains("tuyển dụng")) {
            answer = "Bạn có thể tìm kiếm bài tuyển dụng trong phần 'Việc Làm'.";
        } else {
            answer = "Xin lỗi, tôi chưa hiểu rõ. Vui lòng đặt câu hỏi rõ hơn.";
        }

        return ResponseEntity.ok(answer);
    }
}
