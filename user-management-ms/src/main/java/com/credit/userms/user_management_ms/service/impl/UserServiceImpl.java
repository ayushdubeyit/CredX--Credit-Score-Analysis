package com.credit.userms.user_management_ms.service.impl;
import com.credit.userms.user_management_ms.entity.User;
import com.credit.userms.user_management_ms.dto.RegisterRequest;
import com.credit.userms.user_management_ms.dto.UserResponse;
import com.credit.userms.user_management_ms.entity.User;
import com.credit.userms.user_management_ms.repository.UserRepository;
import com.credit.userms.user_management_ms.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse register(RegisterRequest request) {



        // 1) email already use ho to error
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use: " + request.getEmail());
        }





        String Hashed = passwordEncoder.encode(request.getPassword());

        // 2) DTO -> Entity
        User user = User.builder()
                .fullName(request.getFullName())   // << yahan ab value aayegi
                .email(request.getEmail())
                .password(Hashed)   // (later: encode password)
                .build();

        // 3) DB me save
        User saved = userRepository.save(user);

        // 4) Entity -> Response DTO
        return UserResponse.builder()
                .id(saved.getId())
                .fullName(saved.getFullName())
                .email(saved.getEmail())
                .build();
    }



    @Override
    public User findById(Long userId) {
        return  userRepository.findById(userId)
                .orElseThrow(()-> new RuntimeException("User Not Found!"));
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException(" UserEmail Not Found!"));
    }


}