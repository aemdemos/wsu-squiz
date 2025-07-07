/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block if present, else use the passed element
  let heroBlock = element.querySelector('.hero.block');
  if (!heroBlock) heroBlock = element;

  // Find the deepest content div (usually <div><div>...</div></div> inside block)
  let mainContentDiv = heroBlock;
  const deepDiv = heroBlock.querySelector(':scope > div > div');
  if (deepDiv) mainContentDiv = deepDiv;
  else {
    const oneDiv = heroBlock.querySelector(':scope > div');
    if (oneDiv) mainContentDiv = oneDiv;
  }

  // Find the first picture or img for the image cell
  let imageEl = mainContentDiv.querySelector('picture');
  if (!imageEl) imageEl = mainContentDiv.querySelector('img');

  // Compose contentEls: all children except <picture> and <img>
  // (including empty paragraphs and all content after the image)
  const contentEls = [];
  Array.from(mainContentDiv.children).forEach(child => {
    // Skip direct picture/img tag only
    if (child.tagName.toLowerCase() === 'picture' || child.tagName.toLowerCase() === 'img') return;
    contentEls.push(child);
  });

  // Ensure the content row contains ALL elements except image, even empty paragraphs
  let contentCell = '';
  if (contentEls.length === 1) contentCell = contentEls[0];
  else if (contentEls.length > 1) contentCell = contentEls;
  else contentCell = '';

  // Build the table: header row, image row, content row
  const cells = [
    ['Hero'],
    [imageEl || ''],
    [contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
