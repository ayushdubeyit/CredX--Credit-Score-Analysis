package com.credit.userms.user_management_ms.dto;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JwtResponse {
    private String token;
    private String email;
}
