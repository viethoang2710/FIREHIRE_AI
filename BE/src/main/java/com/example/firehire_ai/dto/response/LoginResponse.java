package com.example.firehire_ai.dto.response;

import lombok.Data;

@Data
public class LoginResponse {
    private Integer userId;
    private String email;
    private String fullName;
    private String role;
    private String token;

    // Thêm thông tin công ty cho employer
    private String companyName;
    private String website;
    private String description;
}
