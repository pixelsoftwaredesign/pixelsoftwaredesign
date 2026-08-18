package com.pixelsoftwaredesign.pixmanager.service;

import com.pixelsoftwaredesign.pixmanager.entity.InvoiceItem;
import com.pixelsoftwaredesign.pixmanager.repository.InvoiceItemRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class InvoiceItemService {
    private final InvoiceItemRepository repo;
    public InvoiceItemService(InvoiceItemRepository repo) { this.repo = repo; }

    public List<InvoiceItem> getByInvoice(Long invoiceId) { return repo.findByInvoiceId(invoiceId); }
    public InvoiceItem create(InvoiceItem item) {
        item.calculateLineTotal();
        return repo.save(item);
    }
    public InvoiceItem update(Long id, InvoiceItem details) {
        InvoiceItem item = repo.findById(id).orElseThrow(() -> new RuntimeException("Item not found"));
        item.setDescription(details.getDescription());
        item.setQuantity(details.getQuantity());
        item.setUnitPrice(details.getUnitPrice());
        item.setTaxRate(details.getTaxRate());
        item.setDiscountPercent(details.getDiscountPercent());
        item.calculateLineTotal();
        return repo.save(item);
    }
    public void delete(Long id) { repo.deleteById(id); }
}
