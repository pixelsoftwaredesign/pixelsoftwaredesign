package com.pixelsoftwaredesign.pixmanager.controller;

import com.pixelsoftwaredesign.pixmanager.entity.InvoiceItem;
import com.pixelsoftwaredesign.pixmanager.service.InvoiceItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/invoice-items")
@CrossOrigin(origins = "http://localhost:4200")
public class InvoiceItemController {
    private final InvoiceItemService service;
    public InvoiceItemController(InvoiceItemService service) { this.service = service; }

    @GetMapping("/invoice/{invoiceId}")
    public ResponseEntity<List<InvoiceItem>> getByInvoice(@PathVariable Long invoiceId) { return ResponseEntity.ok(service.getByInvoice(invoiceId)); }
    @PostMapping
    public ResponseEntity<InvoiceItem> create(@RequestBody InvoiceItem item) { return ResponseEntity.status(HttpStatus.CREATED).body(service.create(item)); }
    @PutMapping("/{id}")
    public ResponseEntity<InvoiceItem> update(@PathVariable Long id, @RequestBody InvoiceItem item) { return ResponseEntity.ok(service.update(id, item)); }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.noContent().build(); }
}
