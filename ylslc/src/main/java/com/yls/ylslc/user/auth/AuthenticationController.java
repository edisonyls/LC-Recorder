package com.yls.ylslc.user.auth;

import com.yls.ylslc.config.response.Response;
import com.yls.ylslc.user.UserEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api/auth")
public class AuthenticationController {
    private AuthServiceImpl authServiceImpl;

    public AuthenticationController(AuthServiceImpl authServiceImpl) {
        this.authServiceImpl = authServiceImpl;
    }

    @GetMapping(path="/authenticate/health")
    public String healthCheck(){
        return "OK";
    }

    @PostMapping(path = "/register")
    public Response register(@RequestBody UserEntity request){
        return authServiceImpl.register(request);
    }

    @PostMapping(path = "/register/validate")
    public Response validateRegistration(@RequestBody UserEntity request){
        // Just validate the request without actually registering
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            return Response.failed(org.springframework.http.HttpStatus.BAD_REQUEST, "Username is required!");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return Response.failed(org.springframework.http.HttpStatus.BAD_REQUEST, "Password is required!");
        }
        return Response.ok("Registration data is valid");
    }

    @PostMapping(path = "/authenticate")
    public Response login(@RequestBody UserEntity request){
        return authServiceImpl.authenticate(request);
    }

    @PostMapping(path = "/authenticate/debug")
    public Response debugLogin(@RequestBody UserEntity request){
        // Debug endpoint to check if user exists and basic info
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            return Response.failed(org.springframework.http.HttpStatus.BAD_REQUEST, "Username is required!");
        }
        
        try {
            UserEntity user = authServiceImpl.findUserByUsername(request.getUsername().trim());
            if (user != null) {
                return Response.ok("User found: " + user.getUsername() + ", Role: " + user.getRole(), 
                    "User exists in database");
            } else {
                return Response.failed(org.springframework.http.HttpStatus.NOT_FOUND, "User not found!");
            }
        } catch (Exception e) {
            return Response.failed(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR, 
                "Error checking user: " + e.getMessage());
        }
    }
}
