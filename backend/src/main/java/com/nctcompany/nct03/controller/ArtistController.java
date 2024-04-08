package com.nctcompany.nct03.controller;

import com.nctcompany.nct03.constant.ApplicationConstants;
import com.nctcompany.nct03.dto.artist.ArtistDetails;
import com.nctcompany.nct03.dto.artist.ArtistResponse;
import com.nctcompany.nct03.dto.common.PageableResult;
import com.nctcompany.nct03.dto.song.SongResponse;
import com.nctcompany.nct03.service.ArtistService;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RequestMapping("/v1/artists")
@RestController
@RequiredArgsConstructor
@Validated
@Tag(
        name = "Artist API"
)
@SecurityRequirement(name = "Bear Authentication")
public class ArtistController {

    private final ArtistService artistService;

    @Operation(
            summary = "Get all artists"
    )
    @GetMapping
    public ResponseEntity<PageableResult<ArtistResponse>> getAllArtists(
            @Parameter(description = "Page number (default: 1)", example = "1", in = ParameterIn.QUERY, required = false)
                @RequestParam(value="pageNum", required = false, defaultValue = "1") @Min(value = 1) Integer pageNum,
            @Parameter(description = "Page size (default: 10, min: 5, max: 20)", example = "10", in = ParameterIn.QUERY, required = false)
                @RequestParam(value="pageSize", required = false, defaultValue = "10") @Min(value = 5) @Max(value = 20)  Integer pageSize
    ){
        PageableResult<ArtistResponse> artists = artistService.getAllArtists(pageNum - 1, pageSize);
        return ResponseEntity.ok(artists);
    }

    @Operation(
            summary = "Get artist details"
    )
    @GetMapping("/{artistId}")
    public ResponseEntity<ArtistDetails> getArtistDetails(
            @PathVariable Long artistId
    ){
        return ResponseEntity.ok(artistService.getArtistDetails(artistId));
    }

    @Operation(
            summary = "Get artist's songs"
    )
    @GetMapping("/{artistId}/songs")
    public ResponseEntity<List<SongResponse>> getSongsByArtist(
            @PathVariable Long artistId
    ){
        return ResponseEntity.ok(artistService.getSongsByArtist(artistId));
    }

    @Operation(
            summary = "Search artists by name"
    )
    @GetMapping("/search")
    public ResponseEntity<List<ArtistResponse>> searchArtists(@RequestParam String keyword) {
        return ResponseEntity.ok(artistService.searchArtists(keyword));
    }

    @Hidden
    @GetMapping("/images/{imageName}")
    public ResponseEntity<?> viewArtistImage(@PathVariable String imageName) {
        try {
            Path imagePath = Paths.get(ApplicationConstants.ARTISTS_FOLDER + imageName);
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
