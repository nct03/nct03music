package com.nctcompany.nct03.dto.user;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddSongPlaylistRequest {

    @NotNull(message = "Song id is required")
    private Long songId;
}
