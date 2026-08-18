package com.pixelsoftwaredesign.pixerp.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "journal_entries")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class JournalEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entry_number", nullable = false, unique = true)
    private String entryNumber;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false, length = 200)
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "debit_account_id", nullable = false)
    private Account debitAccount;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "credit_account_id", nullable = false)
    private Account creditAccount;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EntryStatus status = EntryStatus.POSTED;

    public enum EntryStatus { DRAFT, POSTED, REVERSED }

    public JournalEntry() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEntryNumber() { return entryNumber; }
    public void setEntryNumber(String entryNumber) { this.entryNumber = entryNumber; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Account getDebitAccount() { return debitAccount; }
    public void setDebitAccount(Account debitAccount) { this.debitAccount = debitAccount; }
    public Account getCreditAccount() { return creditAccount; }
    public void setCreditAccount(Account creditAccount) { this.creditAccount = creditAccount; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public EntryStatus getStatus() { return status; }
    public void setStatus(EntryStatus status) { this.status = status; }
}
