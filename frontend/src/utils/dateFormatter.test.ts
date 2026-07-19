import { describe, it, expect } from 'vitest';
import { formatDateNumeric, formatDateFull } from './dateFormatter';

describe('formatDateNumeric', () => {
  it('returns an empty string for an empty input', () => {
    expect(formatDateNumeric('')).toBe('');
  });

  it('formats a date as DD / MM', () => {
    expect(formatDateNumeric('2024-03-05')).toBe('05 / 03');
  });

  it('pads single-digit day and month with a leading zero', () => {
    expect(formatDateNumeric('2024-01-09')).toBe('09 / 01');
  });
});

describe('formatDateFull', () => {
  it('returns an empty string for an empty input', () => {
    expect(formatDateFull('')).toBe('');
  });

  it('formats a date as DD / MonthAbbrev / YYYY using the given locale', () => {
    expect(formatDateFull('2024-03-05', 'en')).toBe('05 / Mar / 2024');
  });

  it('defaults to the ru locale when none is provided', () => {
    expect(formatDateFull('2024-03-05')).toBe('05 / март / 2024');
  });
});
