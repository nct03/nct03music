package com.nctcompany.nct03.repository;

import com.nctcompany.nct03.model.Song;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SongRepository extends JpaRepository<Song, Long> {

    List<Song> findTop10ByOrderByReleasedOnDesc();
    List<Song> findByNameContainingIgnoreCase(String name);
}
