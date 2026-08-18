package com.pixelsoftwaredesign.pixerp.service;

import com.pixelsoftwaredesign.pixerp.entity.Product;
import com.pixelsoftwaredesign.pixerp.entity.Sale;
import com.pixelsoftwaredesign.pixerp.entity.SaleItem;
import com.pixelsoftwaredesign.pixerp.repository.ProductRepository;
import com.pixelsoftwaredesign.pixerp.repository.SaleItemRepository;
import com.pixelsoftwaredesign.pixerp.repository.SaleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class SaleService {

    private final SaleRepository saleRepository;
    private final SaleItemRepository saleItemRepository;
    private final ProductRepository productRepository;

    public SaleService(SaleRepository saleRepository, SaleItemRepository saleItemRepository, ProductRepository productRepository) {
        this.saleRepository = saleRepository;
        this.saleItemRepository = saleItemRepository;
        this.productRepository = productRepository;
    }

    public List<Sale> getAll() {
        return saleRepository.findAll();
    }

    public Sale getById(Long id) {
        return saleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sale not found with id: " + id));
    }

    public Sale create(Sale sale) {
        return saleRepository.save(sale);
    }

    public Sale update(Long id, Sale updated) {
        Sale existing = getById(id);
        existing.setCashier(updated.getCashier());
        existing.setPaymentMethod(updated.getPaymentMethod());
        existing.setStatus(updated.getStatus());
        existing.setCustomerName(updated.getCustomerName());
        return saleRepository.save(existing);
    }

    public void delete(Long id) {
        saleRepository.deleteById(id);
    }

    @Transactional
    public Sale createSale(Sale sale, List<Map<String, Object>> items) {
        BigDecimal subtotal = BigDecimal.ZERO;

        sale.setSubtotal(BigDecimal.ZERO);
        sale.setTaxAmount(BigDecimal.ZERO);
        sale.setTotal(BigDecimal.ZERO);
        Sale savedSale = saleRepository.save(sale);

        for (Map<String, Object> item : items) {
            Long productId = ((Number) item.get("productId")).longValue();
            Integer quantity = ((Number) item.get("quantity")).intValue();
            BigDecimal unitPrice = new BigDecimal(item.get("unitPrice").toString());

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

            if (product.getStockQuantity() < quantity) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(quantity));
            subtotal = subtotal.add(lineTotal);

            SaleItem saleItem = new SaleItem(savedSale, product, quantity, unitPrice);
            saleItem.setLineTotal(lineTotal);
            saleItemRepository.save(saleItem);

            product.setStockQuantity(product.getStockQuantity() - quantity);
            productRepository.save(product);
        }

        BigDecimal taxAmount = subtotal.multiply(new BigDecimal("0.19"));
        BigDecimal total = subtotal.add(taxAmount);

        savedSale.setSubtotal(subtotal);
        savedSale.setTaxAmount(taxAmount);
        savedSale.setTotal(total);

        String saleNumber = "SL-" + String.format("%04d", savedSale.getId());
        savedSale.setSaleNumber(saleNumber);

        return saleRepository.save(savedSale);
    }

    public List<Sale> getByDateRange(LocalDateTime start, LocalDateTime end) {
        return saleRepository.findAll().stream()
                .filter(s -> s.getCreatedAt().isAfter(start) && s.getCreatedAt().isBefore(end))
                .toList();
    }
}
