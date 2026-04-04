/// <reference types="vite/client" />

declare module 'exceljs' {
  export class Workbook {
    addWorksheet(name: string): Worksheet;
    xlsx: {
      writeBuffer(): Promise<ArrayBuffer>;
    };
  }

  export interface Worksheet {
    addRow(values: any[]): Row;
    getColumn(index: number): Partial<Column>;
  }

  interface Row {
    font?: { bold?: boolean };
    fill?: any;
    border?: any;
  }

  interface Column {
    width?: number;
    eachCell?(opts: { includeEmpty: boolean }, callback: (cell: Cell) => void): void;
  }

  interface Cell {
    value: any;
  }
}

declare module 'html2canvas' {
  interface Options {
    scale?: number;
    useCORS?: boolean;
    backgroundColor?: string;
  }
  function html2canvas(element: HTMLElement, options?: Options): Promise<HTMLCanvasElement>;
  export default html2canvas;
}
