package com.pixelsoftwaredesign.pixerp.controller;

import com.pixelsoftwaredesign.pixerp.entity.JournalEntry;
import com.pixelsoftwaredesign.pixerp.repository.JournalEntryRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/journal-entries")
public class JournalEntryController {

    private final JournalEntryRepository journalEntryRepository;

    public JournalEntryController(JournalEntryRepository journalEntryRepository) {
        this.journalEntryRepository = journalEntryRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            List<JournalEntry> entries = journalEntryRepository.findAll();
            return ResponseEntity.ok(entries);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            var result = journalEntryRepository.findById(id);
            if (result.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Journal entry not found with id: " + id);
            }
            return ResponseEntity.ok(result.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/date-range")
    public ResponseEntity<?> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        try {
            List<JournalEntry> entries = journalEntryRepository.findByDateBetween(start, end);
            return ResponseEntity.ok(entries);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody JournalEntry entry) {
        try {
            JournalEntry created = journalEntryRepository.save(entry);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody JournalEntry entry) {
        try {
            var result = journalEntryRepository.findById(id);
            if (result.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Journal entry not found with id: " + id);
            }
            JournalEntry existing = result.get();
            existing.setEntryNumber(entry.getEntryNumber());
            existing.setDate(entry.getDate());
            existing.setDescription(entry.getDescription());
            existing.setDebitAccount(entry.getDebitAccount());
            existing.setCreditAccount(entry.getCreditAccount());
            existing.setAmount(entry.getAmount());
            existing.setStatus(entry.getStatus());
            return ResponseEntity.ok(journalEntryRepository.save(existing));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            journalEntryRepository.deleteById(id);
            return ResponseEntity.ok("Journal entry deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
