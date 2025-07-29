package com.example.firehire_ai.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "cv_analysis")
public class CVAnalysis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "score")
    private Integer score;

    @ElementCollection
    @CollectionTable(name = "cv_analysis_feedback", joinColumns = @JoinColumn(name = "analysis_id"))
    @Column(name = "feedback", columnDefinition = "TEXT")
    private List<String> feedback;

    @ElementCollection
    @CollectionTable(name = "cv_analysis_keywords", joinColumns = @JoinColumn(name = "analysis_id"))
    @Column(name = "keyword")
    private List<String> keywordsFound;

    @ElementCollection
    @CollectionTable(name = "cv_analysis_missing_sections", joinColumns = @JoinColumn(name = "analysis_id"))
    @Column(name = "missing_section")
    private List<String> missingSections;

    @ElementCollection
    @CollectionTable(name = "cv_analysis_suggestions", joinColumns = @JoinColumn(name = "analysis_id"))
    @Column(name = "suggestion", columnDefinition = "TEXT")
    private List<String> suggestions;

    @Column(name = "target_position")
    private String targetPosition;

    @Column(name = "analysis_date")
    private LocalDateTime analysisDate;

    @Column(name = "status")
    private String status;

    @Column(name = "cv_content", columnDefinition = "LONGTEXT")
    private String cvContent;

    // Constructors
    public CVAnalysis() {
        this.analysisDate = LocalDateTime.now();
        this.status = "COMPLETED";
    }

    public CVAnalysis(Integer userId, String fileName, Integer score,
            List<String> feedback, List<String> keywordsFound,
            List<String> missingSections, List<String> suggestions,
            String targetPosition, String cvContent) {
        this();
        this.userId = userId;
        this.fileName = fileName;
        this.score = score;
        this.feedback = feedback;
        this.keywordsFound = keywordsFound;
        this.missingSections = missingSections;
        this.suggestions = suggestions;
        this.targetPosition = targetPosition;
        this.cvContent = cvContent;
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

    public String getCvContent() {
        return cvContent;
    }

    public void setCvContent(String cvContent) {
        this.cvContent = cvContent;
    }
}
