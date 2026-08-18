package com.pixelsoftwaredesign.pixerp.repository;

import com.pixelsoftwaredesign.pixerp.entity.JournalEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface JournalEntryRepository extends JpaRepository<JournalEntry, Long> {
    List<JournalEntry> findByDateBetween(LocalDate start, LocalDate end);
}
