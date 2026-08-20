package com.pixelsoftwaredesign.pixmanager.controller;

import com.pixelsoftwaredesign.pixmanager.entity.Company;
import com.pixelsoftwaredesign.pixmanager.service.CompanyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {
    private final CompanyService service;
    public CompanyController(CompanyService service) { this.service = service; }

    @GetMapping
    public ResponseEntity<List<Company>> getAll() { return ResponseEntity.ok(service.getAll()); }
    @GetMapping("/{id}")
    public ResponseEntity<Company> getById(@PathVariable Long id) { return ResponseEntity.ok(service.getById(id)); }
    @PostMapping
    public ResponseEntity<Company> create(@RequestBody Company c) { return ResponseEntity.status(HttpStatus.CREATED).body(service.create(c)); }
    @PutMapping("/{id}")
    public ResponseEntity<Company> update(@PathVariable Long id, @RequestBody Company c) { return ResponseEntity.ok(service.update(id, c)); }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.noContent().build(); }
    @GetMapping("/search")
    public ResponseEntity<List<Company>> search(@RequestParam String name) { return ResponseEntity.ok(service.searchByName(name)); }
    @GetMapping("/industry/{industry}")
    public ResponseEntity<List<Company>> getByIndustry(@PathVariable String industry) { return ResponseEntity.ok(service.getByIndustry(industry)); }
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Company>> getByType(@PathVariable String type) { return ResponseEntity.ok(service.getByType(type)); }
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Company>> getByStatus(@PathVariable String status) { return ResponseEntity.ok(service.getByStatus(status)); }
    @GetMapping("/segment/{segment}")
    public ResponseEntity<List<Company>> getBySegment(@PathVariable String segment) { return ResponseEntity.ok(service.getBySegment(segment)); }
}
