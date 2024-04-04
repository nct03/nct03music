package com.nctcompany.nct03.service;

import com.nctcompany.nct03.dto.song.SongRequest;
import com.nctcompany.nct03.dto.song.SongResponse;
import com.nctcompany.nct03.model.Song;

import java.io.IOException;
import java.util.List;

public interface SongService {

    List<SongResponse> getRecentlyReleasedSong();
    SongResponse getSongById(Long id);
    List<SongResponse> searchSongs(String keyword);
    SongResponse createSong(SongRequest songRequest) throws IOException;
}
