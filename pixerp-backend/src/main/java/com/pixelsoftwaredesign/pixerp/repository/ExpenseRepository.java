package com.pixelsoftwaredesign.pixerp.repository;

import com.pixelsoftwaredesign.pixerp.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByDateBetween(LocalDate start, LocalDate end);
    List<Expense> findByCategory(Expense.ExpenseCategory category);
}
