/* global WebImporter */
export default function parse(element, { document }) {
  // Find the content container containing the cards
  let contentContainer = element.querySelector('#content_container_841997');
  if (!contentContainer) contentContainer = element;
  
  // Find the innermost container with the content
  let cardsContainer = contentContainer.querySelector('#content_container_1894880');
  if (!cardsContainer) cardsContainer = contentContainer;

  // Get all direct children of the cardsContainer
  const children = Array.from(cardsContainer.childNodes);

  // The cards are separated by <hr>, each starts with <h4>
  // Each card is: <h4> + p + p + ... until the next <hr> or end
  const cards = [];
  let i = 0;
  while (i < children.length) {
    // Advance to h4 (start of card)
    while (i < children.length && !(children[i].nodeType === 1 && children[i].tagName === 'H4')) i++;
    if (i >= children.length) break;
    // Start of card
    const cardContent = [];
    cardContent.push(children[i]); // the h4
    i++;
    // All nodes until next <hr> or <h4> or end
    while (i < children.length && !(children[i].nodeType === 1 && (children[i].tagName === 'HR' || children[i].tagName === 'H4'))) {
      // Ignore empty text nodes
      if (children[i].nodeType === 3 && !children[i].textContent.trim()) {
        i++;
        continue;
      }
      cardContent.push(children[i]);
      i++;
    }
    // Remove trailing whitespace nodes
    while (cardContent.length && cardContent[cardContent.length-1].nodeType === 3 && !cardContent[cardContent.length-1].textContent.trim()) {
      cardContent.pop();
    }
    // Only add non-empty card
    if (cardContent.length > 0) {
      cards.push(cardContent);
    }
    // Skip <hr>
    if (i < children.length && children[i].nodeType === 1 && children[i].tagName === 'HR') i++;
  }

  // Build the table: header row + one row per card
  const rows = [ ['Cards'] ];
  for (const card of cards) {
    rows.push([card]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
