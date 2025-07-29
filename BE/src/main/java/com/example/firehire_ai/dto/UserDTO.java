package com.example.firehire_ai.dto;

import com.example.firehire_ai.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Integer id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private User.UserRole role;
    private String createdAt;

    // Static method to convert User entity to UserDTO
    public static UserDTO fromEntity(User user) {
        if (user == null)
            return null;

        return UserDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .createdAt(user.getCreatedAt().toString())
                .build();
    }
}
