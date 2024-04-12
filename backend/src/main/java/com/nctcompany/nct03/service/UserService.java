package com.nctcompany.nct03.service;

import com.nctcompany.nct03.dto.common.PageableResult;
import com.nctcompany.nct03.dto.playlist.PlaylistResponse;
import com.nctcompany.nct03.dto.song.SongResponse;
import com.nctcompany.nct03.dto.user.ChangePasswordRequest;
import com.nctcompany.nct03.dto.user.UpdateUserRequest;
import com.nctcompany.nct03.dto.user.UserResponse;
import com.nctcompany.nct03.model.User;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

public interface UserService {

    UserResponse getUserProfile(Principal loggedUser);
    void changePassword(ChangePasswordRequest request, Principal loggedUser);
    UserResponse updateUser(UpdateUserRequest request, Principal loggedUser) throws IOException;
    List<PlaylistResponse> getCurrentUserPlaylists();

    void likesSong(User loggedUser, Long songId);
    void unlikeSong(User loggedUser, Long songId);
    boolean isUserLikeSong(User loggedUser, Long songId);

    PageableResult<SongResponse> getFavoriteSongs(User loggedUser, Integer pageNum, Integer pageSize);
}
