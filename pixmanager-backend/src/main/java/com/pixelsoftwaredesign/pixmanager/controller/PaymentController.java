package com.pixelsoftwaredesign.pixmanager.controller;

import com.pixelsoftwaredesign.pixmanager.entity.Payment;
import com.pixelsoftwaredesign.pixmanager.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    private final PaymentService service;
    public PaymentController(PaymentService service) { this.service = service; }

    @GetMapping
    public ResponseEntity<List<Payment>> getAll() { return ResponseEntity.ok(service.getAll()); }
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getById(@PathVariable Long id) { return ResponseEntity.ok(service.getById(id)); }
    @PostMapping
    public ResponseEntity<Payment> create(@RequestBody Payment p) { return ResponseEntity.status(HttpStatus.CREATED).body(service.create(p)); }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.noContent().build(); }
    @GetMapping("/invoice/{invoiceId}")
    public ResponseEntity<List<Payment>> getByInvoice(@PathVariable Long invoiceId) { return ResponseEntity.ok(service.getByInvoice(invoiceId)); }
}
