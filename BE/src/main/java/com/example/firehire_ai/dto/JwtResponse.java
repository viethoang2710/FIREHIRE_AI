package com.example.firehire_ai.dto;

import com.example.firehire_ai.entity.User;
import com.example.firehire_ai.entity.User.UserRole;

public class JwtResponse {
    private String token;
    private String role;
    private String message;
    private String companyName;
    private String website;
    private String description;

    public JwtResponse(String token, UserRole userRole) {
        this.token = token;
        if (userRole != null) {
            this.role = userRole.toString();
        }
    }

    public JwtResponse(String token, String roleOrMessage) {
        this.token = token;
        if (roleOrMessage != null && (roleOrMessage.equals("CANDIDATE") || roleOrMessage.equals("EMPLOYER") || roleOrMessage.equals("ADMIN"))) {
            this.role = roleOrMessage;
        } else {
            this.message = roleOrMessage;
        }
    }

    public JwtResponse(String token, String role, String message) {
        this.token = token;
        this.role = role;
        this.message = message;
    }

    public JwtResponse(String token, User user) {
        this.token = token;
        if (user != null && user.getRole() != null) {
            this.role = user.getRole().toString();
        }
    }

    public JwtResponse(String token, UserRole role, String companyName, String website, String description) {
        this.token = token;
        this.role = role.toString();
        this.companyName = companyName;
        this.website = website;
        this.description = description;
    }

    // Getters and Setters

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
