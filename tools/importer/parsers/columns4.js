/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .footer section where the columns are
  const mainFooter = element.querySelector('.footer');
  if (!mainFooter) return;

  // Get all top-level column containers
  const colNodes = Array.from(mainFooter.querySelectorAll(':scope > .col1_links'));
  if (!colNodes.length) return;

  // Prepare the table rows
  const cells = [];
  // The header row is a single column with the block name
  cells.push(['Columns']);

  // Group into pairs for two-column rows, as per the markdown example
  for (let i = 0; i < colNodes.length; i += 2) {
    const row = [];
    row.push(colNodes[i]);
    if (i + 1 < colNodes.length) {
      row.push(colNodes[i + 1]);
    } else {
      row.push(''); // Pad with empty string if odd number
    }
    cells.push(row);
  }

  // Create the table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
