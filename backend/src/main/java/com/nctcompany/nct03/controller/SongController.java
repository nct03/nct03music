package com.nctcompany.nct03.controller;

import com.nctcompany.nct03.constant.ApplicationConstants;
import com.nctcompany.nct03.dto.song.SongRequest;
import com.nctcompany.nct03.dto.song.SongResponse;
import com.nctcompany.nct03.exception.ResourceNotFoundException;
import com.nctcompany.nct03.service.SongService;
import com.nctcompany.nct03.util.FileUploadUtil;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.List;

@RestController
@RequestMapping("/v1/songs")
@RequiredArgsConstructor
@Tag(
        name = "Song API"
)
@SecurityRequirement(
        name = "Bear Authentication"
)
public class SongController {

    private final SongService songService;

    @Operation(
            summary = "Get song by id"
    )
    @GetMapping("/{id}")
    public ResponseEntity<SongResponse> getSongById(@PathVariable Long id){
        return ResponseEntity.ok(songService.getSongById(id));
    }

    @Operation(
            summary = "Get top 10 recently released songs"
    )
    @GetMapping("/recently")
    public ResponseEntity<List<SongResponse>> getTop10RecentlyReleasedSongs(){
        return ResponseEntity.ok(songService.getRecentlyReleasedSong());
    }

    @Operation(
            summary = "Search songs by name"
    )
    @GetMapping("/search")
    public ResponseEntity<List<SongResponse>> searchSongs(@RequestParam String keyword) {
        return ResponseEntity.ok(songService.searchSongs(keyword));
    }

    @Hidden
    @GetMapping("/images/{imageName}")
    public ResponseEntity<?> viewSongImage(
            @PathVariable String imageName
    )  {
        try {
            UrlResource resource = FileUploadUtil.getUrlResource(imageName, ApplicationConstants.SONGS_IMG_FOLDER);
            MediaType mediaType = FileUploadUtil.determineMediaType(imageName);
            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .body(resource);
        }catch (MalformedURLException e){
            throw new ResourceNotFoundException("Could not found image name: " + imageName);
        }

    }

    @Hidden
    @GetMapping("/files/{songName}")
    public ResponseEntity<?> viewSongFile(
            @PathVariable String songName
    )  {
        try {
            UrlResource resource = FileUploadUtil.getUrlResource(songName, ApplicationConstants.SONGS_FILE_FOLDER);
            MediaType mediaType = FileUploadUtil.determineMediaType(resource.getFilename());
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(mediaType);
            headers.setContentLength(resource.contentLength());
            headers.setContentDispositionFormData("attachment", songName);

            return new ResponseEntity<>(resource, headers, HttpStatus.OK);
        }catch (MalformedURLException e){
            throw new ResourceNotFoundException("Could not found song name: " + songName);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }

    @Hidden
    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE}, produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<SongResponse> createSong(@Valid @ModelAttribute SongRequest songRequest) throws IOException {
        return new ResponseEntity<>(songService.createSong(songRequest), HttpStatus.CREATED);
    }
}
