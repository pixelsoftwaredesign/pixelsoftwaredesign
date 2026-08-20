package com.pixelsoftwaredesign.pixerp.config;

import com.pixelsoftwaredesign.pixerp.entity.*;
import com.pixelsoftwaredesign.pixerp.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final AccountRepository accountRepository;
    private final JournalEntryRepository journalEntryRepository;
    private final ExpenseRepository expenseRepository;
    private final AttendanceRepository attendanceRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, CategoryRepository categoryRepository,
                           ProductRepository productRepository, DepartmentRepository departmentRepository,
                           EmployeeRepository employeeRepository, AccountRepository accountRepository,
                           JournalEntryRepository journalEntryRepository, ExpenseRepository expenseRepository,
                           AttendanceRepository attendanceRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.departmentRepository = departmentRepository;
        this.employeeRepository = employeeRepository;
        this.accountRepository = accountRepository;
        this.journalEntryRepository = journalEntryRepository;
        this.expenseRepository = expenseRepository;
        this.attendanceRepository = attendanceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return; // Skip if data already seeded
        User admin = userRepository.save(new User("admin", "admin@pixelsoftwaredesign.com", passwordEncoder.encode("admin123"), User.Role.ADMIN));
        User sales = userRepository.save(new User("sales1", "sales@pixelsoftwaredesign.com", passwordEncoder.encode("sales123"), User.Role.STAFF));
        User pm = userRepository.save(new User("pm1", "pm@pixelsoftwaredesign.com", passwordEncoder.encode("pm123"), User.Role.MANAGER));
        User cashier = userRepository.save(new User("cashier1", "cashier@pixelsoftwaredesign.com", passwordEncoder.encode("cashier123"), User.Role.CASHIER));

        Category electronics = categoryRepository.save(new Category("Electronics", "Electronic devices and accessories"));
        Category clothing = categoryRepository.save(new Category("Clothing", "Apparel and fashion items"));
        Category food = categoryRepository.save(new Category("Food & Beverage", "Food products and beverages"));
        Category office = categoryRepository.save(new Category("Office Supplies", "Stationery and office materials"));
        Category services = categoryRepository.save(new Category("Services", "Professional services"));

        Product p1 = new Product("Samsung Galaxy A54", "ELEC-001", electronics, new BigDecimal("850.00"), new BigDecimal("1299.00"), 25);
        p1.setUnit("PCS"); productRepository.save(p1);
        Product p2 = new Product("Huawei MatePad SE", "ELEC-002", electronics, new BigDecimal("620.00"), new BigDecimal("999.00"), 15);
        p2.setUnit("PCS"); productRepository.save(p2);
        Product p3 = new Product("JBL Tune 520BT", "ELEC-003", electronics, new BigDecimal("75.00"), new BigDecimal("149.00"), 40);
        p3.setUnit("PCS"); productRepository.save(p3);
        Product p4 = new Product("Chemise Hawarii", "CLTH-001", clothing, new BigDecimal("35.00"), new BigDecimal("79.00"), 50);
        p4.setUnit("PCS"); productRepository.save(p4);
        Product p5 = new Product("Jean Classique Homme", "CLTH-002", clothing, new BigDecimal("55.00"), new BigDecimal("119.00"), 30);
        p5.setUnit("PCS"); productRepository.save(p5);
        Product p6 = new Product("Huile d'Olive Extra Vierge 1L", "FOOD-001", food, new BigDecimal("28.00"), new BigDecimal("52.00"), 100);
        p6.setUnit("BTL"); productRepository.save(p6);
        Product p7 = new Product("Dattes Deglet Nour 500g", "FOOD-002", food, new BigDecimal("18.00"), new BigDecimal("35.00"), 80);
        p7.setUnit("PKG"); productRepository.save(p7);
        Product p8 = new Product("Cafe Turque Kahoua 250g", "FOOD-003", food, new BigDecimal("12.00"), new BigDecimal("25.00"), 60);
        p8.setUnit("PKG"); productRepository.save(p8);
        Product p9 = new Product("Papier A4 Ream 500 feuilles", "OFFC-001", office, new BigDecimal("22.00"), new BigDecimal("42.00"), 120);
        p9.setUnit("PKG"); productRepository.save(p9);
        Product p10 = new Product("Consultation Comptable (heure)", "SRVC-001", services, new BigDecimal("0.00"), new BigDecimal("150.00"), 999);
        p10.setUnit("HR"); productRepository.save(p10);

        Department salesDept = departmentRepository.save(new Department("Sales", "Sales and customer relations department"));
        Department operations = departmentRepository.save(new Department("Operations", "Operations and logistics department"));

        Employee e1 = new Employee();
        e1.setEmployeeCode("EMP-0001");
        e1.setFirstName("Ahmed");
        e1.setLastName("Ben Salah");
        e1.setEmail("ahmed.bensalah@pixerp.tn");
        e1.setPhone("+216 71 234 567");
        e1.setDepartment(salesDept);
        e1.setPosition("Sales Manager");
        e1.setHireDate(LocalDate.of(2023, 1, 15));
        e1.setSalary(new BigDecimal("1800.00"));
        e1.setAddress("Avenue Habib Bourguiba, Tunis");
        employeeRepository.save(e1);

        Employee e2 = new Employee();
        e2.setEmployeeCode("EMP-0002");
        e2.setFirstName("Fatma");
        e2.setLastName("Khelifi");
        e2.setEmail("fatma.khelifi@pixerp.tn");
        e2.setPhone("+216 74 345 678");
        e2.setDepartment(salesDept);
        e2.setPosition("Cashier");
        e2.setHireDate(LocalDate.of(2023, 6, 1));
        e2.setSalary(new BigDecimal("1200.00"));
        e2.setAddress("Rue de la Liberte, Sfax");
        employeeRepository.save(e2);

        Employee e3 = new Employee();
        e3.setEmployeeCode("EMP-0003");
        e3.setFirstName("Mohamed");
        e3.setLastName("Trabelsi");
        e3.setEmail("mohamed.trabelsi@pixerp.tn");
        e3.setPhone("+216 73 456 789");
        e3.setDepartment(operations);
        e3.setPosition("Operations Supervisor");
        e3.setHireDate(LocalDate.of(2022, 9, 10));
        e3.setSalary(new BigDecimal("1600.00"));
        e3.setAddress("Avenue 14 Janvier, Sousse");
        employeeRepository.save(e3);

        Employee e4 = new Employee();
        e4.setEmployeeCode("EMP-0004");
        e4.setFirstName("Sarra");
        e4.setLastName("Mansour");
        e4.setEmail("sarra.mansour@pixerp.tn");
        e4.setPhone("+216 71 567 890");
        e4.setDepartment(operations);
        e4.setPosition("Warehouse Clerk");
        e4.setHireDate(LocalDate.of(2024, 3, 1));
        e4.setSalary(new BigDecimal("1000.00"));
        e4.setAddress("Centre Urbain Nord, Tunis");
        employeeRepository.save(e4);

        Account cash = new Account("1000", "Cash", Account.AccountType.ASSET);
        cash.setDescription("Cash on hand and in registers");
        accountRepository.save(cash);
        Account payables = new Account("2000", "Accounts Payable", Account.AccountType.LIABILITY);
        payables.setDescription("Money owed to suppliers");
        accountRepository.save(payables);
        Account equity = new Account("3000", "Owner Equity", Account.AccountType.EQUITY);
        equity.setDescription("Owner investment in the business");
        accountRepository.save(equity);
        Account revenue = new Account("4000", "Sales Revenue", Account.AccountType.REVENUE);
        revenue.setDescription("Income from sales");
        accountRepository.save(revenue);
        Account opExpenses = new Account("5000", "Operating Expenses", Account.AccountType.EXPENSE);
        opExpenses.setDescription("Day-to-day business expenses");
        accountRepository.save(opExpenses);

        JournalEntry je1 = new JournalEntry();
        je1.setEntryNumber("JE-0001");
        je1.setDate(LocalDate.of(2026, 8, 1));
        je1.setDescription("Initial cash deposit");
        je1.setDebitAccount(cash);
        je1.setCreditAccount(equity);
        je1.setAmount(new BigDecimal("50000.00"));
        je1.setStatus(JournalEntry.EntryStatus.POSTED);
        journalEntryRepository.save(je1);

        JournalEntry je2 = new JournalEntry();
        je2.setEntryNumber("JE-0002");
        je2.setDate(LocalDate.of(2026, 8, 5));
        je2.setDescription("Sale to Walk-in Customer");
        je2.setDebitAccount(cash);
        je2.setCreditAccount(revenue);
        je2.setAmount(new BigDecimal("350.00"));
        je2.setStatus(JournalEntry.EntryStatus.POSTED);
        journalEntryRepository.save(je2);

        JournalEntry je3 = new JournalEntry();
        je3.setEntryNumber("JE-0003");
        je3.setDate(LocalDate.of(2026, 8, 10));
        je3.setDescription("Office rent payment");
        je3.setDebitAccount(opExpenses);
        je3.setCreditAccount(cash);
        je3.setAmount(new BigDecimal("1200.00"));
        je3.setStatus(JournalEntry.EntryStatus.POSTED);
        journalEntryRepository.save(je3);

        Expense ex1 = new Expense();
        ex1.setDescription("Monthly Office Rent");
        ex1.setAmount(new BigDecimal("1200.00"));
        ex1.setCategory(Expense.ExpenseCategory.RENT);
        ex1.setDate(LocalDate.of(2026, 8, 1));
        ex1.setPaymentMethod(Expense.PaymentMethod.TRANSFER);
        ex1.setStatus(Expense.ExpenseStatus.APPROVED);
        ex1.setNotes("Rent for August 2026");
        expenseRepository.save(ex1);

        Expense ex2 = new Expense();
        ex2.setDescription("Electricity Bill - August");
        ex2.setAmount(new BigDecimal("280.00"));
        ex2.setCategory(Expense.ExpenseCategory.UTILITIES);
        ex2.setDate(LocalDate.of(2026, 8, 15));
        ex2.setPaymentMethod(Expense.PaymentMethod.CASH);
        ex2.setStatus(Expense.ExpenseStatus.APPROVED);
        ex2.setNotes("EDC electricity");
        expenseRepository.save(ex2);

        Expense ex3 = new Expense();
        ex3.setDescription("Marketing Flyers Printing");
        ex3.setAmount(new BigDecimal("150.00"));
        ex3.setCategory(Expense.ExpenseCategory.MARKETING);
        ex3.setDate(LocalDate.of(2026, 8, 20));
        ex3.setPaymentMethod(Expense.PaymentMethod.CARD);
        ex3.setStatus(Expense.ExpenseStatus.PENDING);
        ex3.setNotes("Flyers for back-to-school promotion");
        expenseRepository.save(ex3);

        Attendance a1 = new Attendance();
        a1.setEmployee(e1);
        a1.setDate(LocalDate.of(2026, 8, 18));
        a1.setClockIn(LocalTime.of(8, 0));
        a1.setClockOut(LocalTime.of(17, 0));
        a1.setStatus(Attendance.AttendanceStatus.PRESENT);
        a1.setNotes("Normal working day");
        attendanceRepository.save(a1);

        Attendance a2 = new Attendance();
        a2.setEmployee(e2);
        a2.setDate(LocalDate.of(2026, 8, 18));
        a2.setClockIn(LocalTime.of(8, 30));
        a2.setClockOut(LocalTime.of(17, 0));
        a2.setStatus(Attendance.AttendanceStatus.LATE);
        a2.setNotes("Arrived 30 minutes late");
        attendanceRepository.save(a2);

        Attendance a3 = new Attendance();
        a3.setEmployee(e3);
        a3.setDate(LocalDate.of(2026, 8, 18));
        a3.setClockIn(LocalTime.of(8, 0));
        a3.setClockOut(LocalTime.of(17, 0));
        a3.setStatus(Attendance.AttendanceStatus.PRESENT);
        attendanceRepository.save(a3);

        Attendance a4 = new Attendance();
        a4.setEmployee(e4);
        a4.setDate(LocalDate.of(2026, 8, 18));
        a4.setStatus(Attendance.AttendanceStatus.ON_LEAVE);
        a4.setNotes("Annual leave");
        attendanceRepository.save(a4);

        Attendance a5 = new Attendance();
        a5.setEmployee(e1);
        a5.setDate(LocalDate.of(2026, 8, 17));
        a5.setClockIn(LocalTime.of(8, 0));
        a5.setClockOut(LocalTime.of(17, 0));
        a5.setStatus(Attendance.AttendanceStatus.PRESENT);
        attendanceRepository.save(a5);

        Attendance a6 = new Attendance();
        a6.setEmployee(e2);
        a6.setDate(LocalDate.of(2026, 8, 17));
        a6.setClockIn(LocalTime.of(8, 0));
        a6.setClockOut(LocalTime.of(13, 0));
        a6.setStatus(Attendance.AttendanceStatus.HALF_DAY);
        a6.setNotes("Half day approved");
        attendanceRepository.save(a6);
    }
}
