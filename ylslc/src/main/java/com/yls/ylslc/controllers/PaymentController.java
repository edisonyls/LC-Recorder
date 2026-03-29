package com.yls.ylslc.controllers;

import com.yls.ylslc.config.response.Response;
import com.yls.ylslc.user.UserEntity;
import com.yls.ylslc.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "api/payment")
@CrossOrigin(origins = { "https://ylslc.edisonyls.com", "http://localhost:3000" })
public class PaymentController {
    private final UserService userService;
    private final List<String> validRoles = Arrays.asList("REGULAR", "PREMIUM", "PREPLUS");
    private final List<String> upgradeRoles = Arrays.asList("PREMIUM", "PREPLUS");

    @Value("${payment.secret-key}")
    private String paymentSecretKey;

    @PostMapping
    public Response processPayment(@RequestParam String currentRole,
            @RequestParam String upgradeRole) {
        UserEntity user = userService.getCurrentUser();
        if (!user.getRole().toString().equals(currentRole)) {
            return Response.failed(HttpStatus.BAD_REQUEST, "Provided currentRole does not match!");
        }
        if (!validRoles.contains(currentRole)) {
            return Response.failed(HttpStatus.BAD_REQUEST, "Invalid current role provided.");
        }

        // Validate upgrade role
        if (!upgradeRoles.contains(upgradeRole)) {
            return Response.failed(HttpStatus.BAD_REQUEST, "Invalid upgrade role provided.");
        }

        // Check if the upgrade is valid
        if (currentRole.equals(upgradeRole)) {
            return Response.failed(HttpStatus.BAD_REQUEST, "User is already in the requested role.");
        } else if (currentRole.equals("PREMIUM") && upgradeRole.equals("REGULAR")) {
            return Response.failed(HttpStatus.BAD_REQUEST, "Downgrade is not allowed.");
        } else if (currentRole.equals("PREPLUS") && (upgradeRole.equals("REGULAR") || upgradeRole.equals("PREMIUM"))) {
            return Response.failed(HttpStatus.BAD_REQUEST, "Downgrade is not allowed.");
        }

        // Simulate role upgrade
        // In a real-world scenario, you would update the user's role in the database
        userService.updateUserRole(user.getId(), upgradeRole);

        return Response.ok("Payment successful! User role updated to " + upgradeRole);
    }

    @PostMapping("upgrade-admin")
    public Response upgradeToAdmin(UUID userId) {
        UserEntity user = userService.getCurrentUser();
        if (!user.getRole().toString().equals("ADMIN"))
            return Response.failed(HttpStatus.BAD_REQUEST, "This action can only be performed by admin.");
        userService.updateUserRole(userId, "ADMIN");
        return Response.ok("Upgrade user <" + userId + "> to admin!");
    }

    @PostMapping("verify")
    public Response verifyUpgradeSecret(@RequestParam String secretKey) {
        if (secretKey.equals(paymentSecretKey)) {
            return Response.ok("Secret key verified successfully!");
        } else {
            return Response.failed(HttpStatus.UNAUTHORIZED, "Invalid secret key provided.");
        }
    }

    @Autowired
    public PaymentController(UserService userService) {
        this.userService = userService;
    }
}
