package com.nctcompany.nct03.controller;

import com.nctcompany.nct03.constant.ApplicationConstants;
import com.nctcompany.nct03.dto.user.ChangePasswordRequest;
import com.nctcompany.nct03.dto.user.UserResponse;
import com.nctcompany.nct03.service.UserService;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;

@RequestMapping("/v1/users")
@RestController
@RequiredArgsConstructor
@Tag(
        name = "User API"
)
@SecurityRequirement(
        name = "Bear Authentication"
)
public class UserController {

    private final UserService userService;

    @Operation(
            summary = "Get user profile"
    )
    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getUserProfile(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String jwt
    ){
        String token = jwt.substring(7);
        return ResponseEntity.ok(userService.getUserFromToken(token));
    }

    @Operation(
            summary = "Change user password"
    )
    @PatchMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Principal loginedUser
            ){
        userService.changePassword(request, loginedUser);
        return ResponseEntity.noContent().build();
    }

    @Hidden
    @GetMapping("/images/{imageName}")
    public ResponseEntity<?> viewUserImage(@PathVariable String imageName) {
        try {
            Path imagePath = Paths.get(ApplicationConstants.USERS_FOLDER + imageName);
            UrlResource resource = new UrlResource(imagePath.toUri());
            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        }catch (Exception e){
            return ResponseEntity.notFound().build();
        }
    }

}
