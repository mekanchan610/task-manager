package com.example.taskmanager.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.taskmanager.repo.UserRepository;
import com.example.taskmanager.model.User;
import com.example.taskmanager.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;

    @PostMapping("/register")
    public Map<String,String> register(@RequestBody Map<String,String> body) {
        String username = body.get("username");
        String password = body.get("password");
        if (userRepo.existsByUsername(username)) throw new RuntimeException("Username exists");
        User u = new User(); u.setUsername(username); u.setPassword(passwordEncoder.encode(password));
        userRepo.save(u);
        return Map.of("message","registered");
    }

    @PostMapping("/login")
    public Map<String,String> login(@RequestBody Map<String,String> body) {
        String username = body.get("username");
        String password = body.get("password");
        User u = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!passwordEncoder.matches(password, u.getPassword())) throw new RuntimeException("Invalid credentials");
        String token = jwtUtil.generateToken(username);
        return Map.of("token", token);
    }
}
