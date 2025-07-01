/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a container div with list of elements
  function makeCell(elements) {
    const div = document.createElement('div');
    elements.forEach(function(el) {
      if (el) div.appendChild(el);
    });
    return div;
  }

  // LEFT COLUMN: Navigation
  const col1 = element.querySelector('.col1');
  let leftCell = document.createElement('div');
  if (col1) {
    // Heading (span.h2) and nav list (ul.side_nav)
    const h2 = col1.querySelector('.h2');
    const ul = col1.querySelector('ul');
    leftCell = makeCell([h2, ul]);
  }

  // MIDDLE COLUMN: Main content
  const col2 = element.querySelector('.col2');
  let midCell = document.createElement('div');
  if (col2) {
    // Get the h1 heading
    const h1 = col2.querySelector('h1');
    // Get the intro paragraph (first p in #content_div_411586_411586)
    const contentDiv = col2.querySelector('#content_div_411586_411586');
    let introP = null;
    let img = null;
    if (contentDiv) {
      const ps = contentDiv.querySelectorAll('p');
      if (ps.length > 0) introP = ps[0];
      // The img is usually in the second <p>
      img = contentDiv.querySelector('img');
    }
    // Get the main buttons (ul.button-list)
    const buttonList = col2.querySelector('#buttons-home ul.button-list');
    // Compose mid cell as [h1, introP, img, buttonList]
    midCell = makeCell([h1, introP, img, buttonList]);
  }

  // RIGHT COLUMN: Sidebar CTAs
  let rightCell = document.createElement('div');
  const col3 = element.querySelector('.col3-inner');
  if (col3) {
    // Get the ul.rhc-button-list
    const ul = col3.querySelector('ul.rhc-button-list');
    rightCell = makeCell([ul]);
  }

  // Table structure: header is single cell, second row is three columns
  const cells = [
    ['Columns (columns7)'],
    [leftCell, midCell, rightCell],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
