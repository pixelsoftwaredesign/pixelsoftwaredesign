package com.pixelsoftwaredesign.pixerp.service;

import com.pixelsoftwaredesign.pixerp.entity.Employee;
import com.pixelsoftwaredesign.pixerp.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<Employee> getAll() {
        return employeeRepository.findAll();
    }

    public Employee getById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
    }

    public Employee create(Employee employee) {
        return employeeRepository.save(employee);
    }

    public Employee update(Long id, Employee updated) {
        Employee existing = getById(id);
        existing.setEmployeeCode(updated.getEmployeeCode());
        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setDepartment(updated.getDepartment());
        existing.setPosition(updated.getPosition());
        existing.setStatus(updated.getStatus());
        existing.setHireDate(updated.getHireDate());
        existing.setBirthDate(updated.getBirthDate());
        existing.setSalary(updated.getSalary());
        existing.setAddress(updated.getAddress());
        return employeeRepository.save(existing);
    }

    public void delete(Long id) {
        employeeRepository.deleteById(id);
    }

    public List<Employee> getByDepartment(Long departmentId) {
        return employeeRepository.findByDepartmentId(departmentId);
    }
}
