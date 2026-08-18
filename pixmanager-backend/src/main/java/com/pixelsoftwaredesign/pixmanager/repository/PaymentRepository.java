package com.pixelsoftwaredesign.pixmanager.repository;

import com.pixelsoftwaredesign.pixmanager.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByInvoiceId(Long invoiceId);
    List<Payment> findByStatus(Payment.Status status);
}
