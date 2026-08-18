export interface Category {
  id?: number;
  name: string;
  description?: string;
  active?: boolean;
}

export interface Product {
  id?: number;
  name: string;
  sku?: string;
  description?: string;
  category?: Category;
  costPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  minStock?: number;
  active?: boolean;
  unit?: string;
}

export interface Sale {
  id?: number;
  saleNumber?: string;
  cashier?: any;
  subtotal: number;
  taxAmount: number;
  total: number;
  paymentMethod: string;
  status?: string;
  customerName?: string;
  createdAt?: string;
  items?: SaleItem[];
}

export interface SaleItem {
  id?: number;
  sale?: Sale;
  product?: Product;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Department {
  id?: number;
  name: string;
  description?: string;
  active?: boolean;
}

export interface Employee {
  id?: number;
  employeeCode?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  department?: Department;
  position: string;
  status?: string;
  hireDate?: string;
  birthDate?: string;
  salary?: number;
  address?: string;
}

export interface Attendance {
  id?: number;
  employee?: Employee;
  date: string;
  clockIn?: string;
  clockOut?: string;
  status: string;
  notes?: string;
}

export interface Account {
  id?: number;
  code: string;
  name: string;
  type: string;
  description?: string;
  active?: boolean;
}

export interface JournalEntry {
  id?: number;
  entryNumber?: string;
  date: string;
  description: string;
  debitAccount?: Account;
  creditAccount?: Account;
  amount: number;
  status?: string;
}

export interface Expense {
  id?: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  paymentMethod: string;
  status?: string;
  notes?: string;
}
