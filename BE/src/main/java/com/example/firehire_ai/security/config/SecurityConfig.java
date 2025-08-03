package com.example.firehire_ai.security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;

import java.util.Arrays;
import java.util.Collections;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowCredentials(true);
                    config.setAllowedOriginPatterns(Collections.singletonList("*"));
                    config.setAllowedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Authorization"));
                    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
                    return config;
                }))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll() // Login, register
                        .requestMatchers("/api/applications/apply-with-cv").permitAll() // CV upload endpoint
                        .requestMatchers("/api/jobs/*/apply").permitAll() // Job apply endpoint
                        .requestMatchers("/api/jobs/**").permitAll() // Job listings (public access)
                        .requestMatchers("/admin/**").permitAll() // Admin endpoints
                        .requestMatchers("/employer/**").hasRole("EMPLOYER")
                        .requestMatchers("/candidate/**").hasRole("CANDIDATE")
                        .anyRequest().permitAll()) // Allow other endpoints for now
                .formLogin(form -> form.disable()) // Disable form login for API
                .httpBasic(basic -> basic.disable()); // Disable HTTP Basic for API

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
