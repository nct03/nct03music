package com.nctcompany.nct03.service;

import com.nctcompany.nct03.dto.artist.ArtistDetails;
import com.nctcompany.nct03.dto.artist.ArtistResponse;
import com.nctcompany.nct03.dto.song.SongResponse;

import java.util.List;

public interface ArtistService {

    List<ArtistResponse> getAllArtists();
    ArtistDetails getArtistDetails(Long artistId);
    List<SongResponse> getSongsByArtist(Long artistId);
    List<ArtistResponse> searchArtists(String keyword);
}
