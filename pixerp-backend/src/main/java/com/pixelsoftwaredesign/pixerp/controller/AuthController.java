package com.pixelsoftwaredesign.pixerp.controller;

import com.pixelsoftwaredesign.pixerp.dto.AuthResponse;
import com.pixelsoftwaredesign.pixerp.dto.LoginRequest;
import com.pixelsoftwaredesign.pixerp.dto.RegisterRequest;
import com.pixelsoftwaredesign.pixerp.entity.User;
import com.pixelsoftwaredesign.pixerp.security.JwtService;
import com.pixelsoftwaredesign.pixerp.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager, UserService userService,
                          JwtService jwtService, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwtToken = jwtService.generateToken(userDetails);

            User user = userService.getByEmail(request.getEmail());

            AuthResponse response = new AuthResponse(
                    jwtToken,
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole().name()
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

            if (request.getRole() != null) {
                user.setRole(User.Role.valueOf(request.getRole()));
            }

            User created = userService.create(user);

            Map<String, Object> claims = new HashMap<>();
            claims.put("role", created.getRole().name());
            String jwtToken = jwtService.generateToken(claims,
                    org.springframework.security.core.userdetails.User.withUsername(created.getEmail())
                            .password(created.getPasswordHash())
                            .authorities("ROLE_" + created.getRole().name())
                            .build());

            AuthResponse response = new AuthResponse(
                    jwtToken,
                    created.getId(),
                    created.getUsername(),
                    created.getEmail(),
                    created.getRole().name()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String jwt = authHeader.substring(7);
            String email = jwtService.extractUsername(jwt);
            User user = userService.getByEmail(email);

            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", user.getId());
            userInfo.put("username", user.getUsername());
            userInfo.put("email", user.getEmail());
            userInfo.put("role", user.getRole().name());
            userInfo.put("createdAt", user.getCreatedAt());

            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }
}
