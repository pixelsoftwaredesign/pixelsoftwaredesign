package com.pixelsoftwaredesign.pixerp.controller;

import com.pixelsoftwaredesign.pixerp.entity.Employee;
import com.pixelsoftwaredesign.pixerp.repository.EmployeeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeRepository employeeRepository;

    public EmployeeController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            List<Employee> employees = employeeRepository.findAll();
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            var result = employeeRepository.findById(id);
            if (result.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employee not found with id: " + id);
            }
            return ResponseEntity.ok(result.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/department/{id}")
    public ResponseEntity<?> getByDepartment(@PathVariable Long id) {
        try {
            List<Employee> employees = employeeRepository.findByDepartmentId(id);
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Employee employee) {
        try {
            Employee created = employeeRepository.save(employee);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Employee employee) {
        try {
            var result = employeeRepository.findById(id);
            if (result.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employee not found with id: " + id);
            }
            Employee existing = result.get();
            existing.setEmployeeCode(employee.getEmployeeCode());
            existing.setFirstName(employee.getFirstName());
            existing.setLastName(employee.getLastName());
            existing.setEmail(employee.getEmail());
            existing.setPhone(employee.getPhone());
            existing.setDepartment(employee.getDepartment());
            existing.setPosition(employee.getPosition());
            existing.setStatus(employee.getStatus());
            existing.setHireDate(employee.getHireDate());
            existing.setBirthDate(employee.getBirthDate());
            existing.setSalary(employee.getSalary());
            existing.setAddress(employee.getAddress());
            return ResponseEntity.ok(employeeRepository.save(existing));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            employeeRepository.deleteById(id);
            return ResponseEntity.ok("Employee deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
