package com.pixelsoftwaredesign.pixerp.service;

import com.pixelsoftwaredesign.pixerp.entity.Account;
import com.pixelsoftwaredesign.pixerp.repository.AccountRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountService {

    private final AccountRepository accountRepository;

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public List<Account> getAll() {
        return accountRepository.findAll();
    }

    public Account getById(Long id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + id));
    }

    public Account create(Account account) {
        return accountRepository.save(account);
    }

    public Account update(Long id, Account updated) {
        Account existing = getById(id);
        existing.setCode(updated.getCode());
        existing.setName(updated.getName());
        existing.setType(updated.getType());
        existing.setDescription(updated.getDescription());
        existing.setActive(updated.isActive());
        return accountRepository.save(existing);
    }

    public void delete(Long id) {
        accountRepository.deleteById(id);
    }

    public List<Account> getByType(Account.AccountType type) {
        return accountRepository.findByType(type);
    }
}
