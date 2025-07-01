/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: extract background image url from style attribute
  function extractBackgroundUrl(style) {
    if (!style) return '';
    const match = style.match(/url\(['"]?([^'"]+)['"]?\)/);
    return match ? match[1] : '';
  }

  const rows = [['Cards (cards6)']]; // Header: must match example exactly

  // Select all direct card elements
  const cards = element.querySelectorAll(':scope > .careers-tile');

  cards.forEach(card => {
    // There is only one link per card; it wraps image and heading
    const link = card.querySelector('a');
    let imgElem = null;
    let titleElem = null;

    if (link) {
      // Find the .tile-image div for image
      const tileImgDiv = link.querySelector('.tile-image');
      if (tileImgDiv) {
        const bgUrl = extractBackgroundUrl(tileImgDiv.getAttribute('style'));
        if (bgUrl) {
          imgElem = document.createElement('img');
          imgElem.src = bgUrl;
          // Try to use title as alt if present
          const h4 = link.querySelector('h4');
          imgElem.alt = h4 ? h4.textContent.trim() : '';
        }
      }
      // The heading (h4)
      titleElem = link.querySelector('h4');
    }

    // Text column: heading and link (CTA)
    const textCellContent = [];
    if (titleElem) textCellContent.push(titleElem);
    // Only add link if not already included in the heading (to avoid duplication)
    if (link) {
      // Only include the CTA if the link is not literally just wrapping the heading; always include for cards6
      // But in case of non-heading text, include as a CTA
      // Here, since the source has no additional description, just include the link as CTA
      const cta = document.createElement('a');
      cta.href = link.href;
      cta.textContent = titleElem ? titleElem.textContent.trim() : link.href;
      textCellContent.push(cta);
    }

    rows.push([
      imgElem,
      textCellContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
