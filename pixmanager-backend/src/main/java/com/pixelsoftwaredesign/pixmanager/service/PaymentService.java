package com.pixelsoftwaredesign.pixmanager.service;

import com.pixelsoftwaredesign.pixmanager.entity.Payment;
import com.pixelsoftwaredesign.pixmanager.entity.Invoice;
import com.pixelsoftwaredesign.pixmanager.repository.PaymentRepository;
import com.pixelsoftwaredesign.pixmanager.repository.InvoiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class PaymentService {
    private final PaymentRepository repo;
    private final InvoiceRepository invoiceRepo;

    public PaymentService(PaymentRepository repo, InvoiceRepository invoiceRepo) {
        this.repo = repo;
        this.invoiceRepo = invoiceRepo;
    }

    public List<Payment> getAll() { return repo.findAll(); }
    public Payment getById(Long id) { return repo.findById(id).orElseThrow(() -> new RuntimeException("Payment not found")); }

    @Transactional
    public Payment create(Payment payment) {
        Payment saved = repo.save(payment);
        updateInvoiceStatus(payment.getInvoice().getId());
        return saved;
    }

    public void delete(Long id) { repo.deleteById(id); }
    public List<Payment> getByInvoice(Long invoiceId) { return repo.findByInvoiceId(invoiceId); }

    private void updateInvoiceStatus(Long invoiceId) {
        Invoice invoice = invoiceRepo.findById(invoiceId).orElse(null);
        if (invoice == null) return;
        double totalPaid = repo.findByInvoiceId(invoiceId).stream()
                .filter(p -> p.getStatus() == Payment.Status.COMPLETED)
                .mapToDouble(p -> p.getAmount().doubleValue())
                .sum();
        if (totalPaid >= invoice.getTotalAmount().doubleValue()) {
            invoice.setStatus(Invoice.Status.PAID);
        } else if (totalPaid > 0) {
            invoice.setStatus(Invoice.Status.SENT);
        }
        invoiceRepo.save(invoice);
    }
}
