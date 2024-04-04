package com.nctcompany.nct03.service;

import com.nctcompany.nct03.dto.user.ChangePasswordRequest;
import com.nctcompany.nct03.dto.user.UserResponse;

import java.security.Principal;

public interface UserService {

    UserResponse getUserFromToken(String token);
    void changePassword(ChangePasswordRequest request, Principal loginedUser);
}
