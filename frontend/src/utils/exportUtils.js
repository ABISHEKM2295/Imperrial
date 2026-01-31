import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Export data to Excel
export const exportToExcel = (data, filename = 'export.xlsx', sheetName = 'Data') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filename);
};

// Export data to PDF
export const exportToPDF = (data, columns, title = 'Report', filename = 'export.pdf') => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 20);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
  
  // Add table
  doc.autoTable({
    head: [columns],
    body: data.map(row => columns.map(col => row[col] || '')),
    startY: 40,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [102, 126, 234] }
  });
  
  doc.save(filename);
};

// Format date for display
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format number with commas
export const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  return num.toLocaleString('en-IN');
};

// Calculate percentage change
export const calculateChange = (current, previous) => {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous * 100).toFixed(1);
};

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    'Running': '#48bb78',
    'Idle': '#ecc94b',
    'Breakdown': '#f56565'
  };
  return colors[status] || '#718096';
};

// Get efficiency color (green for good, red for bad)
export const getEfficiencyColor = (percentage) => {
  if (percentage >= 95) return '#48bb78';
  if (percentage >= 90) return '#ecc94b';
  return '#f56565';
};

// Download JSON data
export const downloadJSON = (data, filename = 'data.json') => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

// Copy to clipboard
export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};
