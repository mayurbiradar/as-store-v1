package com.asstore.api.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.List;

@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String jwtSecret;

    private Key getKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public Claims validateToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String getUsername(String token) {
        Claims claims = validateToken(token);
        return claims.get("username", String.class);
    }

    public List<String> getRoles(String token) {
        Claims claims = validateToken(token);
        return claims.get("roles", List.class);
    }
}
