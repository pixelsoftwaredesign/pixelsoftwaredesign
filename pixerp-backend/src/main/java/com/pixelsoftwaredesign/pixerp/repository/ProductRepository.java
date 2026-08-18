package com.pixelsoftwaredesign.pixerp.repository;

import com.pixelsoftwaredesign.pixerp.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryId(Long categoryId);
    Optional<Product> findBySku(String sku);
    List<Product> findByStockQuantityLessThan(Integer qty);
}
