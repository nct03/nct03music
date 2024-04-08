package com.nctcompany.nct03.controller;

import com.nctcompany.nct03.constant.ApplicationConstants;
import com.nctcompany.nct03.dto.song.SongRequest;
import com.nctcompany.nct03.dto.song.SongResponse;
import com.nctcompany.nct03.service.SongService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/v1/songs")
@RequiredArgsConstructor
@Tag(
        name = "Song API"
)
public class SongController {

    private final SongService songService;

    @Operation(
            summary = "Read Song By Id"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Http Status 200 OK"
    )
    @GetMapping("/{id}")
    public ResponseEntity<SongResponse> getSongById(@PathVariable Long id){
        return ResponseEntity.ok(songService.getSongById(id));
    }

    @Operation(
            summary = "Read Recently Released Songs"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Http Status 200 OK"
    )
    @GetMapping("/recently")
    public ResponseEntity<List<SongResponse>> getTop10RecentlyReleasedSongs(){
        return ResponseEntity.ok(songService.getRecentlyReleasedSong());
    }

    @Operation(
            summary = "Search Songs by name"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Http Status 200 OK"
    )
    @GetMapping("/search")
    public ResponseEntity<List<SongResponse>> searchSongs(@RequestParam String keyword) {
        return ResponseEntity.ok(songService.searchSongs(keyword));
    }

    @GetMapping("/images/{imageName}")
    public ResponseEntity<?> viewSongImage(
            @PathVariable String imageName
    )  {
        try {
            Path imagePath = Paths.get(ApplicationConstants.SONGS_IMG_FOLDER + imageName);
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

    @GetMapping("/files/{songName}")
    public ResponseEntity<?> viewSongFile(
            @PathVariable String songName
    )  {
        try {
            Path songPath = Paths.get(ApplicationConstants.SONGS_FILE_FOLDER + songName);
            UrlResource resource = new UrlResource(songPath.toUri());
            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        }catch (Exception e){
            return ResponseEntity.notFound().build();
        }

    }

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE}, produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<SongResponse> createSong(@Valid @ModelAttribute SongRequest songRequest) throws IOException {
        return new ResponseEntity<>(songService.createSong(songRequest), HttpStatus.CREATED);
    }
}
