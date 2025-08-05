package com.example.firehire_ai.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UpdateApplicantStatusRequest {

    @NotNull(message = "CV ID không được để trống")
    private Integer cvId;

    @NotBlank(message = "Trạng thái không được để trống")
    private String status;

    // Constructors
    public UpdateApplicantStatusRequest() {
    }

    public UpdateApplicantStatusRequest(Integer cvId, String status) {
        this.cvId = cvId;
        this.status = status;
    }

    // Getters and Setters
    public Integer getCvId() {
        return cvId;
    }

    public void setCvId(Integer cvId) {
        this.cvId = cvId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
