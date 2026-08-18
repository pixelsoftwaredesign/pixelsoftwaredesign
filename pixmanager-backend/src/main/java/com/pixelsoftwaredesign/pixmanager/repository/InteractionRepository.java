package com.pixelsoftwaredesign.pixmanager.repository;

import com.pixelsoftwaredesign.pixmanager.entity.Interaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InteractionRepository extends JpaRepository<Interaction, Long> {
    List<Interaction> findByCompanyId(Long companyId);
    List<Interaction> findByDealId(Long dealId);
    List<Interaction> findByType(Interaction.Type type);
    List<Interaction> findByFollowUpStatus(Interaction.FollowUpStatus status);
}
