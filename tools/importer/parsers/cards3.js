/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards container
  const cardsContainer = element.querySelector('.o4p-tiles');
  if (!cardsContainer) return;
  const cardLinks = Array.from(cardsContainer.querySelectorAll(':scope > a'));

  // Helper to extract background image URL
  function getBgUrl(div) {
    if (!div) return '';
    const bg = div.style.background;
    const match = bg && bg.match(/url\(['"]?([^'"]+)['"]?\)/);
    return match ? match[1] : '';
  }

  // Compose card rows, ensuring all text content is included
  const rows = cardLinks.map((a) => {
    // Image
    const imgDiv = a.querySelector('.tile-image');
    const imgUrl = getBgUrl(imgDiv);
    let imgEl = null;
    if (imgUrl) {
      imgEl = document.createElement('img');
      imgEl.src = imgUrl;
      const textDiv = a.querySelector('.tile-text');
      imgEl.alt = (a.getAttribute('alt') || (textDiv ? textDiv.textContent.trim() : ''));
    }
    // Text content: preserve all formatting and nodes from .tile-text
    let textContent;
    const textDiv = a.querySelector('.tile-text');
    if (textDiv) {
      // Place the referenced .tile-text div directly in the table cell
      textContent = textDiv;
    } else {
      // Fallback: use all text inside link
      textContent = document.createTextNode(a.textContent.trim());
    }
    return [imgEl, textContent];
  });

  // Table: header row, then card rows
  const cells = [['Cards'], ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
