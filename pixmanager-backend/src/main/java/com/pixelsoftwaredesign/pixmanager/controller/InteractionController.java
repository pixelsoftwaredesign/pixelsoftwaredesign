package com.pixelsoftwaredesign.pixmanager.controller;

import com.pixelsoftwaredesign.pixmanager.entity.Interaction;
import com.pixelsoftwaredesign.pixmanager.service.InteractionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/interactions")
public class InteractionController {
    private final InteractionService service;
    public InteractionController(InteractionService service) { this.service = service; }

    @GetMapping
    public ResponseEntity<List<Interaction>> getAll() { return ResponseEntity.ok(service.getAll()); }
    @GetMapping("/{id}")
    public ResponseEntity<Interaction> getById(@PathVariable Long id) { return ResponseEntity.ok(service.getById(id)); }
    @PostMapping
    public ResponseEntity<Interaction> create(@RequestBody Interaction i) { return ResponseEntity.status(HttpStatus.CREATED).body(service.create(i)); }
    @PutMapping("/{id}")
    public ResponseEntity<Interaction> update(@PathVariable Long id, @RequestBody Interaction i) { return ResponseEntity.ok(service.update(id, i)); }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.noContent().build(); }
    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<Interaction>> getByCompany(@PathVariable Long companyId) { return ResponseEntity.ok(service.getByCompany(companyId)); }
    @GetMapping("/deal/{dealId}")
    public ResponseEntity<List<Interaction>> getByDeal(@PathVariable Long dealId) { return ResponseEntity.ok(service.getByDeal(dealId)); }
    @GetMapping("/follow-ups")
    public ResponseEntity<List<Interaction>> getPendingFollowUps() { return ResponseEntity.ok(service.getPendingFollowUps()); }
}
