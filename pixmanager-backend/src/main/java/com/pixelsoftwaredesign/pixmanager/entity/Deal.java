package com.pixelsoftwaredesign.pixmanager.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "deals")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Deal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id")
    private Contact contact;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Stage stage = Stage.PROSPECTING;

    @Column(name = "deal_value", nullable = false, precision = 12, scale = 2)
    private BigDecimal dealValue = BigDecimal.ZERO;

    @Column(name = "probability", precision = 5, scale = 2)
    private BigDecimal probability = BigDecimal.ZERO;

    @Column(name = "weighted_value", precision = 12, scale = 2)
    private BigDecimal weightedValue = BigDecimal.ZERO;

    @Column(name = "expected_closing_date")
    private LocalDate expectedClosingDate;

    @Column(length = 50)
    private String priority = "MEDIUM";

    @Column(length = 50)
    private String source;

    @Column(name = "lost_reason", length = 200)
    private String lostReason;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @PreUpdate
    @PrePersist
    public void calculateWeightedValue() {
        this.weightedValue = dealValue.multiply(probability.divide(BigDecimal.valueOf(100)));
    }

    public enum Stage {
        PROSPECTING, QUALIFICATION, PROPOSAL, NEGOTIATION, WON, LOST
    }

    public Deal() {}

    public Deal(String title, Company company, Contact contact, User assignedTo,
                Stage stage, BigDecimal dealValue, LocalDate expectedClosingDate) {
        this.title = title;
        this.company = company;
        this.contact = contact;
        this.assignedTo = assignedTo;
        this.stage = stage;
        this.dealValue = dealValue;
        this.expectedClosingDate = expectedClosingDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }
    public Contact getContact() { return contact; }
    public void setContact(Contact contact) { this.contact = contact; }
    public User getAssignedTo() { return assignedTo; }
    public void setAssignedTo(User assignedTo) { this.assignedTo = assignedTo; }
    public Stage getStage() { return stage; }
    public void setStage(Stage stage) { this.stage = stage; }
    public BigDecimal getDealValue() { return dealValue; }
    public void setDealValue(BigDecimal dealValue) { this.dealValue = dealValue; }
    public BigDecimal getProbability() { return probability; }
    public void setProbability(BigDecimal probability) { this.probability = probability; }
    public BigDecimal getWeightedValue() { return weightedValue; }
    public void setWeightedValue(BigDecimal weightedValue) { this.weightedValue = weightedValue; }
    public LocalDate getExpectedClosingDate() { return expectedClosingDate; }
    public void setExpectedClosingDate(LocalDate expectedClosingDate) { this.expectedClosingDate = expectedClosingDate; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getLostReason() { return lostReason; }
    public void setLostReason(String lostReason) { this.lostReason = lostReason; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
