import { DateUtils } from '../date.utils';

describe('DateUtils', () => {
  describe('calculateElapsedTime', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should calculate elapsed time for same day', () => {
      const result = DateUtils.calculateElapsedTime('2024-01-15');
      expect(result).toBe('0 dias');
    });

    it('should calculate elapsed time for a few days', () => {
      const result = DateUtils.calculateElapsedTime('2024-01-10');
      expect(result).toBe('5 dias');
    });

    it('should calculate elapsed time with months', () => {
      const result = DateUtils.calculateElapsedTime('2023-11-15');
      expect(result).toBe('2 meses');
    });

    it('should calculate elapsed time with years', () => {
      const result = DateUtils.calculateElapsedTime('2022-01-15');
      expect(result).toBe('2 anos');
    });

    it('should calculate complex elapsed time', () => {
      const result = DateUtils.calculateElapsedTime('2021-10-10');
      expect(result).toBe('5 dias, 3 meses e 2 anos');
    });

    it('should handle single day correctly', () => {
      const result = DateUtils.calculateElapsedTime('2024-01-14');
      expect(result).toBe('1 dia');
    });

    it('should handle single month correctly', () => {
      const result = DateUtils.calculateElapsedTime('2023-12-15');
      expect(result).toBe('1 mês');
    });

    it('should handle single year correctly', () => {
      const result = DateUtils.calculateElapsedTime('2023-01-15');
      expect(result).toBe('1 ano');
    });
  });
});
