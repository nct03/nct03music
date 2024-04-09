package com.nctcompany.nct03.controller;

import com.nctcompany.nct03.constant.ApplicationConstants;
import com.nctcompany.nct03.dto.playlist.PlaylistResponse;
import com.nctcompany.nct03.dto.user.ChangePasswordRequest;
import com.nctcompany.nct03.dto.user.UpdateUserRequest;
import com.nctcompany.nct03.dto.user.UserResponse;
import com.nctcompany.nct03.exception.ResourceNotFoundException;
import com.nctcompany.nct03.service.UserService;
import com.nctcompany.nct03.util.FileUploadUtil;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.MalformedURLException;
import java.security.Principal;
import java.util.List;

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
            Principal loggedUser
    ){
        return ResponseEntity.ok(userService.getUserProfile(loggedUser));
    }

    @Operation(
            summary = "Change user password"
    )
    @PatchMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Principal loggedUser
            ){
        userService.changePassword(request, loggedUser);
        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Update username or photo"
    )
    @PatchMapping("/profile/update")
    public ResponseEntity<UserResponse> updateProfile(
            @Valid @ModelAttribute UpdateUserRequest request,
            Principal loggedUser
    ){
        try {
            UserResponse userResponse = userService.updateUser(request, loggedUser);
            return ResponseEntity.ok(userResponse);
        } catch (IOException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Hidden
    @GetMapping("/images/{imageName}")
    public ResponseEntity<?> viewUserImage(@PathVariable String imageName) {
        try {
            UrlResource resource = FileUploadUtil.getUrlResource(imageName, ApplicationConstants.USERS_FOLDER);
            MediaType mediaType = FileUploadUtil.determineMediaType(imageName);
            return ResponseEntity.ok()
                        .contentType(mediaType)
                        .body(resource);
        }catch (MalformedURLException e){
            throw new ResourceNotFoundException("Can not found image name: " + imageName);
        }
    }


    @Operation(
            summary = "Get current user playlists"
    )
    @GetMapping("/me/playlists")
    public ResponseEntity<List<PlaylistResponse>> getCurrentUserPlaylists(){
        List<PlaylistResponse> playlists = userService.getCurrentUserPlaylists();
        return ResponseEntity.ok(playlists);
    }

}
