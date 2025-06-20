package com.example.firehire_ai.dto;

import com.example.firehire_ai.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Integer id;
    private String email;
    private String fullName;
    private User.Role role;
    
    public JwtResponse(String token, User user) {
        this.token = token;
        this.id = user.getUserId();
        this.email = user.getEmail();
        this.fullName = user.getFullName();
        this.role = user.getRole();
    }
}
