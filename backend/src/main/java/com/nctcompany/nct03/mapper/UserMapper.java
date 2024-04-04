package com.nctcompany.nct03.mapper;

import com.nctcompany.nct03.constant.ApplicationConstants;
import com.nctcompany.nct03.dto.user.UserResponse;
import com.nctcompany.nct03.model.User;

import java.io.File;

public class UserMapper {

    public static UserResponse mapToResponse(User user){
        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().getName())
                .build();
//        String photo = ApplicationConstants.USERS_FOLDER_PATH + File.separator + "default.jpg";
//        if (user.getPhoto() != null && !user.getPhoto().isEmpty()){
//            photo = ApplicationConstants.USERS_FOLDER_PATH + File.separator + user.getId() + File.separator + user.getPhoto();
//        }
        userResponse.setPhoto(user.getPhoto());
        return userResponse;
    }
}
