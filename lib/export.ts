// Export utilities — DOCX, PDF, TXT
// Client-side export using jsPDF + docx + browser APIs

import { Document, Packer, Paragraph, HeadingLevel, TextRun } from 'docx';
import jsPDF from 'jspdf';

export interface ExportItem {
  title: string;
  content: string;
  meta?: Record<string, string>;
}

// ============= TXT EXPORT =============
export function exportAsTxt(items: ExportItem[]): void {
  const text = items.map(item => {
    const meta = item.meta ? Object.entries(item.meta).map(([k, v]) => `${k}: ${v}`).join('\n') : '';
    return `${item.title}\n${'='.repeat(item.title.length)}\n${meta ? meta + '\n' : ''}\n${item.content}\n\n`;
  }).join('\n---\n\n');
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  download(blob, `export-${Date.now()}.txt`);
}

// ============= DOCX EXPORT =============
export async function exportAsDocx(items: ExportItem[]): Promise<void> {
  const doc = new Document({
    sections: [{
      properties: {},
      children: items.flatMap(item => [
        new Paragraph({
          text: item.title,
          heading: HeadingLevel.HEADING_1,
        }),
        ...(item.meta ? Object.entries(item.meta).map(([k, v]) => new Paragraph({
          children: [new TextRun({ text: `${k}: `, bold: true }), new TextRun(v)],
        })) : []),
        new Paragraph({ text: '' }),
        ...item.content.split('\n').map(line => new Paragraph({
          text: line,
        })),
        new Paragraph({ text: '' }),
        new Paragraph({ text: '---', }),
        new Paragraph({ text: '' }),
      ]),
    }],
  });

  const blob = await Packer.toBlob(doc);
  download(blob, `export-${Date.now()}.docx`);
}

// ============= PDF EXPORT =============
export function exportAsPdf(items: ExportItem[]): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const maxWidth = pageWidth - 2 * margin;
  let y = margin;

  items.forEach((item, idx) => {
    if (idx > 0) {
      doc.addPage();
      y = margin;
    }

    // Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    const titleLines = doc.splitTextToSize(item.title, maxWidth);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 7 + 3;

    // Meta
    if (item.meta) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      Object.entries(item.meta).forEach(([k, v]) => {
        const metaLine = `${k}: ${v}`;
        const metaLines = doc.splitTextToSize(metaLine, maxWidth);
        doc.text(metaLines, margin, y);
        y += metaLines.length * 4 + 1;
      });
      doc.setTextColor(0);
      y += 3;
    }

    // Divider
    doc.setDrawColor(200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    // Content
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const contentLines = doc.splitTextToSize(item.content, maxWidth);
    contentLines.forEach((line: string) => {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 5;
    });
  });

  doc.save(`export-${Date.now()}.pdf`);
}

// ============= BULK EXPORT TO PDF =============
export function exportBulkAsPdf(title: string, items: ExportItem[]): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const maxWidth = pageWidth - 2 * margin;
  let y = margin;

  // Cover
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(title, maxWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 10 + 5;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
  doc.text(`Total Items: ${items.length}`, margin, y + 5);
  doc.setTextColor(0);

  items.forEach((item, idx) => {
    doc.addPage();
    y = margin;

    // Item number
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(`#${idx + 1} of ${items.length}`, margin, y);
    doc.setTextColor(0);
    y += 8;

    // Title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    const titleLines = doc.splitTextToSize(item.title, maxWidth);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 7 + 3;

    // Divider
    doc.setDrawColor(200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    // Content
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const contentLines = doc.splitTextToSize(item.content, maxWidth);
    contentLines.forEach((line: string) => {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 4.5;
    });
  });

  doc.save(`${title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`);
}

function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}