package com.pixelsoftwaredesign.pixmanager.repository;

import com.pixelsoftwaredesign.pixmanager.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    List<Company> findByNameContainingIgnoreCase(String name);
    List<Company> findByIndustry(String industry);
    List<Company> findByType(String type);
    List<Company> findByStatus(String status);
    List<Company> findBySegment(String segment);
    List<Company> findBySize(String size);
}
