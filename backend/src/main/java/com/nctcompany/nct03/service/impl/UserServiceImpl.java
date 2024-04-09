package com.nctcompany.nct03.service.impl;

import com.nctcompany.nct03.constant.ApplicationConstants;
import com.nctcompany.nct03.dto.playlist.PlaylistResponse;
import com.nctcompany.nct03.dto.user.ChangePasswordRequest;
import com.nctcompany.nct03.dto.user.UpdateUserRequest;
import com.nctcompany.nct03.dto.user.UserResponse;
import com.nctcompany.nct03.exception.BadRequestException;
import com.nctcompany.nct03.mapper.PlaylistMapper;
import com.nctcompany.nct03.mapper.UserMapper;
import com.nctcompany.nct03.model.User;
import com.nctcompany.nct03.repository.UserRepository;
import com.nctcompany.nct03.service.UserService;
import com.nctcompany.nct03.util.FileUploadUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PlaylistMapper playlistMapper;

    @Override
    public UserResponse getUserProfile(Principal loggedUser) {
        User user = (User) ((UsernamePasswordAuthenticationToken) loggedUser).getPrincipal();
        return UserMapper.mapToResponse(user);
    }

    @Override
    public void changePassword(ChangePasswordRequest request, Principal loggedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) loggedUser).getPrincipal();
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Wrong password");
        }
        if (!request.getNewPassword().equals(request.getConfirmationPassword())) {
            throw new BadRequestException("Password are not the same");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);
    }

    @Override
    public UserResponse updateUser(UpdateUserRequest request, Principal loggedUser) throws IOException {
        User user = (User) ((UsernamePasswordAuthenticationToken) loggedUser).getPrincipal();

        if (request.getName() != null && !request.getName().isBlank() && !request.getName().equals(user.getName())){
            user.setName(request.getName());
        }

        if (request.getPhotoFile() != null && !request.getPhotoFile().isEmpty()){
            if (!FileUploadUtil.checkUploadImageTypeFile(request.getPhotoFile())){
                throw new BadRequestException("Please provide the song image in JPG/PNG format");
            }
            if (!(user.getPhoto() == null) && !user.getPhoto().equals(ApplicationConstants.DEFAULT_IMAGE)){
                FileUploadUtil.deleteImage(ApplicationConstants.USERS_FOLDER, user.getPhoto());
            }
            String photoName = FileUploadUtil.generateImageName(request.getPhotoFile());
            user.setPhoto(photoName);
            FileUploadUtil.saveFile(ApplicationConstants.USERS_FOLDER, photoName, request.getPhotoFile());
        }

        User udpatedUser = userRepository.save(user);
        return UserMapper.mapToResponse(udpatedUser);
    }

    @Override
    public List<PlaylistResponse> getCurrentUserPlaylists() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        return user.getPlaylists().stream()
                .map(playlistMapper::mapToResponse)
                .collect(Collectors.toList());
    }
}
