package com.example.firehire_ai.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class DatabaseFixController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/check-column-type")
    public ResponseEntity<?> checkColumnType() {
        try (Connection conn = dataSource.getConnection()) {
            String query = """
                        SELECT
                            COLUMN_NAME,
                            DATA_TYPE,
                            CHARACTER_MAXIMUM_LENGTH,
                            COLUMN_TYPE
                        FROM INFORMATION_SCHEMA.COLUMNS
                        WHERE TABLE_SCHEMA = 'firehire_ai'
                        AND TABLE_NAME = 'user_profiles'
                        AND COLUMN_NAME = 'ProfilePicture'
                    """;

            PreparedStatement stmt = conn.prepareStatement(query);
            ResultSet rs = stmt.executeQuery();

            Map<String, Object> result = new HashMap<>();
            if (rs.next()) {
                result.put("columnName", rs.getString("COLUMN_NAME"));
                result.put("dataType", rs.getString("DATA_TYPE"));
                result.put("maxLength", rs.getString("CHARACTER_MAXIMUM_LENGTH"));
                result.put("columnType", rs.getString("COLUMN_TYPE"));
                result.put("needsFix", !rs.getString("COLUMN_TYPE").equals("longblob"));
            } else {
                result.put("error", "Column not found");
            }

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", result,
                    "message", "Column type check completed"));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", "Failed to check column type: " + e.getMessage()));
        }
    }

    @PostMapping("/fix-profile-picture-column")
    public ResponseEntity<?> fixProfilePictureColumn() {
        try (Connection conn = dataSource.getConnection()) {

            Map<String, Object> steps = new HashMap<>();

            // Step 1: Check current column type
            String checkQuery = """
                        SELECT COLUMN_TYPE
                        FROM INFORMATION_SCHEMA.COLUMNS
                        WHERE TABLE_SCHEMA = 'firehire_ai'
                        AND TABLE_NAME = 'user_profiles'
                        AND COLUMN_NAME = 'ProfilePicture'
                    """;

            PreparedStatement checkStmt = conn.prepareStatement(checkQuery);
            ResultSet rs = checkStmt.executeQuery();

            String currentType = "";
            if (rs.next()) {
                currentType = rs.getString("COLUMN_TYPE");
                steps.put("step1_currentType", currentType);
            }

            // Step 2: Fix the column if needed
            if (!currentType.equals("longblob")) {
                String alterQuery = "ALTER TABLE user_profiles MODIFY COLUMN ProfilePicture LONGBLOB";
                PreparedStatement alterStmt = conn.prepareStatement(alterQuery);
                alterStmt.executeUpdate();
                steps.put("step2_alterColumn", "SUCCESS - Changed to LONGBLOB");

                // Step 3: Also fix related columns
                String alterFileNameQuery = "ALTER TABLE user_profiles MODIFY COLUMN PictureFileName VARCHAR(500)";
                PreparedStatement alterFileNameStmt = conn.prepareStatement(alterFileNameQuery);
                alterFileNameStmt.executeUpdate();
                steps.put("step3_alterFileName", "SUCCESS - Changed to VARCHAR(500)");

                String alterFileSizeQuery = "ALTER TABLE user_profiles MODIFY COLUMN PictureFileSize BIGINT";
                PreparedStatement alterFileSizeStmt = conn.prepareStatement(alterFileSizeQuery);
                alterFileSizeStmt.executeUpdate();
                steps.put("step4_alterFileSize", "SUCCESS - Changed to BIGINT");

            } else {
                steps.put("step2_alterColumn", "SKIPPED - Already LONGBLOB");
            }

            // Step 4: Verify the fix
            PreparedStatement verifyStmt = conn.prepareStatement(checkQuery);
            ResultSet verifyRs = verifyStmt.executeQuery();

            if (verifyRs.next()) {
                String newType = verifyRs.getString("COLUMN_TYPE");
                steps.put("step5_verify", "SUCCESS - New type: " + newType);
            }

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "steps", steps,
                    "message", "Profile picture column fixed successfully"));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", "Failed to fix column: " + e.getMessage()));
        }
    }

    @PostMapping("/force-fix-both-columns")
    public ResponseEntity<Map<String, Object>> forceFixBothColumns() {
        try {
            Connection conn = dataSource.getConnection();
            Map<String, Object> steps = new HashMap<>();

            // Fix ProfilePicture (Pascal case)
            try {
                String alterQuery1 = "ALTER TABLE user_profiles MODIFY COLUMN ProfilePicture LONGBLOB";
                PreparedStatement alterStmt1 = conn.prepareStatement(alterQuery1);
                alterStmt1.executeUpdate();
                steps.put("fix_ProfilePicture", "SUCCESS");
            } catch (Exception e) {
                steps.put("fix_ProfilePicture", "ERROR: " + e.getMessage());
            }

            // Fix profile_picture (snake case)
            try {
                String alterQuery2 = "ALTER TABLE user_profiles MODIFY COLUMN profile_picture LONGBLOB";
                PreparedStatement alterStmt2 = conn.prepareStatement(alterQuery2);
                alterStmt2.executeUpdate();
                steps.put("fix_profile_picture", "SUCCESS");
            } catch (Exception e) {
                steps.put("fix_profile_picture", "ERROR: " + e.getMessage());
            }

            // Check which columns exist
            String checkQuery = "SELECT COLUMN_NAME, COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS " +
                    "WHERE TABLE_SCHEMA = 'firehire_ai' AND TABLE_NAME = 'user_profiles' " +
                    "AND (COLUMN_NAME = 'ProfilePicture' OR COLUMN_NAME = 'profile_picture')";
            PreparedStatement checkStmt = conn.prepareStatement(checkQuery);
            ResultSet rs = checkStmt.executeQuery();

            while (rs.next()) {
                String columnName = rs.getString("COLUMN_NAME");
                String columnType = rs.getString("COLUMN_TYPE");
                steps.put("verify_" + columnName, columnType);
            }

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "steps", steps,
                    "message", "Both column variations fixed"));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", "Failed to fix both columns: " + e.getMessage()));
        }
    }
}
