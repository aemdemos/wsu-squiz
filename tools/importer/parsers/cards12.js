/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract all <div>s that are cards (img+heading+desc) in a container
  function extractCardDivs(container) {
    const cardDivs = [];
    if (!container) return cardDivs;
    container.querySelectorAll(':scope > div').forEach((div) => {
      // must have an <a> with <img> and a heading (h4/h2) and a <p>
      const img = div.querySelector('a > img');
      const heading = div.querySelector('h4, h2, h3');
      const desc = div.querySelector('p');
      if (img && (heading || desc)) {
        cardDivs.push(div);
      }
    });
    return cardDivs;
  }

  // All card sections selectors (main + sidebar)
  const selectors = [
    '#new_div_170050_170050', // Latest news
    '#component_2062445 #new_div_171323_2062406', // Western Sydney stories
    '#component_2064619 #new_div_171323_2064612', // Western Sydney Votes
    '#new_div_671840_671840 #new_div_171323', // Research success
    '#new_div_671850_671850 #new_div_171323', // Expert opinion
    '#new_content_container_1312415_1312415 #new_div_171323', // Awards and appointments
    '#component_2044515 #new_div_171323_2044390', // Student Spotlight
    '#col3 #component_2005158 #new_div_171323', // Sidebar: Other News
  ];

  // Gather all possible card divs from all sections
  let cardDivs = [];
  selectors.forEach((sel) => {
    const section = element.querySelector(sel);
    if (section) {
      cardDivs = cardDivs.concat(extractCardDivs(section));
    }
  });

  // Build the table rows
  const cells = [["Cards (cards12)"]];

  cardDivs.forEach((div) => {
    // First cell: the <img> (wrapped in the <a> if available)
    let imgLink = div.querySelector('a[href]');
    let img = imgLink ? imgLink.querySelector('img') : null;
    let imgCell = imgLink && img ? imgLink : '';

    // Second cell: heading + paragraph
    const textCell = [];
    const heading = div.querySelector('h4, h2, h3');
    if (heading) {
      textCell.push(heading);
    }
    const para = div.querySelector('p');
    if (para) {
      textCell.push(para);
    }
    cells.push([
      imgCell,
      textCell.length > 0 ? textCell : ''
    ]);
  });

  // Only create the block if there are at least some cards
  if (cells.length > 1) {
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
  }
}
