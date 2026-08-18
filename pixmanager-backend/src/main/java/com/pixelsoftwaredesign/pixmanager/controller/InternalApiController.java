package com.pixelsoftwaredesign.pixmanager.controller;

import com.pixelsoftwaredesign.pixmanager.entity.Company;
import com.pixelsoftwaredesign.pixmanager.entity.Contact;
import com.pixelsoftwaredesign.pixmanager.entity.Deal;
import com.pixelsoftwaredesign.pixmanager.entity.Invoice;
import com.pixelsoftwaredesign.pixmanager.service.ContactService;
import com.pixelsoftwaredesign.pixmanager.service.CompanyService;
import com.pixelsoftwaredesign.pixmanager.service.DealService;
import com.pixelsoftwaredesign.pixmanager.service.InvoiceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/internal")
public class InternalApiController {

    private final ContactService contactService;
    private final CompanyService companyService;
    private final DealService dealService;
    private final InvoiceService invoiceService;

    public InternalApiController(ContactService contactService, CompanyService companyService,
                                  DealService dealService, InvoiceService invoiceService) {
        this.contactService = contactService;
        this.companyService = companyService;
        this.dealService = dealService;
        this.invoiceService = invoiceService;
    }

    @GetMapping("/contacts")
    public List<Contact> getContacts() {
        return contactService.getAllContacts();
    }

    @GetMapping("/companies")
    public List<Company> getCompanies() {
        return companyService.getAll();
    }

    @GetMapping("/deals")
    public List<Deal> getDeals() {
        return dealService.getAllDeals();
    }

    @GetMapping("/invoices")
    public List<Invoice> getInvoices() {
        return invoiceService.getAllInvoices();
    }
}
