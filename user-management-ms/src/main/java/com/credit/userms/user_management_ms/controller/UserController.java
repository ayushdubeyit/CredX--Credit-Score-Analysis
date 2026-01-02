package com.credit.userms.user_management_ms.controller;

import com.credit.userms.user_management_ms.dto.JwtResponse;
import com.credit.userms.user_management_ms.dto.LoginRequest;
import com.credit.userms.user_management_ms.dto.RegisterRequest;
import com.credit.userms.user_management_ms.dto.UserResponse;
import com.credit.userms.user_management_ms.entity.User;
import com.credit.userms.user_management_ms.service.UserService;
import com.credit.userms.user_management_ms.service.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    @PostMapping("/register")
    public UserResponse registerUser(@RequestBody RegisterRequest request) {
        return userService.register(request);
    }

    @PostMapping("/login")
    public JwtResponse login(@RequestBody LoginRequest request){
        return authService.login(request);
    }

    @GetMapping("/{userId}")
    public UserResponse getUserById(@PathVariable Long userId){

        User user = userService.findById(userId);
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .build();
    }



}