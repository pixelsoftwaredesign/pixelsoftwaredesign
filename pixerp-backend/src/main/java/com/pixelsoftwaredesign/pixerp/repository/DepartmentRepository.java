package com.pixelsoftwaredesign.pixerp.repository;

import com.pixelsoftwaredesign.pixerp.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
}
