package com.pixelsoftwaredesign.pixmanager.repository;

import com.pixelsoftwaredesign.pixmanager.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByStatus(Project.Status status);
    List<Project> findByDealId(Long dealId);
}
