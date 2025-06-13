package com.example.firehire_ai.dto;

import lombok.Data;

@Data
public class RegisterCandidateRequest {
    private String fullName;
    private String email;
    private String password;
    private String phoneNumber;
}
