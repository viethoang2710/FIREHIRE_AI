package com.example.FireHireAI.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // Allow requests from the React development server
        config.addAllowedOrigin("http://localhost:3000");

        // Allow common HTTP methods
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("OPTIONS");

        // Allow all headers
        config.addAllowedHeader("*");

        // Allow credentials like cookies
        config.setAllowCredentials(true);

        source.registerCorsConfiguration("/api/**", config);
        return new CorsFilter(source);
    }
}
