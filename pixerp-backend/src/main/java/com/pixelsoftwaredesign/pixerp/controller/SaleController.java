package com.pixelsoftwaredesign.pixerp.controller;

import com.pixelsoftwaredesign.pixerp.entity.Sale;
import com.pixelsoftwaredesign.pixerp.entity.SaleItem;
import com.pixelsoftwaredesign.pixerp.repository.SaleItemRepository;
import com.pixelsoftwaredesign.pixerp.repository.SaleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "http://localhost:4201")
public class SaleController {

    private final SaleRepository saleRepository;
    private final SaleItemRepository saleItemRepository;

    public SaleController(SaleRepository saleRepository, SaleItemRepository saleItemRepository) {
        this.saleRepository = saleRepository;
        this.saleItemRepository = saleItemRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            List<Sale> sales = saleRepository.findAll();
            return ResponseEntity.ok(sales);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            var result = saleRepository.findById(id);
            if (result.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sale not found with id: " + id);
            }
            return ResponseEntity.ok(result.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody Map<String, Object> body) {
        try {
            Sale sale = new com.fasterxml.jackson.databind.ObjectMapper()
                    .convertValue(body.get("sale"), Sale.class);

            if (sale.getSaleNumber() == null) {
                sale.setSaleNumber("SALE-" + System.currentTimeMillis());
            }
            sale.setCreatedAt(LocalDateTime.now());
            Sale savedSale = saleRepository.save(sale);

            List<Map<String, Object>> items = (List<Map<String, Object>>) body.get("items");
            if (items != null) {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                for (Map<String, Object> itemMap : items) {
                    SaleItem item = mapper.convertValue(itemMap, SaleItem.class);
                    item.setSale(savedSale);
                    saleItemRepository.save(item);
                }
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(savedSale);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Sale sale) {
        try {
            var result = saleRepository.findById(id);
            if (result.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sale not found with id: " + id);
            }
            Sale existing = result.get();
            existing.setSaleNumber(sale.getSaleNumber());
            existing.setCashier(sale.getCashier());
            existing.setSubtotal(sale.getSubtotal());
            existing.setTaxAmount(sale.getTaxAmount());
            existing.setTotal(sale.getTotal());
            existing.setPaymentMethod(sale.getPaymentMethod());
            existing.setStatus(sale.getStatus());
            existing.setCustomerName(sale.getCustomerName());
            return ResponseEntity.ok(saleRepository.save(existing));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            saleRepository.deleteById(id);
            return ResponseEntity.ok("Sale deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
