package com.nctcompany.nct03.service;

import com.nctcompany.nct03.dto.artist.ArtistDetails;
import com.nctcompany.nct03.dto.artist.ArtistResponse;
import com.nctcompany.nct03.dto.common.PageableResult;
import com.nctcompany.nct03.dto.song.SongResponse;

import java.util.List;

public interface ArtistService {

    PageableResult<ArtistResponse> getAllArtists(Integer pageNum, Integer pageSize);
    ArtistDetails getArtistDetails(Long artistId);
    List<SongResponse> getSongsByArtist(Long artistId);
    List<ArtistResponse> searchArtists(String keyword);
}
