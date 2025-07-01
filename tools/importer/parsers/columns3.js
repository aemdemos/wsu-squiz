/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Create header row with the exact block name
  const headerRow = ['Columns (columns3)'];

  // 2. Find the main footer columns for the columns row
  const mainFooter = element.querySelector('.footer');
  let columnsRow = [];
  if (mainFooter) {
    // .col1_links columns in the mainFooter (each is a column)
    const columnNodes = Array.from(mainFooter.children).filter(child => child.classList.contains('col1_links'));
    // Edge case: if none found, fallback to any .col1_links below element
    if (columnNodes.length > 0) {
      columnsRow = columnNodes;
    } else {
      columnsRow = Array.from(element.querySelectorAll('.col1_links'));
    }
  }

  // Defensive: If no columns found, just use an empty cell
  if (columnsRow.length === 0) {
    columnsRow = [''];
  }

  // 3. The lower footer row: put the entire .footer_lower in a single cell
  const footerLower = element.querySelector('.footer_lower');
  const lowerRow = [footerLower ? footerLower : ''];

  // 4. Compose table and replace
  const cells = [
    headerRow,
    columnsRow,
    lowerRow,
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
