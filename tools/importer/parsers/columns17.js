/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns17)'];

  // Get the immediate .row child
  const row = element.querySelector(':scope > .row');
  if (!row) return;
  
  // Get the immediate column divs
  const cols = Array.from(row.children);
  const colCells = cols.map((col) => {
    // If there is an iframe, replace it with a link (per requirements)
    const iframe = col.querySelector('iframe');
    if (iframe) {
      // Create a link to represent the iframe src
      const link = document.createElement('a');
      link.href = iframe.src;
      link.textContent = iframe.src;
      return link;
    }
    // otherwise, return the whole col div (contains headings, paragraphs etc.)
    return col;
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    colCells
  ], document);
  element.replaceWith(table);
}