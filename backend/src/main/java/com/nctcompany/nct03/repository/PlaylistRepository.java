package com.nctcompany.nct03.repository;

import com.nctcompany.nct03.model.Playlist;
import com.nctcompany.nct03.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
    boolean existsByNameAndUser(String name, User user);
    Optional<Playlist> findByIdAndUserId(Long id, Long userId);
    Page<Playlist> findByUserIdOrderByIdDesc(Long userId, Pageable pageable);
}
