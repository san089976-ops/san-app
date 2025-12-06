import React from 'react';
import { CsvData, TableStyle } from '../types';

interface TableViewProps {
  data: CsvData;
  styleMode: TableStyle;
}

export const TableView: React.FC<TableViewProps> = ({ data, styleMode }) => {
  const { headers, rows } = data;

  if (headers.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <p className="text-lg font-medium">No Data to Display</p>
        <p className="text-sm">Enter CSV data in the sidebar to generate a table.</p>
      </div>
    );
  }

  // Base classes applied to all tables
  const baseTableClasses = "w-full text-left text-sm text-slate-700";
  const baseHeaderClasses = "py-3 px-4 font-semibold text-slate-900";
  const baseCellClasses = "py-3 px-4";

  // Dynamic classes based on style selection
  let containerClasses = "overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white";
  let tableClasses = baseTableClasses;
  let headerClasses = `${baseHeaderClasses} bg-slate-50 border-b border-slate-200`;
  let rowClasses = "transition-colors";
  let cellClasses = baseCellClasses;

  if (styleMode === TableStyle.STRIPED) {
    rowClasses += " even:bg-slate-50";
  } else if (styleMode === TableStyle.BORDERED_HOVER) {
    tableClasses += " border-collapse";
    headerClasses += " border border-slate-300 bg-slate-100";
    cellClasses += " border border-slate-200";
    rowClasses += " hover:bg-indigo-50 cursor-default";
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-end mb-4 px-1">
        <h2 className="text-xl font-bold text-slate-800">Table Preview</h2>
        <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">
          {rows.length} rows &bull; {headers.length} columns
        </span>
      </div>
      
      <div className={`flex-1 overflow-auto ${containerClasses}`}>
        <table className={tableClasses}>
          <thead className="sticky top-0 z-10">
            <tr>
              {headers.map((header, idx) => (
                <th key={`th-${idx}`} className={headerClasses}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((row, rowIdx) => (
              <tr key={`tr-${rowIdx}`} className={rowClasses}>
                {row.map((cell, cellIdx) => (
                  <td key={`td-${rowIdx}-${cellIdx}`} className={cellClasses}>
                    {cell}
                  </td>
                ))}
                {/* Handle case where row length < header length */}
                {Array.from({ length: Math.max(0, headers.length - row.length) }).map((_, i) => (
                  <td key={`td-empty-${rowIdx}-${i}`} className={cellClasses}></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
