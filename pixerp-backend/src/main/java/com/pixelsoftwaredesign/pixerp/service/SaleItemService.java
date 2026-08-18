package com.pixelsoftwaredesign.pixerp.service;

import com.pixelsoftwaredesign.pixerp.entity.SaleItem;
import com.pixelsoftwaredesign.pixerp.repository.SaleItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SaleItemService {

    private final SaleItemRepository saleItemRepository;

    public SaleItemService(SaleItemRepository saleItemRepository) {
        this.saleItemRepository = saleItemRepository;
    }

    public List<SaleItem> getBySaleId(Long saleId) {
        return saleItemRepository.findBySaleId(saleId);
    }
}
