package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.example.demo.dtos.UserLoginRequest;
import com.example.demo.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/api") //prefix all endpoints with /api
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginRequest loginRequest){
        Optional<User> userOpt=userRepository.findByName(loginRequest.getName());

        if(userOpt.isPresent()){
            User user = userOpt.get();
            if(user.getPassword().equals(loginRequest.getPassword())){
                String token=JwtUtil.generateToken(user.getName());
                return ResponseEntity.ok(Map.of("token",token, "role",user.getRole().getName()));
            }
        }
        return ResponseEntity.status(401).body("Invalid username or password");
    }
}
