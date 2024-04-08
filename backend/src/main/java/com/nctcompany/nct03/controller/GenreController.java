package com.nctcompany.nct03.controller;

import com.nctcompany.nct03.dto.genre.GenreResponse;
import com.nctcompany.nct03.dto.song.SongResponse;
import com.nctcompany.nct03.service.GenreService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("/v1/genres")
@RestController
@RequiredArgsConstructor
@Tag(
        name = "Genre API"
)
@SecurityRequirement(
        name = "Bear Authentication"
)
public class GenreController {

    private final GenreService genreService;

    @Operation(
            summary = "Get all genres"
    )
    @GetMapping
    public ResponseEntity<List<GenreResponse>> getAllGenres(){
        return ResponseEntity.ok(genreService.getAllGenres());
    }

    @Operation(
            summary = "Get genre's songs"
    )
    @GetMapping("/{genreId}/songs")
    public ResponseEntity<List<SongResponse>> getSongsByGenre(
            @PathVariable Integer genreId
    ){
        return ResponseEntity.ok(genreService.getSongsByGenre(genreId));
    }
}
