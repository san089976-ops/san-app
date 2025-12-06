export enum TableStyle {
  BASIC = 'BASIC',
  STRIPED = 'STRIPED',
  BORDERED_HOVER = 'BORDERED_HOVER',
}

export interface CsvData {
  headers: string[];
  rows: string[][];
}
