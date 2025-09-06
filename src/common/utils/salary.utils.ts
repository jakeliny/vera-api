export class SalaryUtils {
  static calculateSalaryPercentage(salary: number, percentage: number): number {
    return Number(((salary * percentage) / 100).toFixed(2));
  }
}
