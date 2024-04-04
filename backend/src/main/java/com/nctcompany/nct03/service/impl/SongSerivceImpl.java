package com.nctcompany.nct03.service.impl;

import com.nctcompany.nct03.dto.song.SongRequest;
import com.nctcompany.nct03.dto.song.SongResponse;
import com.nctcompany.nct03.exception.BadRequestException;
import com.nctcompany.nct03.exception.ResourceNotFoundException;
import com.nctcompany.nct03.mapper.SongMapper;
import com.nctcompany.nct03.model.Song;
import com.nctcompany.nct03.repository.SongRepository;
import com.nctcompany.nct03.service.SongService;
import com.nctcompany.nct03.util.FileUploadUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.Normalizer;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SongSerivceImpl implements SongService {

    private final SongRepository songRepository;

    @Override
    public List<SongResponse> getRecentlyReleasedSong() {
        List<Song> songs = songRepository.findTop5ByOrderByReleasedOnDesc();

        return songs
                .stream().map(SongMapper::mapToSongResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SongResponse getSongById(Long id) {
        Song song = songRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Song with id=[%s] can not found!".formatted(id)));
        return SongMapper.mapToSongResponse(song);
    }

    @Override
    public List<SongResponse> searchSongs(String keyword) {
        List<Song> songs = songRepository.findByNameContainingIgnoreCase(keyword);
        return songs.stream()
                .map(SongMapper::mapToSongResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SongResponse createSong(SongRequest songRequest) throws IOException {
        if (!isValidAudioFile(songRequest.getSongFile())){
            throw new BadRequestException("Please provide the song file in MPEG format");
        }
        String songName = songRequest.getName();
        String fileName = generateFileName(songName, songRequest.getSongFile());
        
        String imgName = null;
        if (!songRequest.getImageFile().isEmpty()){
            if (!isValidImageFile(songRequest.getImageFile())){
                throw new BadRequestException("Please provide the song image in JPG/PNG format");
            }
            imgName = generateFileName(songName, songRequest.getImageFile());
        }

        Song song = new Song();
        song.setName(songName);
        song.setImageName(imgName);
        song.setFileName(fileName);
        Song savedSong = songRepository.save(song);

        String fileFolderPath = "songs/" + savedSong.getId() + "/file";
        FileUploadUtil.cleanDir(fileFolderPath);
        FileUploadUtil.saveFile(fileFolderPath, fileName, songRequest.getSongFile());
        if (savedSong.getImageName() != null){
            String imgFolderPath = "songs/" + savedSong.getId() + "/img";
            FileUploadUtil.cleanDir(imgFolderPath);
            FileUploadUtil.saveFile(imgFolderPath, imgName, songRequest.getImageFile());
        }

        return SongMapper.mapToSongResponse(song);
    }

    // Chuẩn hoá tiếng việt có dấu về không dấu
    private static String removeAccent(String s) {
        String temp = Normalizer.normalize(s, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(temp).replaceAll("");
    }

    private String getFileExtension(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex > 0 && dotIndex < fileName.length() - 1) {
            return fileName.substring(dotIndex);
        }
        return "";
    }
    
    private String generateFileName(String songName, MultipartFile file){
        String originalFileName = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFileName);
    
        songName = removeAccent(songName);
        String randomString = UUID.randomUUID().toString().substring(0, 7);
        String fileName = songName.replaceAll(" ", "") + "-" + randomString;
        
        return fileName + fileExtension;
    }

    private boolean isValidImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && (contentType.equals("image/jpeg") || contentType.equals("image/png"));
    }

    private boolean isValidAudioFile(MultipartFile file) {
        if (file.isEmpty()) {
            return false;
        }
        String contentType = file.getContentType();
        return contentType != null && contentType.equals("audio/mpeg");
    }

}
