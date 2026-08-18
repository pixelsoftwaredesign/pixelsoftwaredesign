package com.pixelsoftwaredesign.pixerp.controller;

import com.pixelsoftwaredesign.pixerp.entity.Product;
import com.pixelsoftwaredesign.pixerp.entity.Sale;
import com.pixelsoftwaredesign.pixerp.entity.Expense;
import com.pixelsoftwaredesign.pixerp.entity.Department;
import com.pixelsoftwaredesign.pixerp.service.ProductService;
import com.pixelsoftwaredesign.pixerp.service.SaleService;
import com.pixelsoftwaredesign.pixerp.service.ExpenseService;
import com.pixelsoftwaredesign.pixerp.service.DepartmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/internal")
public class InternalApiController {

    private final ProductService productService;
    private final SaleService saleService;
    private final ExpenseService expenseService;
    private final DepartmentService departmentService;

    public InternalApiController(ProductService productService, SaleService saleService,
                                  ExpenseService expenseService, DepartmentService departmentService) {
        this.productService = productService;
        this.saleService = saleService;
        this.expenseService = expenseService;
        this.departmentService = departmentService;
    }

    @GetMapping("/products")
    public List<Product> getProducts() {
        return productService.getAll();
    }

    @GetMapping("/sales")
    public List<Sale> getSales() {
        return saleService.getAll();
    }

    @GetMapping("/expenses")
    public List<Expense> getExpenses() {
        return expenseService.getAll();
    }

    @GetMapping("/departments")
    public List<Department> getDepartments() {
        return departmentService.getAll();
    }
}
