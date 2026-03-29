package com.yls.ylslc.user;

import com.yls.ylslc.config.response.Response;
import com.yls.ylslc.mappers.Mapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "api/user")
@CrossOrigin(origins = { "https://ylslc.edisonyls.com", "http://localhost:3000" })
public class UserController {
    private final UserService userService;

    private Mapper<UserEntity, UserDto> userMapper;

    @GetMapping("/all")
    public List<UserDto> getUsers() {
        List<UserEntity> users = userService.getUsers();
        return users.stream().map(userMapper::mapTo).collect(Collectors.toList());
    }

    @GetMapping(path = "/{id}")
    public Response getCurrentUserById(@PathVariable("id") UUID id) {
        UserEntity userEntity = userService.getCurrentUserById(id);
        UserDto userDto = userMapper.mapTo(userEntity);
        return Response.ok(userDto, "Current user retrieved successfully!");
    }

    @GetMapping
    public Response getCurrentUser() {
        UserEntity userEntity = userService.getCurrentUser();
        UserDto userDto = userMapper.mapTo(userEntity);
        return Response.ok(userDto, "Current user retrieved successfully!");
    }

    @GetMapping(path = "/find/{username}")
    public Response getUserByUsername(@PathVariable("username") String username) {
        Optional<UserEntity> foundUser = userService.findOneByUsername(username);
        return foundUser.map(userEntity -> {
            UserDto userDto = userMapper.mapTo(userEntity);
            return Response.ok(userDto, "User retrieved successfully!");
        }).orElse(
                Response.failed(HttpStatus.NOT_FOUND, "User <" + username + "> doesn't exist!"));
    }

    @DeleteMapping(path = "/{id}")
    public Response deleteUser(
            @PathVariable("id") UUID id,
            @RequestBody UserDto userDto) {
        Optional<UserEntity> foundUser = userService.findOneByUsername(userDto.getUsername());
        if (foundUser.isPresent()) {
            if (foundUser.get().getId().equals(id)) {
                return Response.failed(HttpStatus.BAD_REQUEST, "You can't delete yourself!");
            }
            if (foundUser.get().getRole().equals(Role.ADMIN)) {
                userService.delete(id);
                return Response.ok(null, "User with id <" + id + "> deleted successfully!");
            } else {
                return Response.failed(HttpStatus.BAD_REQUEST,
                        "Unauthorized action performed - need ADMIN permission!");
            }
        } else {
            return Response.failed(HttpStatus.BAD_REQUEST, "Action performed failed!");
        }
    }

    @PutMapping(path = "/{id}")
    public Response updateUser(
            @PathVariable("id") UUID id,
            @RequestBody UserDto userDto) {
        UserEntity userEntity = userMapper.mapFrom(userDto);
        UserEntity updatedUser = userService.updateUser(id, userEntity);
        return Response.ok(userMapper.mapTo(updatedUser),
                "User " + updatedUser.getUsername() + " updated successfully!");
    }

    private final List<String> validRoles = Arrays.asList("REGULAR", "PREMIUM", "PREPLUS");
    private final List<String> upgradeRoles = Arrays.asList("PREMIUM", "PREPLUS");

    @GetMapping("payment")
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

    @PostMapping("/payment/upgrade-admin")
    public Response upgradeToAdmin(UUID userId) {
        UserEntity user = userService.getCurrentUser();
        if (!user.getRole().toString().equals("ADMIN"))
            return Response.failed(HttpStatus.BAD_REQUEST, "This action can only be performed by admin.");
        userService.updateUserRole(userId, "ADMIN");
        return Response.ok("Upgrade user <" + userId + "> to admin!");
    }

    public UserController(UserService userService, Mapper<UserEntity, UserDto> userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }
}
