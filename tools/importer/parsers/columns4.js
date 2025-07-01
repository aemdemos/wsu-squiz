/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name, single column
  const headerRow = ['Columns (columns4)'];

  // Find the .footer element (contains main link columns)
  const footer = element.querySelector('.footer');
  if (!footer) return;

  // Gather all main columns (all .col1_links direct children)
  const colDivs = Array.from(footer.querySelectorAll(':scope > .col1_links'));

  // Prepare content rows: each row contains two columns, grouped as in the example
  const rows = [headerRow];
  for (let i = 0; i < colDivs.length; i += 2) {
    // Left cell content
    const leftDiv = colDivs[i];
    const leftNodes = leftDiv ? Array.from(leftDiv.childNodes).filter(node => node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '')) : [];
    // Right cell content
    const rightDiv = colDivs[i + 1];
    const rightNodes = rightDiv ? Array.from(rightDiv.childNodes).filter(node => node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '')) : [];
    rows.push([
      leftNodes.length === 1 ? leftNodes[0] : leftNodes,
      rightNodes.length === 1 ? rightNodes[0] : rightNodes
    ]);
  }

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
