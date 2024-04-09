package com.nctcompany.nct03.service;

import com.nctcompany.nct03.dto.common.PageableResult;
import com.nctcompany.nct03.dto.playlist.PlaylistRequest;
import com.nctcompany.nct03.dto.playlist.PlaylistDetailsResponse;
import com.nctcompany.nct03.dto.playlist.PlaylistResponse;
import com.nctcompany.nct03.dto.song.SongResponse;
import com.nctcompany.nct03.dto.user.AddSongPlaylistRequest;
import com.nctcompany.nct03.model.User;

import java.security.Principal;
import java.util.List;

public interface PlaylistService {
    PlaylistResponse createPlaylist(PlaylistRequest request, Principal loggedUser);
    List<PlaylistResponse> getCurrentUserPlaylists(Principal loggedUser);
    PlaylistDetailsResponse addSongToPlaylist(Long playlistId, AddSongPlaylistRequest request, Principal loggedUser);
    PlaylistDetailsResponse removeSongInPlaylist(Long playlistId, Long songId, Principal loggedUser);
    void deletePlaylist(Long playlistId, Principal loggedUser);

    PageableResult<SongResponse> getSongInPlaylist(Long playlistId, User user, Integer pageNum, Integer pageSize);
}

