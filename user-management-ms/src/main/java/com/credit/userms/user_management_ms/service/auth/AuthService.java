package com.credit.userms.user_management_ms.service.auth;

import com.credit.userms.user_management_ms.dto.JwtResponse;
import com.credit.userms.user_management_ms.dto.LoginRequest;

public interface AuthService {
    JwtResponse login(LoginRequest request);
}
