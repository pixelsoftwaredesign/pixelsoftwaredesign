package com.pixelsoftwaredesign.pixerp.service;

import com.pixelsoftwaredesign.pixerp.entity.Attendance;
import com.pixelsoftwaredesign.pixerp.repository.AttendanceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public AttendanceService(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    public List<Attendance> getAll() {
        return attendanceRepository.findAll();
    }

    public Attendance getById(Long id) {
        return attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance not found with id: " + id));
    }

    public Attendance create(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }

    public Attendance update(Long id, Attendance updated) {
        Attendance existing = getById(id);
        existing.setEmployee(updated.getEmployee());
        existing.setDate(updated.getDate());
        existing.setClockIn(updated.getClockIn());
        existing.setClockOut(updated.getClockOut());
        existing.setStatus(updated.getStatus());
        existing.setNotes(updated.getNotes());
        return attendanceRepository.save(existing);
    }

    public void delete(Long id) {
        attendanceRepository.deleteById(id);
    }

    public Attendance getByEmployeeAndDate(Long employeeId, LocalDate date) {
        return attendanceRepository.findByEmployeeIdAndDate(employeeId, date)
                .orElseThrow(() -> new RuntimeException("Attendance not found for employee " + employeeId + " on " + date));
    }

    public List<Attendance> getByDate(LocalDate date) {
        return attendanceRepository.findByDate(date);
    }
}
