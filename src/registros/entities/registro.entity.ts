export class Registro {
  id: string;
  admissionDate: string;
  salary: number;
  calculatedSalary: number;
  employee: string;
  createdAt: Date;
  calculatedAdmissionDate?: string;

  constructor(
    admissionDate: string,
    salary: number,
    calculatedSalary: number,
    employee: string,
    id?: string,
    calculatedAdmissionDate?: string,
  ) {
    this.id = id || crypto.randomUUID();
    this.admissionDate = admissionDate;
    this.salary = salary;
    this.calculatedSalary = calculatedSalary;
    this.employee = employee;
    this.createdAt = new Date();
    this.calculatedAdmissionDate = calculatedAdmissionDate;
  }
}
