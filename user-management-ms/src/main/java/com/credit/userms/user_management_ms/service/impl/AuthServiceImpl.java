package com.credit.userms.user_management_ms.service.impl;

import com.credit.userms.user_management_ms.dto.JwtResponse;
import com.credit.userms.user_management_ms.dto.LoginRequest;
import com.credit.userms.user_management_ms.entity.User;
import com.credit.userms.user_management_ms.repository.UserRepository;
import com.credit.userms.user_management_ms.service.auth.AuthService;
import com.credit.userms.user_management_ms.service.auth.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public JwtResponse login(LoginRequest request) {



        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));


        // 2) Password match?
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // 3) Generate JWT
        String token = jwtUtil.generateToken(user.getEmail());

        return JwtResponse.builder()
                .token(token)
                .email(user.getEmail())
                .build();
    }
}