export interface User {
  id?: number;
  username: string;
  email: string;
  role: string;
}

export interface Company {
  id?: number;
  name: string;
  taxId?: string;
  industry?: string;
  type?: string;
  status?: string;
  segment?: string;
  size?: string;
  annualRevenue?: number;
  website?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  notes?: string;
}

export interface Contact {
  id?: number;
  company?: Company;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  position?: string;
}

export interface Deal {
  id?: number;
  title: string;
  description?: string;
  company?: Company;
  contact?: Contact;
  assignedTo?: User;
  stage: string;
  dealValue: number;
  probability?: number;
  weightedValue?: number;
  expectedClosingDate?: string;
  priority?: string;
  source?: string;
  lostReason?: string;
}

export interface Project {
  id?: number;
  deal?: Deal;
  name: string;
  status: string;
  startDate?: string;
  deadline?: string;
}

export interface Task {
  id?: number;
  project?: Project;
  assignedTo?: User;
  title: string;
  description?: string;
  priority: string;
  status: string;
  dueDate?: string;
}

export interface Invoice {
  id?: number;
  deal?: Deal;
  company?: Company;
  invoiceNumber: string;
  type: string;
  status: string;
  totalAmount: number;
  taxAmount: number;
  issueDate?: string;
  dueDate?: string;
}

export interface InvoiceItem {
  id?: number;
  invoice?: Invoice;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discountPercent: number;
  lineTotal: number;
}

export interface Interaction {
  id?: number;
  company?: Company;
  contact?: Contact;
  deal?: Deal;
  createdBy?: User;
  type: string;
  subject: string;
  description?: string;
  interactionDate?: string;
  followUpDate?: string;
  followUpStatus?: string;
}

export interface Payment {
  id?: number;
  invoice?: Invoice;
  amount: number;
  method: string;
  paymentDate?: string;
  reference?: string;
  notes?: string;
  status: string;
}
