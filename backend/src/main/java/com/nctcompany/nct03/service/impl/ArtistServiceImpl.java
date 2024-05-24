package com.nctcompany.nct03.service.impl;

import com.nctcompany.nct03.dto.artist.ArtistDetails;
import com.nctcompany.nct03.dto.artist.ArtistResponse;
import com.nctcompany.nct03.dto.common.PageableResult;
import com.nctcompany.nct03.dto.song.SongResponse;
import com.nctcompany.nct03.exception.ResourceNotFoundException;
import com.nctcompany.nct03.mapper.ArtistMapper;
import com.nctcompany.nct03.mapper.SongMapper;
import com.nctcompany.nct03.model.Artist;
import com.nctcompany.nct03.repository.ArtistRepository;
import com.nctcompany.nct03.service.ArtistService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArtistServiceImpl implements ArtistService {

    private final ArtistRepository artistRepository;

    @Override
    public PageableResult<ArtistResponse> getAllArtists(Integer pageNum, Integer pageSize) {
        Page<Artist> artistsPage = artistRepository.findAll(PageRequest.of(pageNum, pageSize));
        List<ArtistResponse> artists = artistsPage.getContent().stream()
                .map(ArtistMapper::mapToResponse)
                .collect(Collectors.toList());
        return PageableResult.<ArtistResponse>builder()
                .items(artists)
                .pageNum(artistsPage.getNumber() + 1)
                .pageSize(artistsPage.getSize())
                .totalItems(artistsPage.getTotalElements())
                .totalPages(artistsPage.getTotalPages())
                .build();
    }

    @Override
    public ArtistResponse getArtistDetails(Long artistId) {
        Artist artist = artistRepository.findById(artistId)
                .orElseThrow(() -> new ResourceNotFoundException("Artist with id=[%s] not found".formatted(artistId)));
        return ArtistMapper.mapToResponse(artist);
    }

    @Override
    public PageableResult<SongResponse> getSongsByArtist(Long artistId, Integer pageNum, Integer pageSize) {
        Artist artist = artistRepository.findById(artistId)
                .orElseThrow(() -> new ResourceNotFoundException("Artist with id=[%s] not found".formatted(artistId)));
        List<SongResponse> songResponses = artist.getSongs().stream()
                .map(SongMapper::mapToSongResponse)
                .collect(Collectors.toList());

        songResponses.sort(Comparator.comparing(SongResponse::getReleasedOn).reversed());

        int totalItems = songResponses.size();
        int totalPages = (int) Math.ceil((double) totalItems / pageSize);
        int fromIndex = (pageNum - 1) * pageSize;
        int toIndex = Math.min(fromIndex + pageSize, totalItems);

        return PageableResult.<SongResponse>builder()
                .items(songResponses.subList(fromIndex, toIndex))
                .pageNum(pageNum)
                .pageSize(pageSize)
                .totalItems(totalItems)
                .totalPages(totalPages)
                .build();
    }

    @Override
    public List<ArtistResponse> searchArtists(String keyword) {
        List<Artist> artists = artistRepository.findByNameContainingIgnoreCase(keyword);
        return artists.stream()
                .map(ArtistMapper::mapToResponse)
                .collect(Collectors.toList());
    }
}
