package com.nctcompany.nct03.controller;

import com.nctcompany.nct03.constant.ApplicationConstants;
import com.nctcompany.nct03.dto.common.PageableResult;
import com.nctcompany.nct03.dto.playlist.PlaylistResponse;
import com.nctcompany.nct03.dto.song.SongResponse;
import com.nctcompany.nct03.dto.user.ChangePasswordRequest;
import com.nctcompany.nct03.dto.user.UpdateUserRequest;
import com.nctcompany.nct03.dto.user.UserResponse;
import com.nctcompany.nct03.exception.ResourceNotFoundException;
import com.nctcompany.nct03.model.User;
import com.nctcompany.nct03.service.UserService;
import com.nctcompany.nct03.util.FileUploadUtil;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.UrlResource;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.MalformedURLException;
import java.security.Principal;
import java.util.List;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RequestMapping("/v1/users")
@RestController
@Validated
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

    @Operation(
            summary = "Like Song"
    )
    @PostMapping("/like/{songId}")
    public ResponseEntity<String> likeSong(
            @PathVariable Long songId
    ){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) authentication.getPrincipal();
        userService.likesSong(loggedUser, songId);
        return ResponseEntity.ok("Like song successfully");
    }

    @Operation(
            summary = "Unlike Song"
    )
    @DeleteMapping("/unlike/{songId}")
    public ResponseEntity<String> unlikeSong(
            @PathVariable Long songId
    ){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) authentication.getPrincipal();
        userService.unlikeSong(loggedUser, songId);
        return ResponseEntity.ok("Unlike song successfully");
    }

    @Operation(
            summary = "Check is song in favorite"
    )
    @GetMapping("/favorite-songs/{songId}")
    public ResponseEntity<Boolean> checkSongInFavorite(
            @PathVariable Long songId
    ){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) authentication.getPrincipal();
        boolean isLiked = userService.isUserLikeSong(loggedUser, songId);
        if (isLiked){
            return ResponseEntity.ok(true);
        }else {
            return ResponseEntity.ok(false);
        }
    }

    @Operation(
            summary = "Get favorite songs"
    )
    @GetMapping("/me/favorite-songs")
    public ResponseEntity<PageableResult<SongResponse>> getFavoriteSongs(
            @Parameter(description = "Page number (default: 1)", example = "1", in = ParameterIn.QUERY)
                @RequestParam(value="pageNum", required = false, defaultValue = "1") @Min(value = 1) Integer pageNum,
            @Parameter(description = "Page size (default: 7, min: 5, max: 20)", example = "7", in = ParameterIn.QUERY)
                @RequestParam(value="pageSize", required = false, defaultValue = "7") @Min(value = 5) @Max(value = 20)  Integer pageSize

    ){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) authentication.getPrincipal();
        PageableResult<SongResponse> songsPage = userService.getFavoriteSongs(loggedUser, pageNum, pageSize);
        return ResponseEntity.ok(addLinksToSongsPage(songsPage));
    }

    private PageableResult<SongResponse> addLinksToSongsPage(PageableResult<SongResponse> songsPage){
        int pageSize = songsPage.getPageSize();
        int pageNum = songsPage.getPageNum();
        int totalPages = songsPage.getTotalPages();

        if (pageNum > 1) {
            songsPage.add(
                    linkTo(methodOn(UserController.class).getFavoriteSongs( 1, pageSize))
                            .withRel(IanaLinkRelations.FIRST));

            songsPage.add(
                    linkTo(methodOn(UserController.class).getFavoriteSongs( pageNum - 1, pageSize))
                            .withRel(IanaLinkRelations.PREV));
        }

        if (pageNum < totalPages) {
            songsPage.add(
                    linkTo(methodOn(UserController.class).getFavoriteSongs( pageNum + 1, pageSize))
                            .withRel(IanaLinkRelations.NEXT));

            songsPage.add(
                    linkTo(methodOn(UserController.class).getFavoriteSongs( totalPages, pageSize))
                            .withRel(IanaLinkRelations.LAST));
        }
        return songsPage;
    }

}
