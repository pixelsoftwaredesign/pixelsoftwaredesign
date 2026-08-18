package com.pixelsoftwaredesign.pixerp.controller;

import com.pixelsoftwaredesign.pixerp.entity.SaleItem;
import com.pixelsoftwaredesign.pixerp.repository.SaleItemRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sale-items")
@CrossOrigin(origins = "http://localhost:4201")
public class SaleItemController {

    private final SaleItemRepository saleItemRepository;

    public SaleItemController(SaleItemRepository saleItemRepository) {
        this.saleItemRepository = saleItemRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            List<SaleItem> items = saleItemRepository.findAll();
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            var result = saleItemRepository.findById(id);
            if (result.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("SaleItem not found with id: " + id);
            }
            return ResponseEntity.ok(result.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/sale/{saleId}")
    public ResponseEntity<?> getBySale(@PathVariable Long saleId) {
        try {
            List<SaleItem> items = saleItemRepository.findBySaleId(saleId);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody SaleItem saleItem) {
        try {
            SaleItem created = saleItemRepository.save(saleItem);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody SaleItem saleItem) {
        try {
            var result = saleItemRepository.findById(id);
            if (result.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("SaleItem not found with id: " + id);
            }
            SaleItem existing = result.get();
            existing.setSale(saleItem.getSale());
            existing.setProduct(saleItem.getProduct());
            existing.setQuantity(saleItem.getQuantity());
            existing.setUnitPrice(saleItem.getUnitPrice());
            existing.setLineTotal(saleItem.getLineTotal());
            return ResponseEntity.ok(saleItemRepository.save(existing));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            saleItemRepository.deleteById(id);
            return ResponseEntity.ok("SaleItem deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
