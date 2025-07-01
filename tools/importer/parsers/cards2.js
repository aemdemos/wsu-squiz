/* global WebImporter */
export default function parse(element, { document }) {
  // The array that will hold all cards, each card will be [img, [strong, br, description]]
  const cards = [];

  // Helper: extract cards from a section root
  function extractCardsFromSection(section) {
    if (!section) return [];
    const found = [];
    // Find all direct child divs that contain both an image and a heading (h4)
    const cardDivs = Array.from(section.querySelectorAll(':scope > div')).filter(div => div.querySelector('img') && div.querySelector('h4'));
    cardDivs.forEach(div => {
      const img = div.querySelector('img');
      const h4 = div.querySelector('h4');
      // title may be in a link or just text
      let title = '';
      if (h4) {
        const a = h4.querySelector('a');
        title = a ? a.textContent.trim() : h4.textContent.trim();
      }
      const p = div.querySelector('p');
      let desc = '';
      if (p) desc = p.textContent.trim();
      const textCell = [];
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title;
        textCell.push(strong);
      }
      if (desc) {
        textCell.push(document.createElement('br'));
        textCell.push(desc);
      }
      if (img && textCell.length) {
        found.push([img, textCell]);
      }
    });
    return found;
  }

  // Helper: for cases where the card divs are deeply nested or not direct children
  function extractDeepCards(section) {
    if (!section) return [];
    const found = [];
    // Any descendant div that has img and h4
    const cardDivs = Array.from(section.querySelectorAll('div')).filter(div => div.querySelector('img') && div.querySelector('h4'));
    cardDivs.forEach(div => {
      const img = div.querySelector('img');
      const h4 = div.querySelector('h4');
      let title = '';
      if (h4) {
        const a = h4.querySelector('a');
        title = a ? a.textContent.trim() : h4.textContent.trim();
      }
      const p = div.querySelector('p');
      let desc = '';
      if (p) desc = p.textContent.trim();
      const textCell = [];
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title;
        textCell.push(strong);
      }
      if (desc) {
        textCell.push(document.createElement('br'));
        textCell.push(desc);
      }
      if (img && textCell.length) {
        found.push([img, textCell]);
      }
    });
    return found;
  }

  // List all the selectors for the news/cards sections (main and sidebar)
  const mainSections = [
    '#new_div_170050_170050', // Latest news
    '#new_div_171323_2062406', // Western Sydney stories
    '#new_div_171323_2064612', // Western Sydney Votes
    '#new_div_671840_671840 > #new_div_171323', // Research success
    '#new_div_671850_671850 > #new_div_171323', // Expert opinion (may be deeply nested)
    '#new_div_171323_1312415', // Awards and appointments
    '#new_div_171323_2044390', // Student Spotlight
    '#component_2005158 #new_div_171323' // Sidebar Other News
  ];

  // Extract cards from each section using the best-fit helper
  mainSections.forEach(sel => {
    const section = document.querySelector(sel);
    // Try direct children first, then fallback to deep search if none found
    let found = extractCardsFromSection(section);
    if (!found.length) found = extractDeepCards(section);
    if (found.length) cards.push(...found);
  });

  // Defensive: Remove duplicates by thumbnail src+title text
  const seen = new Set();
  const uniqueCards = cards.filter(card => {
    const img = card[0];
    const strong = Array.isArray(card[1]) ? card[1][0] : null;
    const key = (img && img.src ? img.src : '') + (strong && strong.textContent ? strong.textContent : '');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (!uniqueCards.length) return;

  // Compose the table: first row is header, then each [img, [strong, br, description]]
  const cells = [ ['Cards'], ...uniqueCards ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
