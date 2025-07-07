/* global WebImporter */
export default function parse(element, { document }) {
  // Find the UL with LIs (each is a card)
  const ul = element.querySelector('ul');
  if (!ul) return;
  const cards = Array.from(ul.children);

  // Header row exactly as in the example
  const cells = [['Cards']];

  cards.forEach(card => {
    // Image cell: reference the actual <picture> (or <img>) element from the DOM
    let imageCell = '';
    const imgDiv = card.querySelector('.cards-card-image');
    if (imgDiv) {
      // Prefer the <picture> element if present
      const picture = imgDiv.querySelector('picture');
      if (picture) {
        imageCell = picture;
      } else {
        // fallback to first image
        const img = imgDiv.querySelector('img');
        if (img) imageCell = img;
      }
    }

    // Text cell: reference the actual .cards-card-body element from the DOM
    let textCell = '';
    const bodyDiv = card.querySelector('.cards-card-body');
    if (bodyDiv) {
      textCell = bodyDiv;
    }

    // Add only if at least one cell has content
    if (imageCell || textCell) {
      cells.push([imageCell, textCell]);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
