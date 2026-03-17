package com.asstore.auth.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.asstore.auth.dto.AuthRequest;
import com.asstore.auth.dto.AuthResponse;
import com.asstore.auth.dto.RegisterRequest;
import com.asstore.auth.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }
    
    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Uncomment if using method security
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        authService.updateUser(id, updates);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody RegisterRequest req) {
        authService.register(req);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest req) {
        AuthResponse resp = authService.login(req);
        return ResponseEntity.ok(resp);
    }
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody String refreshToken) {
        AuthResponse resp = authService.refresh(refreshToken);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody String refreshToken) {
        authService.logout(refreshToken);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader("Authorization") String authHeader) {
        // Extract JWT from header
        String token = authHeader.replace("Bearer ", "");
        String userId = authService.getUserIdFromToken(token);
        return ResponseEntity.ok(authService.getUserInfo(userId));
    }
    
    @GetMapping("/users/count")
    public ResponseEntity<Long> getUserCount() {
        return ResponseEntity.ok(authService.getUserCount());
    }
    
    @PutMapping("/users/update/{id}")
    public ResponseEntity<?> editUser(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        authService.editUser(id, updates);
        return ResponseEntity.ok().build();
    }
}
