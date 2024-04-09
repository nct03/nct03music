package com.nctcompany.nct03.service;

import com.nctcompany.nct03.dto.playlist.PlaylistResponse;
import com.nctcompany.nct03.dto.user.ChangePasswordRequest;
import com.nctcompany.nct03.dto.user.UpdateUserRequest;
import com.nctcompany.nct03.dto.user.UserResponse;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

public interface UserService {

    UserResponse getUserProfile(Principal loggedUser);
    void changePassword(ChangePasswordRequest request, Principal loggedUser);
    UserResponse updateUser(UpdateUserRequest request, Principal loggedUser) throws IOException;
    List<PlaylistResponse> getCurrentUserPlaylists();
}
