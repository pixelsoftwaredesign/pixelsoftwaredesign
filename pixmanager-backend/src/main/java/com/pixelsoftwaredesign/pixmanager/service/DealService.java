package com.pixelsoftwaredesign.pixmanager.service;

import com.pixelsoftwaredesign.pixmanager.entity.Deal;
import com.pixelsoftwaredesign.pixmanager.entity.Project;
import com.pixelsoftwaredesign.pixmanager.repository.DealRepository;
import com.pixelsoftwaredesign.pixmanager.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DealService {

    private final DealRepository dealRepository;
    private final ProjectRepository projectRepository;

    public DealService(DealRepository dealRepository, ProjectRepository projectRepository) {
        this.dealRepository = dealRepository;
        this.projectRepository = projectRepository;
    }

    public List<Deal> getAllDeals() {
        return dealRepository.findAll();
    }

    public Deal getDealById(Long id) {
        return dealRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Deal not found with id: " + id));
    }

    public Deal createDeal(Deal deal) {
        deal.setStage(Deal.Stage.PROSPECTING);
        return dealRepository.save(deal);
    }

    public Deal updateDeal(Long id, Deal dealDetails) {
        Deal deal = getDealById(id);
        deal.setTitle(dealDetails.getTitle());
        deal.setCompany(dealDetails.getCompany());
        deal.setContact(dealDetails.getContact());
        deal.setAssignedTo(dealDetails.getAssignedTo());
        deal.setDealValue(dealDetails.getDealValue());
        deal.setExpectedClosingDate(dealDetails.getExpectedClosingDate());
        return dealRepository.save(deal);
    }

    @Transactional
    public Deal updateDealStage(Long id, Deal.Stage newStage) {
        Deal deal = getDealById(id);
        deal.setStage(newStage);

        if (newStage == Deal.Stage.WON) {
            Project project = new Project();
            project.setDeal(deal);
            project.setName(deal.getTitle() + " - Project");
            project.setStatus(Project.Status.PLANNING);
            projectRepository.save(project);
        }

        return dealRepository.save(deal);
    }

    public void deleteDeal(Long id) {
        dealRepository.deleteById(id);
    }

    public List<Deal> getByStage(Deal.Stage stage) {
        return dealRepository.findByStage(stage);
    }

    public List<Deal> getByAssignedTo(Long userId) {
        return dealRepository.findByAssignedToId(userId);
    }
}
