package com.nctcompany.nct03.mapper;

import com.nctcompany.nct03.constant.ApplicationConstants;
import com.nctcompany.nct03.dto.artist.ArtistResponse;
import com.nctcompany.nct03.dto.song.SongResponse;
import com.nctcompany.nct03.model.Artist;
import com.nctcompany.nct03.model.Song;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class SongMapper {

    public static SongResponse mapToSongResponse(Song song){
        SongResponse songResponse = SongResponse.builder()
                .id(song.getId())
                .name(song.getName())
                .releasedOn(song.getReleasedOn())
                .genre(song.getGenre().getName())
                .build();
        List<ArtistResponse> artists = new ArrayList<>();
        for (Artist artist: song.getArtists()){
            artists.add(ArtistMapper.mapToResponse(artist));
        }
        songResponse.setArtists(artists);

//        String url = ApplicationConstants.SONGS_FOLDER_PATH + File.separator + song.getId() + File.separator + "file" + File.separator + song.getFileName();
        songResponse.setUrl(song.getFileName());
//
//        String imagePath = ApplicationConstants.SONGS_FOLDER_PATH + File.separator + "default.jpg";
//        if (song.getImageName() != null && !song.getImageName().equals("")){
//            imagePath = ApplicationConstants.SONGS_FOLDER_PATH + File.separator + song.getId() + File.separator + "img" + File.separator + song.getImageName();
//        }
        songResponse.setImagePath(song.getImageName());
        return songResponse;
    }
}
