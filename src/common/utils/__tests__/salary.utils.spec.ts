import { SalaryUtils } from '../salary.utils';

describe('SalaryUtils', () => {
  describe('calculateSalaryPercentage', () => {
    it('should calculate 35% of salary correctly', () => {
      const result = SalaryUtils.calculateSalaryPercentage(5000, 35);
      expect(result).toBe(1750);
    });

    it('should calculate percentage with decimal precision', () => {
      const result = SalaryUtils.calculateSalaryPercentage(1337, 35);
      expect(result).toBe(467.95);
    });

    it('should handle zero salary', () => {
      const result = SalaryUtils.calculateSalaryPercentage(0, 35);
      expect(result).toBe(0);
    });

    it('should handle different percentages', () => {
      const result = SalaryUtils.calculateSalaryPercentage(1000, 50);
      expect(result).toBe(500);
    });

    it('should round to 2 decimal places', () => {
      const result = SalaryUtils.calculateSalaryPercentage(1000, 33.333);
      expect(result).toBe(333.33);
    });

    it('should handle minimum wage calculation', () => {
      const result = SalaryUtils.calculateSalaryPercentage(1300, 35);
      expect(result).toBe(455);
    });
  });
});
