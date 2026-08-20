package com.pixelsoftwaredesign.pixmanager.controller;

import com.pixelsoftwaredesign.pixmanager.entity.Deal;
import com.pixelsoftwaredesign.pixmanager.service.DealService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deals")
public class DealController {

    private final DealService dealService;

    public DealController(DealService dealService) {
        this.dealService = dealService;
    }

    @GetMapping
    public ResponseEntity<List<Deal>> getAllDeals() {
        return ResponseEntity.ok(dealService.getAllDeals());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Deal> getDealById(@PathVariable Long id) {
        return ResponseEntity.ok(dealService.getDealById(id));
    }

    @PostMapping
    public ResponseEntity<Deal> createDeal(@RequestBody Deal deal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(dealService.createDeal(deal));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Deal> updateDeal(@PathVariable Long id, @RequestBody Deal deal) {
        return ResponseEntity.ok(dealService.updateDeal(id, deal));
    }

    @PatchMapping("/{id}/stage")
    public ResponseEntity<Deal> updateDealStage(@PathVariable Long id, @RequestParam Deal.Stage stage) {
        return ResponseEntity.ok(dealService.updateDealStage(id, stage));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDeal(@PathVariable Long id) {
        dealService.deleteDeal(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stage/{stage}")
    public ResponseEntity<List<Deal>> getByStage(@PathVariable Deal.Stage stage) {
        return ResponseEntity.ok(dealService.getByStage(stage));
    }

    @GetMapping("/assigned/{userId}")
    public ResponseEntity<List<Deal>> getByAssignedTo(@PathVariable Long userId) {
        return ResponseEntity.ok(dealService.getByAssignedTo(userId));
    }
}
