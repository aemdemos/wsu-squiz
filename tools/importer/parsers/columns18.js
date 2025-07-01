/* global WebImporter */
export default function parse(element, { document }) {
  // Get the container that may hold columns content
  const container = element.querySelector('.container');
  let columns = [];

  // Look for all top-level direct children of .container to treat as columns
  // In this HTML, there's only the hero-image span, which is a single column scenario
  if (container) {
    // If there are multiple direct children, each is a column
    const colNodes = Array.from(container.children);
    if (colNodes.length > 1) {
      columns = colNodes;
    } else if (colNodes.length === 1) {
      columns = [colNodes[0]];
    }
  }

  // If there's only one .hero-image span, check for background-image
  let cells = [];
  if (columns.length > 0) {
    // For each column, if it's a hero-image background, convert to <img>. If not, include as-is
    cells = columns.map(col => {
      if (col.classList && col.classList.contains('hero-image')) {
        const bgImage = col.style.backgroundImage;
        const urlMatch = bgImage.match(/url\((['"]?)(.*?)\1\)/);
        if (urlMatch && urlMatch[2]) {
          const img = document.createElement('img');
          img.src = urlMatch[2];
          return img;
        }
      }
      // If not a hero image background, include the element as-is
      return col;
    });
  }

  // Build table
  const headerRow = ['Columns (columns18)'];
  const tableRows = [cells.length ? cells : ['']];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...tableRows
  ], document);
  
  element.replaceWith(table);
}
