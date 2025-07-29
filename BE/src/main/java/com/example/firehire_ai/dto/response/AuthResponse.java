package com.example.firehire_ai.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthResponse {
    private Integer userId;
    private String fullName;
    private String email;
    private String password;

    private String role; // Thay đổi từ enum thành String

    private String token;
    private String companyName;
    private String website;
    private String description;
}
