package com.pixelsoftwaredesign.pixmanager.service;

import com.pixelsoftwaredesign.pixmanager.entity.Company;
import com.pixelsoftwaredesign.pixmanager.repository.CompanyRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CompanyService {
    private final CompanyRepository repo;
    public CompanyService(CompanyRepository repo) { this.repo = repo; }

    public List<Company> getAll() { return repo.findAll(); }
    public Company getById(Long id) { return repo.findById(id).orElseThrow(() -> new RuntimeException("Company not found")); }
    public Company create(Company c) { return repo.save(c); }
    public Company update(Long id, Company details) {
        Company c = getById(id);
        c.setName(details.getName()); c.setTaxId(details.getTaxId()); c.setIndustry(details.getIndustry());
        c.setType(details.getType()); c.setStatus(details.getStatus()); c.setSegment(details.getSegment());
        c.setSize(details.getSize()); c.setAnnualRevenue(details.getAnnualRevenue());
        c.setWebsite(details.getWebsite()); c.setAddress(details.getAddress());
        c.setCity(details.getCity()); c.setCountry(details.getCountry());
        c.setPhone(details.getPhone()); c.setEmail(details.getEmail()); c.setNotes(details.getNotes());
        return repo.save(c);
    }
    public void delete(Long id) { repo.deleteById(id); }
    public List<Company> searchByName(String name) { return repo.findByNameContainingIgnoreCase(name); }
    public List<Company> getByIndustry(String industry) { return repo.findByIndustry(industry); }
    public List<Company> getByType(String type) { return repo.findByType(type); }
    public List<Company> getByStatus(String status) { return repo.findByStatus(status); }
    public List<Company> getBySegment(String segment) { return repo.findBySegment(segment); }
    public List<Company> getBySize(String size) { return repo.findBySize(size); }
}
