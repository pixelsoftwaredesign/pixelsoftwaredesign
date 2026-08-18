package com.pixelsoftwaredesign.pixerp.service;

import com.pixelsoftwaredesign.pixerp.entity.Expense;
import com.pixelsoftwaredesign.pixerp.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public List<Expense> getAll() {
        return expenseRepository.findAll();
    }

    public Expense getById(Long id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));
    }

    public Expense create(Expense expense) {
        return expenseRepository.save(expense);
    }

    public Expense update(Long id, Expense updated) {
        Expense existing = getById(id);
        existing.setDescription(updated.getDescription());
        existing.setAmount(updated.getAmount());
        existing.setCategory(updated.getCategory());
        existing.setDate(updated.getDate());
        existing.setPaymentMethod(updated.getPaymentMethod());
        existing.setStatus(updated.getStatus());
        existing.setNotes(updated.getNotes());
        return expenseRepository.save(existing);
    }

    public void delete(Long id) {
        expenseRepository.deleteById(id);
    }

    public List<Expense> getByDateRange(LocalDate start, LocalDate end) {
        return expenseRepository.findByDateBetween(start, end);
    }

    public List<Expense> getByCategory(Expense.ExpenseCategory category) {
        return expenseRepository.findByCategory(category);
    }

    public BigDecimal getTotalByDateRange(LocalDate start, LocalDate end) {
        List<Expense> expenses = expenseRepository.findByDateBetween(start, end);
        return expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
