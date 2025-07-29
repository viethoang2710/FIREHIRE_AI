package com.example.firehire_ai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterResponse {
    private String message;
    private String role; // Hoặc status
    private boolean success;
    private String email;

    public RegisterResponse(String message, String role) {
        this.message = message;
        this.role = role;
        this.success = !role.equals("error");
    }

    public RegisterResponse(String message, boolean success, String email) {
        this.message = message;
        this.success = success;
        this.email = email;
    }
}
