package com.nctcompany.nct03.service;

import com.nctcompany.nct03.dto.artist.ArtistDetails;
import com.nctcompany.nct03.dto.artist.ArtistResponse;
import com.nctcompany.nct03.dto.common.PageableResult;
import com.nctcompany.nct03.dto.song.SongResponse;

import java.util.List;

public interface ArtistService {

    PageableResult<ArtistResponse> getAllArtists(Integer pageNum, Integer pageSize);
    ArtistResponse getArtistDetails(Long artistId);
    PageableResult<SongResponse> getSongsByArtist(Long artistId, Integer pageNum, Integer pageSize);
    List<ArtistResponse> searchArtists(String keyword);
}
