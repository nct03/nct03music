package com.nctcompany.nct03.controller;

import com.nctcompany.nct03.constant.ApplicationConstants;
import com.nctcompany.nct03.dto.common.PageableResult;
import com.nctcompany.nct03.dto.playlist.PlaylistRequest;
import com.nctcompany.nct03.dto.playlist.PlaylistDetailsResponse;
import com.nctcompany.nct03.dto.playlist.PlaylistResponse;
import com.nctcompany.nct03.dto.song.SongResponse;
import com.nctcompany.nct03.dto.user.AddSongPlaylistRequest;
import com.nctcompany.nct03.dto.user.ChangePasswordRequest;
import com.nctcompany.nct03.dto.user.UpdateUserRequest;
import com.nctcompany.nct03.dto.user.UserResponse;
import com.nctcompany.nct03.exception.ResourceNotFoundException;
import com.nctcompany.nct03.model.User;
import com.nctcompany.nct03.service.PlaylistService;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
@RequiredArgsConstructor
@Validated
@Tag(
        name = "User API"
)
@SecurityRequirement(
        name = "Bear Authentication"
)
public class UserController {

    private final UserService userService;
    private final PlaylistService playlistService;

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

    @PatchMapping("/profile/update")
    public ResponseEntity<UserResponse> updateProfile(
            @Valid @ModelAttribute UpdateUserRequest request,
            Principal loggedUser
    ){
        try {
            UserResponse userResponse = userService.updateUser(request, loggedUser);
            return ResponseEntity.ok(userResponse);
        } catch (IOException e) {
//            return ResponseEntity.internalServerError().build();
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
            summary = "Create new current user's playlist"
    )
    @PostMapping("/me/playlists")
    public ResponseEntity<PlaylistResponse> createPlaylist(
            @Valid @RequestBody PlaylistRequest request,
            Principal loggedUser
    ){
        PlaylistResponse playlist = playlistService.createPlaylist(request, loggedUser);
        return new ResponseEntity<>(playlist, HttpStatus.CREATED);
    }

    @Operation(
            summary = "Get all current user's playlist"
    )
    @GetMapping("/me/playlists")
    public ResponseEntity<List<PlaylistResponse>> getCurrentUserPlaylists(
            Principal loggedUser
    ){
        List<PlaylistResponse> playlists = playlistService.getCurrentUserPlaylists(loggedUser);
        return ResponseEntity.ok(playlists);
    }

    @Operation(
            summary = "Delete current user's playlist"
    )
    @DeleteMapping("/me/playlists/{playlistId}")
    public ResponseEntity<Void> deletePlaylist(
            @PathVariable Long playlistId,
            Principal loggedUser
    ){
        playlistService.deletePlaylist(playlistId, loggedUser);
        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Add song to playlist"
    )
    @PostMapping("/me/playlists/{playlistId}/songs")
    public ResponseEntity<PlaylistDetailsResponse> addSongToPlaylist(
            @PathVariable Long playlistId,
            @Valid @RequestBody AddSongPlaylistRequest request,
            Principal loggedUser
    ){
        PlaylistDetailsResponse response = playlistService.addSongToPlaylist(playlistId, request, loggedUser);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(
            summary = "Get songs in playlist"
    )
    @GetMapping("/me/playlists/{playlistId}/songs")
    public ResponseEntity<PageableResult<SongResponse>> getSongsInPlaylist(
            @PathVariable Long playlistId,
            @Parameter(description = "Page number (default: 1)", example = "1", in = ParameterIn.QUERY, required = false)
                @RequestParam(value="pageNum", required = false, defaultValue = "1") @Min(value = 1) Integer pageNum,
            @Parameter(description = "Page size (default: 5, min: 5, max: 20)", example = "5", in = ParameterIn.QUERY, required = false)
                @RequestParam(value="pageSize", required = false, defaultValue = "5") @Min(value = 5) @Max(value = 20)  Integer pageSize,
            Principal loggedUser
    ){
        User user = (User) ((UsernamePasswordAuthenticationToken) loggedUser).getPrincipal();
        PageableResult<SongResponse> songsPage = playlistService.getSongInPlaylist(playlistId, user, pageNum, pageSize);
        return ResponseEntity.ok(addLinksToSongsPage(songsPage, playlistId, loggedUser));
    }

    private PageableResult<SongResponse> addLinksToSongsPage(PageableResult<SongResponse> songsPage, long playlistId,
                                                             Principal loggedUser){
        int pageSize = songsPage.getPageSize();
        int pageNum = songsPage.getPageNum();
        int totalPages = songsPage.getTotalPages();

        if (pageNum > 1) {
            songsPage.add(
                    linkTo(methodOn(UserController.class).getSongsInPlaylist(playlistId, 1, pageSize, loggedUser))
                            .withRel(IanaLinkRelations.FIRST));

            songsPage.add(
                    linkTo(methodOn(UserController.class).getSongsInPlaylist(playlistId, pageNum - 1, pageSize, loggedUser))
                            .withRel(IanaLinkRelations.PREV));
        }

        if (pageNum < totalPages) {
            songsPage.add(
                    linkTo(methodOn(UserController.class).getSongsInPlaylist(playlistId, pageNum + 1, pageSize, loggedUser))
                            .withRel(IanaLinkRelations.NEXT));

            songsPage.add(
                    linkTo(methodOn(UserController.class).getSongsInPlaylist(playlistId, totalPages, pageSize, loggedUser))
                            .withRel(IanaLinkRelations.LAST));
        }
        return songsPage;
    }

    @Operation(
            summary = "Remove song from playlist"
    )
    @PutMapping("/me/playlists/{playlistId}/songs/{songId}")
    public ResponseEntity<PlaylistDetailsResponse> removeSongFromPlaylist(
            @PathVariable Long playlistId,
            @PathVariable Long songId,
            Principal loggedUser
    ){
        PlaylistDetailsResponse response = playlistService.removeSongInPlaylist(playlistId, songId, loggedUser);
        return ResponseEntity.ok(response);
    }
}
