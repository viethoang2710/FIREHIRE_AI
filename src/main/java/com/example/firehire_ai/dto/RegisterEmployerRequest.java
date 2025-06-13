package com.example.firehire_ai.dto;

import lombok.Data;

@Data
public class RegisterEmployerRequest {
    private String fullName;
    private String email;
    private String password;
    private String companyName;
    private String website;
    private String description;
}
