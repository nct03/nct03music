package com.nctcompany.nct03.controller;

import com.nctcompany.nct03.constant.SecurityConstants;
import com.nctcompany.nct03.dto.user.ChangePasswordRequest;
import com.nctcompany.nct03.dto.user.UserResponse;
import com.nctcompany.nct03.model.User;
import com.nctcompany.nct03.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RequestMapping("/v1/users")
@RestController
@RequiredArgsConstructor
@Tag(
        name = "User API"
)
public class UserController {

    private final UserService userService;

    @Operation(
            summary = "Read User Profile"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Http Status 200 OK"
    )
    @SecurityRequirement(
            name = "Bear Authentication"
    )
    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getUserProfile(
            @RequestHeader(SecurityConstants.JWT_HEADER) String jwt
    ){
        String token = jwt.substring(7);
        return ResponseEntity.ok(userService.getUserFromToken(token));
    }

    @Operation(
            summary = "Read User Profile"
    )
    @ApiResponse(
            responseCode = "204",
            description = "Http Status 204 No Content"
    )
    @SecurityRequirement(
            name = "Bear Authentication"
    )
    @PatchMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Principal loginedUser
            ){
        userService.changePassword(request, loginedUser);
        return ResponseEntity.noContent().build();
    }

}
