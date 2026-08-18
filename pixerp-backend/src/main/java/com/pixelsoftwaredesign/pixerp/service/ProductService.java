package com.pixelsoftwaredesign.pixerp.service;

import com.pixelsoftwaredesign.pixerp.entity.Product;
import com.pixelsoftwaredesign.pixerp.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public Product create(Product product) {
        return productRepository.save(product);
    }

    public Product update(Long id, Product updated) {
        Product existing = getById(id);
        existing.setName(updated.getName());
        existing.setSku(updated.getSku());
        existing.setDescription(updated.getDescription());
        existing.setCategory(updated.getCategory());
        existing.setCostPrice(updated.getCostPrice());
        existing.setSellingPrice(updated.getSellingPrice());
        existing.setStockQuantity(updated.getStockQuantity());
        existing.setMinStock(updated.getMinStock());
        existing.setActive(updated.isActive());
        existing.setUnit(updated.getUnit());
        return productRepository.save(existing);
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    public List<Product> getByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public List<Product> getLowStock() {
        List<Product> all = productRepository.findAll();
        return all.stream()
                .filter(p -> p.getStockQuantity() < p.getMinStock())
                .toList();
    }

    public Product decrementStock(Long productId, Integer quantity) {
        Product product = getById(productId);
        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock for product: " + product.getName());
        }
        product.setStockQuantity(product.getStockQuantity() - quantity);
        return productRepository.save(product);
    }
}
