package com.nctcompany.nct03.service;

import com.nctcompany.nct03.dto.common.PageableResult;
import com.nctcompany.nct03.dto.playlist.PlaylistRequest;
import com.nctcompany.nct03.dto.playlist.PlaylistDetailsResponse;
import com.nctcompany.nct03.dto.playlist.PlaylistResponse;
import com.nctcompany.nct03.dto.song.SongResponse;
import com.nctcompany.nct03.model.User;

public interface PlaylistService {
    PlaylistResponse createPlaylist(PlaylistRequest request, User user);
    PlaylistDetailsResponse addSongToPlaylist(Long playlistId, Long songId, User user);
    PlaylistDetailsResponse removeSongInPlaylist(Long playlistId, Long songId, User user);
    void deletePlaylist(Long playlistId, User user);
    PageableResult<SongResponse> getSongInPlaylist(Long playlistId, User user, Integer pageNum, Integer pageSize);
}

