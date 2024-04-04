package com.nctcompany.nct03.service;

import com.nctcompany.nct03.dto.genre.GenreResponse;
import com.nctcompany.nct03.dto.song.SongResponse;

import java.util.List;

public interface GenreService {

    List<GenreResponse> getAllGenres();

    List<SongResponse> getSongsByGenre(Integer genreId);
}
