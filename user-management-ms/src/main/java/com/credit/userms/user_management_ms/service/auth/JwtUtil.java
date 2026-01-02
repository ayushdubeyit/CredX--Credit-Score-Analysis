package com.credit.userms.user_management_ms.service.auth;

import com.credit.userms.user_management_ms.config.JwtAuthenticationFilter;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {



    private final String secret = "Zm9yZGV2LXNlY3JldC1wbGVhc2UtY2hhbmdlLWF0LWxlYXN0LTI1Ni1iaXRzIQ==";// minimum 32 chars for HS256
    private final long jwtExpirationMs = 1000 * 60 * 60; // 1 hour

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // ---------- GENERATE TOKEN ----------
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ---------- EXTRACT USERNAME ----------
    public String getUsernameFromToken(String token) {
        return extractAllClaims(token).getSubject();
    }

    public String extractUsername(String token) {
        return getUsernameFromToken(token);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // ---------- VALIDATE TOKEN ----------
    public boolean validateToken(String token, String username) {
        try {
            Claims claims = extractAllClaims(token);

            // Username match check
            String tokenUsername = claims.getSubject();

            // Expiry check
            Date expiration = claims.getExpiration();
            boolean isExpired = expiration.before(new Date());

            // Dono conditions pass honi chahiye
            return tokenUsername.equals(username) && !isExpired;

        } catch (Exception ex) {
            System.out.println("Token validation failed: " + ex.getMessage());
            return false;
        }
    }
}