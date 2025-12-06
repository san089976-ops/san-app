import { CsvData } from '../types';

export const parseCsv = (input: string): CsvData => {
  if (!input.trim()) {
    return { headers: [], rows: [] };
  }

  // Split by new line, handling different line endings
  const lines = input.trim().split(/\r?\n/);

  // Simple CSV parser that handles basic comma separation
  // For a robust app, a proper CSV parser library would be used to handle quoted commas, etc.
  // Here we assume standard format for simplicity but robust enough for typical paste operations.
  const parseLine = (line: string): string[] => {
    return line.split(',').map(cell => cell.trim());
  };

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map(parseLine).filter(row => row.some(cell => cell.length > 0));

  return { headers, rows };
};
