package com.asstore.auth.service;

import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.access-token-expiration-minutes:15}")
    private long accessTokenMinutes;

    private Key key;

    @PostConstruct
    public void init() {
        key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateAccessToken(String subject, String username, java.util.List<String> roles) {
        Instant now = Instant.now();
        Date issuedAt = Date.from(now);
        Date expires = Date.from(now.plusSeconds(accessTokenMinutes * 60));
        return Jwts.builder()
                .setSubject(subject)
                .claim("username", username)
                .claim("roles", roles)
                .setIssuedAt(issuedAt)
                .setExpiration(expires)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
    public String getUserId(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
    

    public Claims validateToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
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
