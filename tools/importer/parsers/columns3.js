/* global WebImporter */
export default function parse(element, { document }) {
  // The element is the columns block (columns block columns-2-cols)
  // Get all direct child divs (each is a 'row' in the columns block)
  const rows = Array.from(element.querySelectorAll(':scope > div'));
  // Construct table rows for the block
  // Header row: SINGLE CELL ONLY, per requirement
  const table = [
    ['Columns']
  ];
  // For each row in columns, construct an array of that row's columns' content
  rows.forEach(row => {
    const cols = Array.from(row.querySelectorAll(':scope > div'));
    // If there are columns, add them as individual cells
    if (cols.length > 0) {
      table.push(cols);
    } else {
      // Defensive fallback: treat the row itself as a single cell
      table.push([row]);
    }
  });
  // Create the block table
  const block = WebImporter.DOMUtils.createTable(table, document);
  // Replace the original element
  element.replaceWith(block);
}
