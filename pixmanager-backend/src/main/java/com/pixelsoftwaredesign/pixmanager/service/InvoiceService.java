package com.pixelsoftwaredesign.pixmanager.service;

import com.pixelsoftwaredesign.pixmanager.entity.Invoice;
import com.pixelsoftwaredesign.pixmanager.repository.InvoiceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    public InvoiceService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public Invoice getInvoiceById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + id));
    }

    public Invoice createInvoice(Invoice invoice) {
        if (invoice.getInvoiceNumber() == null || invoice.getInvoiceNumber().isEmpty()) {
            invoice.setInvoiceNumber(generateInvoiceNumber(invoice.getType()));
        }
        invoice.setIssueDate(LocalDate.now());
        return invoiceRepository.save(invoice);
    }

    public Invoice updateInvoice(Long id, Invoice invoiceDetails) {
        Invoice invoice = getInvoiceById(id);
        invoice.setTotalAmount(invoiceDetails.getTotalAmount());
        invoice.setTaxAmount(invoiceDetails.getTaxAmount());
        invoice.setDueDate(invoiceDetails.getDueDate());
        invoice.setStatus(invoiceDetails.getStatus());
        return invoiceRepository.save(invoice);
    }

    public Invoice convertToInvoice(Long quotationId) {
        Invoice quotation = getInvoiceById(quotationId);
        if (quotation.getType() != Invoice.DocumentType.QUOTATION) {
            throw new RuntimeException("Can only convert quotations to invoices");
        }

        Invoice invoice = new Invoice();
        invoice.setDeal(quotation.getDeal());
        invoice.setCompany(quotation.getCompany());
        invoice.setInvoiceNumber(generateInvoiceNumber(Invoice.DocumentType.INVOICE));
        invoice.setType(Invoice.DocumentType.INVOICE);
        invoice.setStatus(Invoice.Status.DRAFT);
        invoice.setTotalAmount(quotation.getTotalAmount());
        invoice.setTaxAmount(quotation.getTaxAmount());
        invoice.setIssueDate(LocalDate.now());
        invoice.setDueDate(LocalDate.now().plusDays(30));

        return invoiceRepository.save(invoice);
    }

    public void deleteInvoice(Long id) {
        invoiceRepository.deleteById(id);
    }

    public List<Invoice> getByType(Invoice.DocumentType type) {
        return invoiceRepository.findByType(type);
    }

    public List<Invoice> getByStatus(Invoice.Status status) {
        return invoiceRepository.findByStatus(status);
    }

    private String generateInvoiceNumber(Invoice.DocumentType type) {
        String prefix = type == Invoice.DocumentType.QUOTATION ? "QUO" : "INV";
        long count = invoiceRepository.count() + 1;
        return String.format("%s-%04d", prefix, count);
    }
}
