/* global WebImporter */
export default function parse(element, { document }) {
  // Find the container holding all columns
  const container = element.querySelector('.container');
  if (!container) return;

  // Find the row that contains the columns
  const row = container.querySelector('.row.bottom-gutter-padding');
  if (!row) return;

  // Get all direct .col-sm-4 children of the row (not nested inside align-left)
  const topColumns = Array.from(row.children).filter(col =>
    col.classList.contains('col-sm-4') && !col.closest('div[align="left"]')
  );
  // Get the logo/social column from the <div align="left">
  const alignLeftDiv = row.querySelector('div[align="left"]');
  let fourthCol = null;
  if (alignLeftDiv) {
    fourthCol = alignLeftDiv.querySelector('.col-sm-4');
  }
  // Final columns array
  const columns = [...topColumns];
  if (fourthCol) columns.push(fourthCol);

  // Clean up: Remove empty social-media divs
  columns.forEach(col => {
    const smds = col.querySelectorAll('.social-media');
    smds.forEach(sm => { if (!sm.hasChildNodes()) sm.remove(); });
  });

  // Table header row: exactly one column
  const headerRow = ['Columns (columns2)'];
  // Content row: an array of the column elements
  const contentRow = columns;

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);
  element.replaceWith(table);
}
