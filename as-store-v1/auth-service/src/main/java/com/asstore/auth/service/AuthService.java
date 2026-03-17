package com.asstore.auth.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.asstore.auth.domain.RefreshToken;
import com.asstore.auth.domain.Role;
import com.asstore.auth.domain.User;
import com.asstore.auth.dto.AuthRequest;
import com.asstore.auth.dto.AuthResponse;
import com.asstore.auth.dto.RegisterRequest;
import com.asstore.auth.repository.RefreshTokenRepository;
import com.asstore.auth.repository.RoleRepository;
import com.asstore.auth.repository.UserRepository;

@Service
public class AuthService {

	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final RefreshTokenRepository refreshTokenRepository;
	private final JwtService jwtService;
	private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

	public AuthService(UserRepository userRepository, RoleRepository roleRepository, RefreshTokenRepository refreshTokenRepository, JwtService jwtService) {
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
		this.refreshTokenRepository = refreshTokenRepository;
		this.jwtService = jwtService;
	}

	public AuthResponse login(AuthRequest req) {
		Optional<User> ou = userRepository.findByEmail(req.getEmail());
		if (ou.isEmpty()) throw new RuntimeException("Invalid credentials");
		User user = ou.get();
		if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) throw new RuntimeException("Invalid credentials");
		if (!user.isEnabled()) throw new RuntimeException("Account is disabled, please reach out to administrator");
		java.util.List<String> roles = user.getRoles().stream().map(Role::getName).toList();
		String access = jwtService.generateAccessToken(user.getId().toString(), user.getEmail(), roles);
		// create refresh token (simple random UUID stored as hashed value)
		String rtPlain = UUID.randomUUID().toString();
		RefreshToken rt = new RefreshToken();
		rt.setTokenHash(passwordEncoder.encode(rtPlain));
		rt.setUser(user);
		rt.setIssuedAt(Instant.now());
		rt.setExpiresAt(Instant.now().plus(30, ChronoUnit.DAYS));
		refreshTokenRepository.save(rt);
		return new AuthResponse(access, rtPlain);
	}

	public void register(RegisterRequest req) {
		if (userRepository.findByEmail(req.getEmail()).isPresent()) {
			throw new RuntimeException("Email exists");
		}

		User u = new User();
		u.setEmail(req.getEmail());
		u.setPassword(passwordEncoder.encode(req.getPassword()));
		u.setFirstName(req.getFirstName());
		u.setLastName(req.getLastName());
		u.setPhone(req.getPhone());
		u.setEnabled(true);

		// assign ROLE_USER
		Role role = roleRepository.findByName("ROLE_USER")
				.orElseGet(() -> {
					Role newRole = new Role();
					newRole.setName("ROLE_USER");
					return roleRepository.save(newRole);
				});

		u.getRoles().add(role);

		userRepository.save(u);
	}

	public AuthResponse refresh(String refreshToken) {
		Optional<RefreshToken> rtOpt = refreshTokenRepository.findAll().stream()
				.filter(rt -> passwordEncoder.matches(refreshToken.replaceAll("\"", ""), rt.getTokenHash()))
				.findFirst();
		if (rtOpt.isEmpty()) throw new RuntimeException("Invalid refresh token");
		RefreshToken rt = rtOpt.get();
		if(rt.getExpiresAt().isAfter(Instant.now())) {
			refreshTokenRepository.delete(rt);
			throw new RuntimeException("Session Expired, Please login again");
		}
		User user = rt.getUser();
		java.util.List<String> roles = user.getRoles().stream().map(Role::getName).toList();
		String access = jwtService.generateAccessToken(user.getId().toString(), user.getEmail(), roles);
		return new AuthResponse(access, refreshToken);
	}

	public void logout(String refreshToken) {
		List<RefreshToken> rtOpt = refreshTokenRepository.findAll().stream()
				.filter(rt -> passwordEncoder.matches(refreshToken.replaceAll("\"", ""), rt.getTokenHash()))
				.toList();

		if(rtOpt!=null && !rtOpt.isEmpty()) {
			refreshTokenRepository.deleteAll(rtOpt);
		}
	}
	public String getUserIdFromToken(String token) {
		return jwtService.getUserId(token);
	}

	public Object getUserInfo(String userId) {
		Optional<User> userOpt = userRepository.findById(UUID.fromString(userId));
		if (userOpt.isEmpty()) return null;
		User user = userOpt.get();
		// Return basic info and role
		return new Object() {
			public final String id = user.getId().toString();
			public final String email = user.getEmail();
			public final String firstName = user.getFirstName();
			public final String lastName = user.getLastName();
			public final String phone = user.getPhone();
			public final String role = user.getRoles().stream().findFirst().map(Role::getName).orElse("ROLE_USER");
		};
	}

	public void updateUser(String id, Map<String, Object> updates) {
		Optional<User> userOpt = userRepository.findById(UUID.fromString(id));
		if (userOpt.isEmpty()) throw new RuntimeException("User not found");
		User user = userOpt.get();
		if (updates.containsKey("email")) user.setEmail((String) updates.get("email"));
		if (updates.containsKey("firstName")) user.setFirstName((String) updates.get("firstName"));
		if (updates.containsKey("lastName")) user.setLastName((String) updates.get("lastName"));
		if (updates.containsKey("phone")) user.setPhone((String) updates.get("phone"));
		if (updates.containsKey("enabled")) user.setEnabled((Boolean) updates.get("enabled"));
		if (updates.containsKey("password")) user.setPassword(passwordEncoder.encode((String)updates.get("password")));
		if (updates.containsKey("role")) {
			String roleName = (String) updates.get("role");
			Role role = roleRepository.findByName(roleName)
					.orElseGet(() -> {
						Role newRole = new Role();
						newRole.setName(roleName);
						return roleRepository.save(newRole);
					});
			user.getRoles().clear();
			user.getRoles().add(role);
		}
		user.setUpdatedAt(Instant.now());
		userRepository.save(user);
	}

	public Long getUserCount() {
		return userRepository.count();
	}

	public Object getAllUsers() {
		userRepository.findAll().forEach(user -> {
			System.out.println("User: " + user.getEmail() + " Roles: " + user.getRoles().stream().map(Role::getName).toList());
		});
		return userRepository.findAll().stream().map(user -> new Object() {
			public final String id = user.getId().toString();
			public final String email = user.getEmail();
			public final String firstName = user.getFirstName();
			public final String lastName = user.getLastName();
			public final String phone = user.getPhone();
			public final boolean enabled = user.isEnabled();
			public final String role = user.getRoles().stream().findFirst().map(Role::getName).orElse("ROLE_USER");
		}).toList();
	}
	
	public void editUser(String id, Map<String, Object> updates) {
		Optional<User> userOpt = userRepository.findById(UUID.fromString(id));
		if (userOpt.isEmpty()) throw new RuntimeException("User not found");
		User user = userOpt.get();
		if (updates.containsKey("email")) user.setEmail((String) updates.get("email"));
		if (updates.containsKey("firstName")) user.setFirstName((String) updates.get("firstName"));
		if (updates.containsKey("lastName")) user.setLastName((String) updates.get("lastName"));
		if (updates.containsKey("phone")) user.setPhone((String) updates.get("phone"));
		user.setUpdatedAt(Instant.now());
		userRepository.save(user);
	}

}
