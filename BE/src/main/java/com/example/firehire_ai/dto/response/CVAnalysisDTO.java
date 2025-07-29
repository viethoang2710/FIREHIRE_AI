package com.example.firehire_ai.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class CVAnalysisDTO {
    private Integer id;
    private Integer userId;
    private String fileName;
    private Integer score;
    private List<String> feedback;
    private List<String> keywordsFound;
    private List<String> missingSections;
    private List<String> suggestions;
    private String targetPosition;
    private LocalDateTime analysisDate;
    private String status;

    // Constructors
    public CVAnalysisDTO() {
    }

    public CVAnalysisDTO(Integer id, Integer userId, String fileName, Integer score,
            List<String> feedback, List<String> keywordsFound,
            List<String> missingSections, List<String> suggestions,
            String targetPosition, LocalDateTime analysisDate, String status) {
        this.id = id;
        this.userId = userId;
        this.fileName = fileName;
        this.score = score;
        this.feedback = feedback;
        this.keywordsFound = keywordsFound;
        this.missingSections = missingSections;
        this.suggestions = suggestions;
        this.targetPosition = targetPosition;
        this.analysisDate = analysisDate;
        this.status = status;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public List<String> getFeedback() {
        return feedback;
    }

    public void setFeedback(List<String> feedback) {
        this.feedback = feedback;
    }

    public List<String> getKeywordsFound() {
        return keywordsFound;
    }

    public void setKeywordsFound(List<String> keywordsFound) {
        this.keywordsFound = keywordsFound;
    }

    public List<String> getMissingSections() {
        return missingSections;
    }

    public void setMissingSections(List<String> missingSections) {
        this.missingSections = missingSections;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
    }

    public String getTargetPosition() {
        return targetPosition;
    }

    public void setTargetPosition(String targetPosition) {
        this.targetPosition = targetPosition;
    }

    public LocalDateTime getAnalysisDate() {
        return analysisDate;
    }

    public void setAnalysisDate(LocalDateTime analysisDate) {
        this.analysisDate = analysisDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
