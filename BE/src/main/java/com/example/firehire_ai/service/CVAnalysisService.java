package com.example.firehire_ai.service;

import com.example.firehire_ai.dto.response.ApiResponse;
import com.example.firehire_ai.dto.response.CVAnalysisDTO;
import com.example.firehire_ai.entity.CVAnalysis;
import com.example.firehire_ai.repository.CVAnalysisRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class CVAnalysisService {

    @Autowired
    private CVAnalysisRepository cvAnalysisRepository;

    private static final Map<String, List<String>> INDUSTRY_KEYWORDS = new HashMap<>();
    private static final List<String> COMMON_CV_SECTIONS = Arrays.asList(
            "Thông tin cá nhân", "Mục tiêu nghề nghiệp", "Kinh nghiệm làm việc",
            "Học vấn", "Kỹ năng", "Chứng chỉ", "Dự án", "Ngôn ngữ");

    static {
        // Initialize industry keywords
        INDUSTRY_KEYWORDS.put("IT", Arrays.asList("Java", "Python", "JavaScript", "React", "Spring", "MySQL", "MongoDB",
                "Docker", "Kubernetes", "AWS", "Git"));
        INDUSTRY_KEYWORDS.put("Marketing", Arrays.asList("SEO", "SEM", "Google Analytics", "Facebook Ads",
                "Content Marketing", "Brand Management", "Digital Marketing"));
        INDUSTRY_KEYWORDS.put("Sales", Arrays.asList("CRM", "Salesforce", "Lead Generation", "B2B", "B2C",
                "Account Management", "Customer Relationship"));
        INDUSTRY_KEYWORDS.put("Finance", Arrays.asList("Excel", "Financial Analysis", "SAP", "ERP", "Accounting",
                "Budget", "Investment", "Risk Management"));
        INDUSTRY_KEYWORDS.put("HR", Arrays.asList("Recruitment", "Talent Acquisition", "HRIS", "Performance Management",
                "Training", "Employee Relations"));
    }

    public ApiResponse<CVAnalysisDTO> analyzeCV(MultipartFile file, String targetPosition) {
        try {
            String cvContent = extractTextFromFile(file);
            return analyzeCVContent(cvContent, file.getOriginalFilename(), targetPosition, null);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Không thể phân tích CV: " + e.getMessage(), null);
        }
    }

    public ApiResponse<CVAnalysisDTO> analyzeCVFromText(String cvText, String targetPosition) {
        return analyzeCVContent(cvText, "text_input.txt", targetPosition, null);
    }

    private ApiResponse<CVAnalysisDTO> analyzeCVContent(String cvContent, String fileName, String targetPosition,
            Integer userId) {
        try {
            // Analyze CV content
            CVAnalysisResult analysisResult = performCVAnalysis(cvContent, targetPosition);

            // Create analysis entity
            CVAnalysis analysis = new CVAnalysis(
                    userId,
                    fileName,
                    analysisResult.getScore(),
                    analysisResult.getFeedback(),
                    analysisResult.getKeywordsFound(),
                    analysisResult.getMissingSections(),
                    analysisResult.getSuggestions(),
                    targetPosition,
                    cvContent);

            // Save to database if userId is provided
            if (userId != null) {
                analysis = cvAnalysisRepository.save(analysis);
            }

            // Convert to DTO
            CVAnalysisDTO dto = convertToDTO(analysis);
            return new ApiResponse<>(true, "Phân tích CV thành công", dto);

        } catch (Exception e) {
            return new ApiResponse<>(false, "Có lỗi xảy ra khi phân tích CV: " + e.getMessage(), null);
        }
    }

    public ApiResponse<List<CVAnalysisDTO>> getAnalysisHistory(Integer userId) {
        try {
            List<CVAnalysis> analyses = cvAnalysisRepository.findByUserIdOrderByAnalysisDateDesc(userId);
            List<CVAnalysisDTO> dtos = analyses.stream()
                    .map(this::convertToDTO)
                    .toList();
            return new ApiResponse<>(true, "Lấy lịch sử phân tích thành công", dtos);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Không thể lấy lịch sử phân tích: " + e.getMessage(), null);
        }
    }

    private String extractTextFromFile(MultipartFile file) throws IOException {
        String contentType = file.getContentType();
        InputStream inputStream = file.getInputStream();

        if ("application/pdf".equals(contentType)) {
            return extractTextFromPDF(inputStream);
        } else if ("application/vnd.openxmlformats-officedocument.wordprocessingml.document".equals(contentType)) {
            return extractTextFromDOCX(inputStream);
        } else {
            throw new IllegalArgumentException("Unsupported file type: " + contentType);
        }
    }

    private String extractTextFromPDF(InputStream inputStream) throws IOException {
        try (PDDocument document = PDDocument.load(inputStream)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private String extractTextFromDOCX(InputStream inputStream) throws IOException {
        try (XWPFDocument document = new XWPFDocument(inputStream);
                XWPFWordExtractor extractor = new XWPFWordExtractor(document)) {
            return extractor.getText();
        }
    }

    private CVAnalysisResult performCVAnalysis(String cvContent, String targetPosition) {
        List<String> feedback = new ArrayList<>();
        List<String> keywordsFound = new ArrayList<>();
        List<String> missingSections = new ArrayList<>();
        List<String> suggestions = new ArrayList<>();
        int score = 0;

        // Basic content analysis
        if (cvContent.length() < 200) {
            feedback.add("CV quá ngắn. Hãy bổ sung thêm thông tin chi tiết về kinh nghiệm và kỹ năng.");
            score -= 20;
        } else {
            feedback.add("Độ dài CV phù hợp.");
            score += 10;
        }

        // Check for essential sections
        score += checkEssentialSections(cvContent, feedback, missingSections);

        // Check for keywords based on target position
        if (targetPosition != null && !targetPosition.trim().isEmpty()) {
            score += checkIndustryKeywords(cvContent, targetPosition, keywordsFound, feedback);
        }

        // Check for contact information
        if (hasContactInfo(cvContent)) {
            feedback.add("Thông tin liên hệ đầy đủ.");
            score += 10;
        } else {
            feedback.add("Thiếu thông tin liên hệ (email, số điện thoại).");
            missingSections.add("Thông tin liên hệ");
            score -= 10;
        }

        // Check for quantified achievements
        if (hasQuantifiedAchievements(cvContent)) {
            feedback.add("CV có các thành tích được định lượng cụ thể. Rất tốt!");
            score += 15;
        } else {
            suggestions
                    .add("Hãy thêm các số liệu cụ thể về thành tích (ví dụ: tăng doanh số 20%, quản lý team 5 người).");
            score -= 5;
        }

        // Grammar and spelling check (basic)
        score += checkGrammarAndSpelling(cvContent, feedback);

        // Generate suggestions
        generateSuggestions(suggestions, feedback, missingSections);

        // Ensure score is between 0 and 100
        score = Math.max(0, Math.min(100, score + 70)); // Base score of 70

        return new CVAnalysisResult(score, feedback, keywordsFound, missingSections, suggestions);
    }

    private int checkEssentialSections(String cvContent, List<String> feedback, List<String> missingSections) {
        int score = 0;
        String lowerContent = cvContent.toLowerCase();

        // Check for experience section
        if (lowerContent.contains("kinh nghiệm") || lowerContent.contains("experience")
                || lowerContent.contains("công việc")) {
            feedback.add("Có phần kinh nghiệm làm việc.");
            score += 15;
        } else {
            missingSections.add("Kinh nghiệm làm việc");
            feedback.add("Thiếu phần kinh nghiệm làm việc.");
        }

        // Check for education section
        if (lowerContent.contains("học vấn") || lowerContent.contains("education") || lowerContent.contains("trường")) {
            feedback.add("Có thông tin học vấn.");
            score += 10;
        } else {
            missingSections.add("Học vấn");
        }

        // Check for skills section
        if (lowerContent.contains("kỹ năng") || lowerContent.contains("skills") || lowerContent.contains("technical")) {
            feedback.add("Có phần kỹ năng.");
            score += 10;
        } else {
            missingSections.add("Kỹ năng");
        }

        return score;
    }

    private int checkIndustryKeywords(String cvContent, String targetPosition, List<String> keywordsFound,
            List<String> feedback) {
        int score = 0;
        String lowerContent = cvContent.toLowerCase();
        String lowerTarget = targetPosition.toLowerCase();

        // Determine industry based on target position
        String industry = determineIndustry(lowerTarget);
        List<String> relevantKeywords = INDUSTRY_KEYWORDS.getOrDefault(industry, new ArrayList<>());

        for (String keyword : relevantKeywords) {
            if (lowerContent.contains(keyword.toLowerCase())) {
                keywordsFound.add(keyword);
                score += 2;
            }
        }

        if (keywordsFound.size() > 0) {
            feedback.add("Tìm thấy " + keywordsFound.size() + " từ khóa liên quan đến ngành nghề.");
            score += 5;
        } else {
            feedback.add("Cần bổ sung từ khóa liên quan đến vị trí " + targetPosition + ".");
        }

        return Math.min(score, 20); // Cap at 20 points
    }

    private String determineIndustry(String targetPosition) {
        if (targetPosition.contains("developer") || targetPosition.contains("programmer") ||
                targetPosition.contains("software") || targetPosition.contains("it")) {
            return "IT";
        } else if (targetPosition.contains("marketing") || targetPosition.contains("brand")) {
            return "Marketing";
        } else if (targetPosition.contains("sales") || targetPosition.contains("business development")) {
            return "Sales";
        } else if (targetPosition.contains("finance") || targetPosition.contains("accounting")) {
            return "Finance";
        } else if (targetPosition.contains("hr") || targetPosition.contains("human resource")) {
            return "HR";
        }
        return "General";
    }

    private boolean hasContactInfo(String cvContent) {
        String lowerContent = cvContent.toLowerCase();
        Pattern emailPattern = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
        Pattern phonePattern = Pattern.compile("\\b\\d{3,4}[-.]?\\d{3,4}[-.]?\\d{3,4}\\b");

        return emailPattern.matcher(cvContent).find() && phonePattern.matcher(cvContent).find();
    }

    private boolean hasQuantifiedAchievements(String cvContent) {
        Pattern numberPattern = Pattern.compile("\\b\\d+%|\\b\\d+\\s*(triệu|million|k|nghìn|thousand)");
        return numberPattern.matcher(cvContent).find();
    }

    private int checkGrammarAndSpelling(String cvContent, List<String> feedback) {
        // Basic grammar check (this is simplified)
        int commonErrors = 0;
        String[] commonMistakes = { "tôi", "mình", "em", "anh", "chị" }; // Personal pronouns to avoid in CV

        for (String mistake : commonMistakes) {
            if (cvContent.toLowerCase().contains(" " + mistake + " ")) {
                commonErrors++;
            }
        }

        if (commonErrors == 0) {
            feedback.add("Không phát hiện lỗi ngữ pháp cơ bản.");
            return 5;
        } else {
            feedback.add("Phát hiện " + commonErrors + " lỗi ngữ pháp tiềm năng. Hãy kiểm tra lại.");
            return -2;
        }
    }

    private void generateSuggestions(List<String> suggestions, List<String> feedback, List<String> missingSections) {
        if (!missingSections.isEmpty()) {
            suggestions.add("Bổ sung các phần còn thiếu: " + String.join(", ", missingSections));
        }

        suggestions.add("Sử dụng động từ hành động mạnh mẽ (đạt được, phát triển, tối ưu hóa, dẫn dắt).");
        suggestions.add("Đảm bảo CV không quá 2 trang và có bố cục rõ ràng.");
        suggestions.add("Tùy chỉnh CV cho từng công việc ứng tuyển cụ thể.");
        suggestions.add("Kiểm tra kỹ lỗi chính tả và ngữ pháp trước khi gửi.");
    }

    private CVAnalysisDTO convertToDTO(CVAnalysis analysis) {
        return new CVAnalysisDTO(
                analysis.getId(),
                analysis.getUserId(),
                analysis.getFileName(),
                analysis.getScore(),
                analysis.getFeedback(),
                analysis.getKeywordsFound(),
                analysis.getMissingSections(),
                analysis.getSuggestions(),
                analysis.getTargetPosition(),
                analysis.getAnalysisDate(),
                analysis.getStatus());
    }

    // Inner class for analysis result
    private static class CVAnalysisResult {
        private final Integer score;
        private final List<String> feedback;
        private final List<String> keywordsFound;
        private final List<String> missingSections;
        private final List<String> suggestions;

        public CVAnalysisResult(Integer score, List<String> feedback, List<String> keywordsFound,
                List<String> missingSections, List<String> suggestions) {
            this.score = score;
            this.feedback = feedback;
            this.keywordsFound = keywordsFound;
            this.missingSections = missingSections;
            this.suggestions = suggestions;
        }

        public Integer getScore() {
            return score;
        }

        public List<String> getFeedback() {
            return feedback;
        }

        public List<String> getKeywordsFound() {
            return keywordsFound;
        }

        public List<String> getMissingSections() {
            return missingSections;
        }

        public List<String> getSuggestions() {
            return suggestions;
        }
    }
}
