package com.yls.ylslc.user.auth;

import com.yls.ylslc.config.jwt.JwtService;
import com.yls.ylslc.config.response.Response;
import com.yls.ylslc.user.UserRepository;
import com.yls.ylslc.user.UserEntity;
import com.yls.ylslc.user.Role;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public Response register(UserEntity request) {
        try {
            // Check for required fields
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                return Response.failed(HttpStatus.BAD_REQUEST, "Username is required!");
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return Response.failed(HttpStatus.BAD_REQUEST, "Password is required!");
            }
            
            // Check if user already exists
            if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                return Response.failed(HttpStatus.CONFLICT, "User registered before!");
            }
            
            UserEntity user = new UserEntity();
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setUsername(request.getUsername().trim());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            
            // Set default role if not provided
            user.setRole(request.getRole() != null ? request.getRole() : Role.REGULAR);
            user.setSex(request.getSex());
            user.setMobileNumber(request.getMobileNumber());
            user.setPersonalInfo(request.getPersonalInfo());
            
            user = userRepository.save(user);
            
            String token = jwtService.generateToken(user);
            return Response.ok(token, "User registered successfully!");
            
        } catch (Exception e) {
            // Log the actual error for debugging
            System.err.println("Registration error: " + e.getMessage());
            e.printStackTrace();
            return Response.failed(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Registration failed: " + e.getMessage());
        }
    }

    @Override
    public Response authenticate(UserEntity request) {
        try {
            // Check for required fields
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                return Response.failed(HttpStatus.BAD_REQUEST, "Username is required!");
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return Response.failed(HttpStatus.BAD_REQUEST, "Password is required!");
            }

            // Check if user exists
            UserEntity user = userRepository.findByUsername(request.getUsername().trim()).orElse(null);
            if (user == null) {
                return Response.failed(HttpStatus.UNAUTHORIZED, "User not found!");
            }

            // Try to authenticate
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername().trim(),
                            request.getPassword()));

            return Response.ok(jwtService.generateToken(user), "User authenticated successfully!");
            
        } catch (BadCredentialsException e) {
            // Handle the case where the password does not match
            System.err.println("Authentication failed for user: " + request.getUsername() + " - Bad credentials");
            return Response.failed(HttpStatus.UNAUTHORIZED, "Invalid username or password!");
        } catch (Exception e) {
            // Handle other authentication related exceptions
            System.err.println("Authentication error for user: " + request.getUsername() + " - " + e.getMessage());
            e.printStackTrace();
            return Response.failed(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Authentication failed: " + e.getMessage());
        }
    }

    // Helper method for debugging
    public UserEntity findUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }
}
