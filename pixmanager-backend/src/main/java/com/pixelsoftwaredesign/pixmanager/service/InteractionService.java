package com.pixelsoftwaredesign.pixmanager.service;

import com.pixelsoftwaredesign.pixmanager.entity.Interaction;
import com.pixelsoftwaredesign.pixmanager.repository.InteractionRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class InteractionService {
    private final InteractionRepository repo;
    public InteractionService(InteractionRepository repo) { this.repo = repo; }

    public List<Interaction> getAll() { return repo.findAll(); }
    public Interaction getById(Long id) { return repo.findById(id).orElseThrow(() -> new RuntimeException("Interaction not found")); }
    public Interaction create(Interaction i) { return repo.save(i); }
    public Interaction update(Long id, Interaction details) {
        Interaction i = getById(id);
        i.setType(details.getType());
        i.setSubject(details.getSubject());
        i.setDescription(details.getDescription());
        i.setInteractionDate(details.getInteractionDate());
        i.setFollowUpDate(details.getFollowUpDate());
        i.setFollowUpStatus(details.getFollowUpStatus());
        i.setCompany(details.getCompany());
        i.setContact(details.getContact());
        i.setDeal(details.getDeal());
        return repo.save(i);
    }
    public void delete(Long id) { repo.deleteById(id); }
    public List<Interaction> getByCompany(Long companyId) { return repo.findByCompanyId(companyId); }
    public List<Interaction> getByDeal(Long dealId) { return repo.findByDealId(dealId); }
    public List<Interaction> getPendingFollowUps() { return repo.findByFollowUpStatus(Interaction.FollowUpStatus.PENDING); }
}
