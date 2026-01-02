package com.credit.userms.user_management_ms.service;


import com.credit.userms.user_management_ms.dto.RegisterRequest;
import com.credit.userms.user_management_ms.dto.UserResponse;
import com.credit.userms.user_management_ms.entity.User;

public interface UserService {

     UserResponse register(RegisterRequest request);

    User findById(Long userId);

    User findByEmail(String email);

}
