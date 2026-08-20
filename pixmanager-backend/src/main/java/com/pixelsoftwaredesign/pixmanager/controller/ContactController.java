package com.pixelsoftwaredesign.pixmanager.controller;

import com.pixelsoftwaredesign.pixmanager.entity.Contact;
import com.pixelsoftwaredesign.pixmanager.service.ContactService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @GetMapping
    public ResponseEntity<List<Contact>> getAllContacts() {
        return ResponseEntity.ok(contactService.getAllContacts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contact> getContactById(@PathVariable Long id) {
        return ResponseEntity.ok(contactService.getContactById(id));
    }

    @PostMapping
    public ResponseEntity<Contact> createContact(@RequestBody Contact contact) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contactService.createContact(contact));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Contact> updateContact(@PathVariable Long id, @RequestBody Contact contact) {
        return ResponseEntity.ok(contactService.updateContact(id, contact));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        contactService.deleteContact(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<Contact>> getByCompanyId(@PathVariable Long companyId) {
        return ResponseEntity.ok(contactService.getByCompanyId(companyId));
    }
}
