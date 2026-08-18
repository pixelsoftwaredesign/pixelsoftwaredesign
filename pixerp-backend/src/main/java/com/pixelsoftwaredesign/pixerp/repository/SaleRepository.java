package com.pixelsoftwaredesign.pixerp.repository;

import com.pixelsoftwaredesign.pixerp.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    Optional<Sale> findBySaleNumber(String saleNumber);
    List<Sale> findByCashierId(Long cashierId);
}
