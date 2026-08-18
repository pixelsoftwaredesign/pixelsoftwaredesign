package com.pixelsoftwaredesign.pixerp.service;

import com.pixelsoftwaredesign.pixerp.entity.JournalEntry;
import com.pixelsoftwaredesign.pixerp.repository.JournalEntryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class JournalEntryService {

    private final JournalEntryRepository journalEntryRepository;

    public JournalEntryService(JournalEntryRepository journalEntryRepository) {
        this.journalEntryRepository = journalEntryRepository;
    }

    public List<JournalEntry> getAll() {
        return journalEntryRepository.findAll();
    }

    public JournalEntry getById(Long id) {
        return journalEntryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Journal entry not found with id: " + id));
    }

    public JournalEntry create(JournalEntry entry) {
        return journalEntryRepository.save(entry);
    }

    public JournalEntry update(Long id, JournalEntry updated) {
        JournalEntry existing = getById(id);
        existing.setDate(updated.getDate());
        existing.setDescription(updated.getDescription());
        existing.setDebitAccount(updated.getDebitAccount());
        existing.setCreditAccount(updated.getCreditAccount());
        existing.setAmount(updated.getAmount());
        existing.setStatus(updated.getStatus());
        return journalEntryRepository.save(existing);
    }

    public void delete(Long id) {
        journalEntryRepository.deleteById(id);
    }

    public List<JournalEntry> getByDateRange(LocalDate start, LocalDate end) {
        return journalEntryRepository.findByDateBetween(start, end);
    }

    public JournalEntry createEntry(JournalEntry entry) {
        long count = journalEntryRepository.count();
        String entryNumber = "JE-" + String.format("%04d", count + 1);
        entry.setEntryNumber(entryNumber);
        return journalEntryRepository.save(entry);
    }
}
