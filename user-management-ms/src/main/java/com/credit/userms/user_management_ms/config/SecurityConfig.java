package com.credit.userms.user_management_ms.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * SECURITY CONFIGURATION
 *
 * Yahan define karte hain:
 * 1. Kaun se URLs public hain (login, register)
 * 2. Kaun se URLs protected hain (token chahiye)
 * 3. JWT filter kahan lagana hai
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // 🆕 JWT Filter autowire karo
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // CSRF disable (REST API ke liye zaruri nahi)
                .csrf(csrf -> csrf.disable())

                // URL PERMISSIONS define karo
                .authorizeHttpRequests(auth -> auth

                        // ✅ PUBLIC URLs - Bina token ke accessible
                        .requestMatchers(
                                "/api/users/register",   // Registration
                                "/api/users/login",      // Login
                                "/h2-console/**"         // H2 database console
                        ).permitAll()

                        // 🔒 PROTECTED URLs - Token chahiye
                        .anyRequest().authenticated()
                )

                // SESSION MANAGEMENT
                // STATELESS = Server session store nahi karega
                // Har request mein token bhejni padegi
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // H2 Console ke liye (frame issue fix)
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))

                // 🔑 JWT FILTER ADD KARO)
                //...... UsernamePasswordAuthenticationFilter se PEHLE run hoga
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    /**
     * AUTHENTICATION MANAGER
     * Login time pe password verify karne ke liye
     */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }
}