package com.pixelsoftwaredesign.pixmanager.config;

import com.pixelsoftwaredesign.pixmanager.entity.*;
import com.pixelsoftwaredesign.pixmanager.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final ContactRepository contactRepository;
    private final DealRepository dealRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final InvoiceRepository invoiceRepository;
    private final InvoiceItemRepository invoiceItemRepository;
    private final InteractionRepository interactionRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, CompanyRepository companyRepository,
                           ContactRepository contactRepository, DealRepository dealRepository,
                           ProjectRepository projectRepository, TaskRepository taskRepository,
                           InvoiceRepository invoiceRepository, InvoiceItemRepository invoiceItemRepository,
                           InteractionRepository interactionRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.contactRepository = contactRepository;
        this.dealRepository = dealRepository;
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.invoiceRepository = invoiceRepository;
        this.invoiceItemRepository = invoiceItemRepository;
        this.interactionRepository = interactionRepository;
        this.passwordEncoder = passwordEncoder;
    }
    @Override
    public void run(String... args) {
        // Always ensure demo users have correct passwords
        User admin = userRepository.findByEmail("admin@pixelsoftwaredesign.com").orElse(null);
        User sales;
        User pm;
        User dev;
        if (admin == null) {
            admin = userRepository.save(new User("admin", "admin@pixelsoftwaredesign.com", passwordEncoder.encode("admin123"), User.Role.ADMIN));
            sales = userRepository.save(new User("sales1", "sales@pixelsoftwaredesign.com", passwordEncoder.encode("sales123"), User.Role.SALES));
            pm = userRepository.save(new User("pm1", "pm@pixelsoftwaredesign.com", passwordEncoder.encode("pm123"), User.Role.MANAGER));
            dev = userRepository.save(new User("dev1", "dev@pixelsoftwaredesign.com", passwordEncoder.encode("dev123"), User.Role.DEVELOPER));
        } else {
            // Reset passwords in case they got corrupted
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            userRepository.save(admin);
            User salesU = userRepository.findByEmail("sales@pixelsoftwaredesign.com").orElse(null);
            if (salesU != null) { salesU.setPasswordHash(passwordEncoder.encode("sales123")); userRepository.save(salesU); }
            User pmU = userRepository.findByEmail("pm@pixelsoftwaredesign.com").orElse(null);
            if (pmU != null) { pmU.setPasswordHash(passwordEncoder.encode("pm123")); userRepository.save(pmU); }
            User devU = userRepository.findByEmail("dev@pixelsoftwaredesign.com").orElse(null);
            if (devU != null) { devU.setPasswordHash(passwordEncoder.encode("dev123")); userRepository.save(devU); }
            return; // Skip rest of seeding
        }

        // Companies - All Business Types
        Company techCorp = new Company("TechCorp Tunisia", "12345678/A/M/000", "Technology", "https://techcorp.tn", "Avenue Habib Bourguiba, Tunis");
        techCorp.setType("B2B"); techCorp.setStatus("ACTIVE"); techCorp.setSegment("Enterprise");
        techCorp.setSize("LARGE"); techCorp.setAnnualRevenue(5000000.0); techCorp.setCity("Tunis");
        techCorp.setCountry("Tunisia"); techCorp.setPhone("+216 71 100 200"); techCorp.setEmail("info@techcorp.tn");
        techCorp = companyRepository.save(techCorp);

        Company globalTrade = new Company("GlobalTrade SARL", "87654321/B/N/000", "Trading", "https://globaltrade.tn", "Rue de la Liberte, Sfax");
        globalTrade.setType("B2B"); globalTrade.setStatus("ACTIVE"); globalTrade.setSegment("Mid-Market");
        globalTrade.setSize("MEDIUM"); globalTrade.setAnnualRevenue(2000000.0); globalTrade.setCity("Sfax");
        globalTrade.setCountry("Tunisia"); globalTrade.setPhone("+216 74 200 300"); globalTrade.setEmail("contact@globaltrade.tn");
        globalTrade = companyRepository.save(globalTrade);

        Company digitalSol = new Company("Digital Solutions Ltd", "11223344/C/P/000", "Digital Services", "https://digitalsolutions.tn", "Avenue 14 Janvier, Sousse");
        digitalSol.setType("B2B2C"); digitalSol.setStatus("ACTIVE"); digitalSol.setSegment("SMB");
        digitalSol.setSize("SMALL"); digitalSol.setAnnualRevenue(500000.0); digitalSol.setCity("Sousse");
        digitalSol.setCountry("Tunisia"); digitalSol.setPhone("+216 73 300 400"); digitalSol.setEmail("hello@digitalsolutions.tn");
        digitalSol = companyRepository.save(digitalSol);

        Company retailMax = new Company("RetailMax", "55667788/D/Q/000", "Retail", "https://retailmax.tn", "Centre Commercial, La Marsa");
        retailMax.setType("B2C"); retailMax.setStatus("ACTIVE"); retailMax.setSegment("SMB");
        retailMax.setSize("MEDIUM"); retailMax.setAnnualRevenue(1200000.0); retailMax.setCity("Tunis");
        retailMax.setCountry("Tunisia"); retailMax.setPhone("+216 71 500 600"); retailMax.setEmail("info@retailmax.tn");
        retailMax = companyRepository.save(retailMax);

        Company medClinic = new Company("MedClinic Plus", "99887766/E/R/000", "Healthcare", "https://medclinic.tn", "Avenue de la Liberte, Nabeul");
        medClinic.setType("B2C"); medClinic.setStatus("LEAD"); medClinic.setSegment("Enterprise");
        medClinic.setSize("LARGE"); medClinic.setAnnualRevenue(3000000.0); medClinic.setCity("Nabeul");
        medClinic.setCountry("Tunisia"); medClinic.setPhone("+216 72 700 800"); medClinic.setEmail("contact@medclinic.tn");
        medClinic = companyRepository.save(medClinic);

        Company freshFood = new Company("FreshFood Co", "33445566/F/S/000", "Food and Beverage", "https://freshfood.tn", "Zone Industrielle, Ben Arous");
        freshFood.setType("B2B"); freshFood.setStatus("ACTIVE"); freshFood.setSegment("SMB");
        freshFood.setSize("SMALL"); freshFood.setAnnualRevenue(800000.0); freshFood.setCity("Ben Arous");
        freshFood.setCountry("Tunisia"); freshFood.setPhone("+216 71 800 900"); freshFood.setEmail("orders@freshfood.tn");
        freshFood = companyRepository.save(freshFood);

        Company buildPro = new Company("BuildPro Construction", "11224433/G/T/000", "Construction", "https://buildpro.tn", "Centre Urbain Nord, Tunis");
        buildPro.setType("B2B"); buildPro.setStatus("ACTIVE"); buildPro.setSegment("Enterprise");
        buildPro.setSize("LARGE"); buildPro.setAnnualRevenue(8000000.0); buildPro.setCity("Tunis");
        buildPro.setCountry("Tunisia"); buildPro.setPhone("+216 71 900 100"); buildPro.setEmail("info@buildpro.tn");
        buildPro = companyRepository.save(buildPro);

        Company eduLearn = new Company("EduLearn Academy", "66778899/H/U/000", "Education", "https://edulearn.tn", "Avenue Habib Bourguiba, Sfax");
        eduLearn.setType("B2C"); eduLearn.setStatus("ACTIVE"); eduLearn.setSegment("Startup");
        eduLearn.setSize("SMALL"); eduLearn.setAnnualRevenue(200000.0); eduLearn.setCity("Sfax");
        eduLearn.setCountry("Tunisia"); eduLearn.setPhone("+216 74 400 500"); eduLearn.setEmail("info@edulearn.tn");
        eduLearn = companyRepository.save(eduLearn);

        // Contacts
        Contact ahmed = contactRepository.save(new Contact(techCorp, "Ahmed", "Ben Ali", "ahmed@techcorp.tn", "+216 71 123 456", "Directeur General"));
        Contact fatma = contactRepository.save(new Contact(techCorp, "Fatma", "Khelifi", "fatma@techcorp.tn", "+216 71 654 321", "Responsable IT"));
        Contact mohamed = contactRepository.save(new Contact(globalTrade, "Mohamed", "Trabelsi", "mohamed@globaltrade.tn", "+216 74 111 222", "Directeur Commercial"));
        Contact sarra = contactRepository.save(new Contact(digitalSol, "Sarra", "Mansour", "sarra@digitalsolutions.tn", "+216 73 333 444", "CEO"));
        Contact youssef = contactRepository.save(new Contact(retailMax, "Youssef", "Gharbi", "youssef@retailmax.tn", "+216 71 555 666", "Gerant"));
        Contact nada = contactRepository.save(new Contact(medClinic, "Nada", "Bouazizi", "nada@medclinic.tn", "+216 72 777 888", "Directrice Medicale"));
        Contact karim = contactRepository.save(new Contact(freshFood, "Karim", "Jaziri", "karim@freshfood.tn", "+216 71 888 990", "Responsable Achats"));
        Contact amine = contactRepository.save(new Contact(buildPro, "Amine", "Chalghoum", "amine@buildpro.tn", "+216 71 999 100", "Chef de Projet"));
        Contact leila = contactRepository.save(new Contact(eduLearn, "Leila", "Ferjani", "leila@edulearn.tn", "+216 74 444 555", "Directrice"));

        // Deals - Various industries and values
        Deal d1 = new Deal("Website Redesign", techCorp, ahmed, sales, Deal.Stage.PROPOSAL, new BigDecimal("25000.00"), LocalDate.of(2026, 9, 15));
        d1.setProbability(new BigDecimal("60")); d1.setSource("Website"); d1.setPriority("HIGH");
        dealRepository.save(d1);

        Deal d2 = new Deal("ERP Implementation", globalTrade, mohamed, sales, Deal.Stage.NEGOTIATION, new BigDecimal("45000.00"), LocalDate.of(2026, 10, 1));
        d2.setProbability(new BigDecimal("75")); d2.setSource("Referral"); d2.setPriority("HIGH");
        dealRepository.save(d2);

        Deal d3 = new Deal("Mobile App Development", digitalSol, sarra, sales, Deal.Stage.QUALIFICATION, new BigDecimal("35000.00"), LocalDate.of(2026, 11, 30));
        d3.setProbability(new BigDecimal("40")); d3.setSource("LinkedIn"); d3.setPriority("MEDIUM");
        dealRepository.save(d3);

        Deal d4 = new Deal("POS System Integration", retailMax, youssef, sales, Deal.Stage.WON, new BigDecimal("15000.00"), LocalDate.of(2026, 8, 1));
        d4.setProbability(new BigDecimal("100")); d4.setSource("Cold Call"); d4.setPriority("MEDIUM");
        dealRepository.save(d4);

        Deal d5 = new Deal("Telemedicine Platform", medClinic, nada, sales, Deal.Stage.PROSPECTING, new BigDecimal("80000.00"), LocalDate.of(2027, 3, 1));
        d5.setProbability(new BigDecimal("20")); d5.setSource("Conference"); d5.setPriority("LOW");
        dealRepository.save(d5);

        Deal d6 = new Deal("Inventory Management", freshFood, karim, sales, Deal.Stage.PROPOSAL, new BigDecimal("12000.00"), LocalDate.of(2026, 9, 30));
        d6.setProbability(new BigDecimal("55")); d6.setSource("Website"); d6.setPriority("MEDIUM");
        dealRepository.save(d6);

        Deal d7 = new Deal("Construction Project Tracker", buildPro, amine, pm, Deal.Stage.WON, new BigDecimal("55000.00"), LocalDate.of(2026, 7, 15));
        d7.setProbability(new BigDecimal("100")); d7.setSource("Partner"); d7.setPriority("URGENT");
        dealRepository.save(d7);

        Deal d8 = new Deal("LMS Platform", eduLearn, leila, sales, Deal.Stage.QUALIFICATION, new BigDecimal("20000.00"), LocalDate.of(2026, 12, 15));
        d8.setProbability(new BigDecimal("35")); d8.setSource("Instagram"); d8.setPriority("LOW");
        dealRepository.save(d8);

        // Projects
        Project p1 = projectRepository.save(new Project(d4, "POS Integration - RetailMax", Project.Status.IN_PROGRESS, LocalDate.of(2026, 8, 1), LocalDate.of(2026, 10, 30)));
        Project p2 = projectRepository.save(new Project(d7, "Construction Tracker - BuildPro", Project.Status.PLANNING, LocalDate.of(2026, 8, 15), LocalDate.of(2027, 2, 28)));

        // Tasks
        taskRepository.save(new Task(p1, dev, "Install POS Hardware", "Configure terminals and barcode scanners", Task.Priority.HIGH, Task.Status.IN_PROGRESS, LocalDate.of(2026, 8, 20)));
        taskRepository.save(new Task(p1, dev, "Database Migration", "Migrate existing product catalog", Task.Priority.URGENT, Task.Status.TODO, LocalDate.of(2026, 8, 30)));
        taskRepository.save(new Task(p1, dev, "Staff Training", "Train cashiers on new POS system", Task.Priority.MEDIUM, Task.Status.TODO, LocalDate.of(2026, 9, 15)));
        taskRepository.save(new Task(p2, pm, "Requirements Gathering", "Document all project tracking needs", Task.Priority.HIGH, Task.Status.IN_PROGRESS, LocalDate.of(2026, 8, 25)));
        taskRepository.save(new Task(p2, dev, "Gantt Chart Module", "Build interactive Gantt chart", Task.Priority.MEDIUM, Task.Status.TODO, LocalDate.of(2026, 9, 30)));

        // Invoices with items
        Invoice inv1 = new Invoice(d4, retailMax, "INV-0001", Invoice.DocumentType.INVOICE, Invoice.Status.SENT, new BigDecimal("15000.00"), new BigDecimal("2850.00"), LocalDate.of(2026, 8, 1), LocalDate.of(2026, 8, 31));
        inv1 = invoiceRepository.save(inv1);
        InvoiceItem ii1 = new InvoiceItem(); ii1.setInvoice(inv1); ii1.setDescription("POS Software License"); ii1.setQuantity(3); ii1.setUnitPrice(new BigDecimal("2500.00")); ii1.setTaxRate(new BigDecimal("19")); ii1.calculateLineTotal();
        invoiceItemRepository.save(ii1);
        InvoiceItem ii2 = new InvoiceItem(); ii2.setInvoice(inv1); ii2.setDescription("Installation and Setup"); ii2.setQuantity(1); ii2.setUnitPrice(new BigDecimal("3000.00")); ii2.setTaxRate(new BigDecimal("19")); ii2.calculateLineTotal();
        invoiceItemRepository.save(ii2);

        Invoice quo1 = new Invoice(d1, techCorp, "QUO-0001", Invoice.DocumentType.QUOTATION, Invoice.Status.SENT, new BigDecimal("25000.00"), new BigDecimal("4750.00"), LocalDate.of(2026, 8, 10), LocalDate.of(2026, 9, 10));
        quo1 = invoiceRepository.save(quo1);

        Invoice inv2 = new Invoice(d7, buildPro, "INV-0002", Invoice.DocumentType.INVOICE, Invoice.Status.PAID, new BigDecimal("55000.00"), new BigDecimal("10450.00"), LocalDate.of(2026, 7, 15), LocalDate.of(2026, 8, 15));
        invoiceRepository.save(inv2);

        // Interactions
        interactionRepository.save(createInteraction(techCorp, ahmed, d1, sales, Interaction.Type.CALL, "Initial Discovery Call", "Discussed website redesign requirements and timeline"));
        interactionRepository.save(createInteraction(techCorp, fatma, d1, sales, Interaction.Type.EMAIL, "Technical Requirements", "Sent detailed technical questionnaire"));
        interactionRepository.save(createInteraction(globalTrade, mohamed, d2, sales, Interaction.Type.MEETING, "Demo Session", "Presented ERP modules and pricing"));
        interactionRepository.save(createInteraction(retailMax, youssef, d4, sales, Interaction.Type.FOLLOW_UP, "Go-Live Support", "Check-in on POS system performance", Interaction.FollowUpStatus.PENDING));
        interactionRepository.save(createInteraction(medClinic, nada, d5, sales, Interaction.Type.MEETING, "Initial Consultation", "Discussed telemedicine requirements and regulatory compliance"));
        interactionRepository.save(createInteraction(digitalSol, sarra, d3, sales, Interaction.Type.NOTE, "Budget Discussion", "Client considering phased approach due to budget constraints"));
    }

    private Interaction createInteraction(Company company, Contact contact, Deal deal, User user,
                                          Interaction.Type type, String subject, String desc) {
        Interaction i = new Interaction();
        i.setCompany(company); i.setContact(contact); i.setDeal(deal); i.setCreatedBy(user);
        i.setType(type); i.setSubject(subject); i.setDescription(desc);
        i.setInteractionDate(LocalDateTime.now().minusDays((long)(Math.random() * 10)));
        return i;
    }

    private Interaction createInteraction(Company company, Contact contact, Deal deal, User user,
                                          Interaction.Type type, String subject, String desc,
                                          Interaction.FollowUpStatus followUpStatus) {
        Interaction i = createInteraction(company, contact, deal, user, type, subject, desc);
        i.setFollowUpStatus(followUpStatus);
        i.setFollowUpDate(LocalDateTime.now().plusDays(3));
        return i;
    }
}
