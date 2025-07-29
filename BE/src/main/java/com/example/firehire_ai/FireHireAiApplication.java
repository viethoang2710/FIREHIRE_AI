package com.example.firehire_ai;

import com.example.firehire_ai.entity.User;
import com.example.firehire_ai.entity.User.UserRole;
import com.example.firehire_ai.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@ComponentScan({ "com.example.firehire_ai", "com.example.firehire_ai.security" })
@EntityScan({ "com.example.firehire_ai.entity", "com.example.firehire_ai.model" })
@EnableJpaRepositories("com.example.firehire_ai.repository")
public class FireHireAiApplication {

	public static void main(String[] args) {
		SpringApplication.run(FireHireAiApplication.class, args);
	}

	// Tạo tài khoản admin mặc định khi app khởi chạy
	@Bean
	public CommandLineRunner initAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (!userRepository.existsByEmail("admin@firehire.com")) {
				User admin = User.builder()
						.fullName("Super Admin")
						.email("admin@firehire.com")
						.phoneNumber("0123456789")
						.passwordHash(passwordEncoder.encode("admin123@")) // hash password
						.role(UserRole.ADMIN)
						.build();
				userRepository.save(admin);
				System.out.println("Admin created: admin@firehire.com / admin123@");
			} else {
				System.out.println("Admin already exists.");
			}
		};
	}
}
