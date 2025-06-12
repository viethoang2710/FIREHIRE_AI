package com.example.FireHireAI.Controller;

import com.example.FireHireAI.Models.User;
import com.example.FireHireAI.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with id: " + id);
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        if (userService.existsByEmail(user.getEmail())) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Email already in use");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        User savedUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        // Validate input fields
        if (user.getEmail() == null || user.getEmail().trim().isEmpty() ||
            user.getPassword() == null || user.getPassword().trim().isEmpty() ||
            user.getFirstName() == null || user.getFirstName().trim().isEmpty() ||
            user.getLastName() == null || user.getLastName().trim().isEmpty()) {

            Map<String, String> response = new HashMap<>();
            response.put("error", "Tất cả các trường bắt buộc phải được điền");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // Kiểm tra xem email đã tồn tại chưa
        if (userService.existsByEmail(user.getEmail())) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Email đã được sử dụng");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        try {
            // Lưu người dùng mới vào cơ sở dữ liệu MySQL
            User createdUser = userService.createUser(user);

            // Chuẩn bị đối tượng phản hồi (không bao gồm mật khẩu)
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("id", createdUser.getId());
            responseData.put("firstName", createdUser.getFirstName());
            responseData.put("lastName", createdUser.getLastName());
            responseData.put("email", createdUser.getEmail());
            responseData.put("createdAt", createdUser.getCreatedAt());
            responseData.put("message", "Đăng ký thành công");

            return ResponseEntity.status(HttpStatus.CREATED).body(responseData);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Lỗi đăng ký: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        Optional<User> existingUserOpt = userService.getUserById(id);
        if (existingUserOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with id: " + id);
        }

        User existingUser = existingUserOpt.get();
        existingUser.setFirstName(userDetails.getFirstName());
        existingUser.setLastName(userDetails.getLastName());
        existingUser.setEmail(userDetails.getEmail());

        // Chỉ cập nhật mật khẩu nếu có mật khẩu mới được cung cấp
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            existingUser.setPassword(userDetails.getPassword());
        }

        User updatedUser = userService.updateUser(existingUser);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with id: " + id);
        }

        userService.deleteUser(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User deleted successfully");
        return ResponseEntity.ok(response);
    }
}
