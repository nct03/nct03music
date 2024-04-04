package com.nctcompany.nct03.service.impl;

import com.nctcompany.nct03.dto.artist.ArtistDetails;
import com.nctcompany.nct03.dto.artist.ArtistResponse;
import com.nctcompany.nct03.dto.song.SongResponse;
import com.nctcompany.nct03.exception.ResourceNotFoundException;
import com.nctcompany.nct03.mapper.ArtistMapper;
import com.nctcompany.nct03.mapper.SongMapper;
import com.nctcompany.nct03.model.Artist;
import com.nctcompany.nct03.repository.ArtistRepository;
import com.nctcompany.nct03.service.ArtistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArtistServiceImpl implements ArtistService {

    private final ArtistRepository artistRepository;

    @Override
    public List<ArtistResponse> getAllArtists() {
        List<Artist> artists = artistRepository.findAll();
        return artists.stream()
                .map(ArtistMapper::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ArtistDetails getArtistDetails(Long artistId) {
        Artist artist = artistRepository.findById(artistId)
                .orElseThrow(() -> new ResourceNotFoundException("Artist with id=[%s] not found".formatted(artistId)));
        return ArtistMapper.mapToDetails(artist);
    }

    @Override
    public List<SongResponse> getSongsByArtist(Long artistId) {
        Artist artist = artistRepository.findById(artistId)
                .orElseThrow(() -> new ResourceNotFoundException("Artist with id=[%s] not found".formatted(artistId)));
        return artist.getSongs().stream()
                .map(SongMapper::mapToSongResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ArtistResponse> searchArtists(String keyword) {
        List<Artist> artists = artistRepository.findByNameContainingIgnoreCase(keyword);
        return artists.stream()
                .map(ArtistMapper::mapToResponse)
                .collect(Collectors.toList());
    }
}
