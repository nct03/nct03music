package com.nctcompany.nct03.repository;

import com.nctcompany.nct03.model.Artist;
import com.nctcompany.nct03.model.Song;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SongRepository extends JpaRepository<Song, Long> {

    @Query("SELECT s FROM Song s ORDER BY s.releasedOn DESC")
    Page<Song> findLatestReleasedSongs(Pageable pageable);

    @Query("SELECT s FROM Song s ORDER BY SIZE(s.likedByUsers) DESC")
    Page<Song> findMostLikedSongs(Pageable pageable);

    List<Song> findByNameContainingIgnoreCase(String name);

    Page<Song> findByArtistsContaining(Artist artist, Pageable pageable);
}
