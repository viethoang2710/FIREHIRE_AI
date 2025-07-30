package com.example.firehire_ai.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class UserRoleConverter implements AttributeConverter<User.UserRole, String> {

    @Override
    public String convertToDatabaseColumn(User.UserRole attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.name().toLowerCase();
    }

    @Override
    public User.UserRole convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return User.UserRole.CANDIDATE; // default value
        }

        // Convert to uppercase to match enum values
        String upperData = dbData.toUpperCase();

        try {
            return User.UserRole.valueOf(upperData);
        } catch (IllegalArgumentException e) {
            // Handle unknown values by returning default
            System.err.println("Unknown role value in database: " + dbData + ", using CANDIDATE as default");
            return User.UserRole.CANDIDATE;
        }
    }
}
