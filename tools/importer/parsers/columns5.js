/* global WebImporter */
export default function parse(element, { document }) {
  // Get the relevant columns
  const leftCol = element.querySelector('.col1');
  const centerCol = element.querySelector('.col2');
  const rightCol = element.querySelector('.col3');

  // Left column: heading + nav
  let leftContent = [];
  if (leftCol) {
    const h2 = leftCol.querySelector('span.h2');
    if (h2) leftContent.push(h2);
    const navList = leftCol.querySelector('ul.side_nav');
    if (navList) leftContent.push(navList);
  }

  // Center column: h1 + intro p + image + buttons
  let centerContent = [];
  if (centerCol) {
    const bodyCopy = centerCol.querySelector('#body-copy');
    if (bodyCopy) {
      const h1 = bodyCopy.querySelector('h1');
      if (h1) centerContent.push(h1);
      // Get all intro <p> and <img> (from the first main content div)
      const contentDiv = bodyCopy.querySelector('div[id^="content_div_"]');
      if (contentDiv) {
        contentDiv.childNodes.forEach(node => {
          // Only pick <p> and <img> nodes (img may be inside <p>)
          if (node.nodeType === 1 && (node.tagName === 'P' || node.tagName === 'IMG')) {
            centerContent.push(node);
          }
        });
      }
      // The button group
      const buttonList = bodyCopy.querySelector('#buttons-home');
      if (buttonList) centerContent.push(buttonList);
    }
  }

  // Right column: list of CTAs
  let rightContent = [];
  if (rightCol) {
    const rhcBtnList = rightCol.querySelector('.rhc-button-list');
    if (rhcBtnList) rightContent.push(rhcBtnList);
  }

  // Ensure at least one item in each column (empty placeholder if not)
  if (leftContent.length === 0) leftContent = [''];
  if (centerContent.length === 0) centerContent = [''];
  if (rightContent.length === 0) rightContent = [''];

  // Build table as per example, 3 columns
  const headerRow = ['Columns (columns5)'];
  const dataRow = [leftContent, centerContent, rightContent];

  const block = WebImporter.DOMUtils.createTable([
    headerRow,
    dataRow
  ], document);
  element.replaceWith(block);
}
