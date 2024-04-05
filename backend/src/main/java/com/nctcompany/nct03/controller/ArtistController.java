package com.nctcompany.nct03.controller;

import com.nctcompany.nct03.constant.ApplicationConstants;
import com.nctcompany.nct03.dto.artist.ArtistDetails;
import com.nctcompany.nct03.dto.artist.ArtistResponse;
import com.nctcompany.nct03.dto.song.SongResponse;
import com.nctcompany.nct03.service.ArtistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RequestMapping("/v1/artists")
@RestController
@RequiredArgsConstructor
@Tag(
        name = "Artist API"
)
public class ArtistController {

    private final ArtistService artistService;

    @Operation(
            summary = "Read All Artists"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Http Status 200 OK"
    )
    @GetMapping
    public ResponseEntity<List<ArtistResponse>> getAllArtists(){
        return ResponseEntity.ok(artistService.getAllArtists());
    }

    @Operation(
            summary = "Read Artist Details"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Http Status 200 OK"
    )
    @GetMapping("/{artistId}")
    public ResponseEntity<ArtistDetails> getArtistDetails(
            @PathVariable Long artistId
    ){
        return ResponseEntity.ok(artistService.getArtistDetails(artistId));
    }

    @Operation(
            summary = "Read Artist's Songs"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Http Status 200 OK"
    )
    @GetMapping("/{artistId}/songs")
    public ResponseEntity<List<SongResponse>> getSongsByArtist(
            @PathVariable Long artistId
    ){
        return ResponseEntity.ok(artistService.getSongsByArtist(artistId));
    }

    @Operation(
            summary = "Search Artists by name"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Http Status 200 OK"
    )
    @GetMapping("/search")
    public ResponseEntity<List<ArtistResponse>> searchArtists(@RequestParam String keyword) {
        return ResponseEntity.ok(artistService.searchArtists(keyword));
    }

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
