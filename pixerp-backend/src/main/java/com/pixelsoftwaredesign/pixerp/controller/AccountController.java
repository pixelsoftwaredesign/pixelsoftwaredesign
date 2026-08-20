package com.pixelsoftwaredesign.pixerp.controller;

import com.pixelsoftwaredesign.pixerp.entity.Account;
import com.pixelsoftwaredesign.pixerp.repository.AccountRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountRepository accountRepository;

    public AccountController(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            List<Account> accounts = accountRepository.findAll();
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            var result = accountRepository.findById(id);
            if (result.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Account not found with id: " + id);
            }
            return ResponseEntity.ok(result.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<?> getByType(@PathVariable Account.AccountType type) {
        try {
            List<Account> accounts = accountRepository.findByType(type);
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Account account) {
        try {
            Account created = accountRepository.save(account);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Account account) {
        try {
            var result = accountRepository.findById(id);
            if (result.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Account not found with id: " + id);
            }
            Account existing = result.get();
            existing.setCode(account.getCode());
            existing.setName(account.getName());
            existing.setType(account.getType());
            existing.setDescription(account.getDescription());
            existing.setActive(account.isActive());
            return ResponseEntity.ok(accountRepository.save(existing));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            accountRepository.deleteById(id);
            return ResponseEntity.ok("Account deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
