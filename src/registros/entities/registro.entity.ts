export class Registro {
  id: string;
  admissionDate: string;
  salary: number;
  calculatedSalary: number;
  employee: string;
  createdAt: Date;

  constructor(
    admissionDate: string,
    salary: number,
    calculatedSalary: number,
    employee: string,
    id?: string,
  ) {
    this.id = id || crypto.randomUUID();
    this.admissionDate = admissionDate;
    this.salary = salary;
    this.calculatedSalary = calculatedSalary;
    this.employee = employee;
    this.createdAt = new Date();
  }
}
