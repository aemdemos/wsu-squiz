/* global WebImporter */
export default function parse(element, { document }) {
  // Find all the main navigation columns
  const footer = element.querySelector('.footer');
  let navCols = [];
  if (footer) {
    navCols = Array.from(footer.querySelectorAll(':scope > .col1_links'));
  }

  // Gather all additional footer content to group in the 6th column
  const footerLower = element.querySelector('.footer_lower');
  const extraContent = [];
  if (footerLower) {
    // Social links toolbar
    const toolbar = footerLower.querySelector('.footer_toolbar');
    if (toolbar) extraContent.push(toolbar);
    // Secondary nav and meta info
    const logo = footerLower.querySelector('.footer_logo');
    if (logo) {
      const navList = logo.querySelector('.main_nav_sub');
      if (navList) extraContent.push(navList);
      const businessInfo = logo.querySelector('.business_info');
      if (businessInfo) extraContent.push(businessInfo);
      const address = logo.querySelector('.address');
      if (address) extraContent.push(address);
      const lastUpdated = logo.querySelector('.last_updated');
      if (lastUpdated) extraContent.push(lastUpdated);
    }
  }

  // Make sure there are 6 columns; group all the extra content into the last cell
  let cellsRow = [];
  for (let i = 0; i < 6; i++) {
    if (i < 5) {
      cellsRow.push(navCols[i] || document.createElement('div'));
    } else {
      // Last cell: group all extra content, including navCols[5] if it exists
      let colContent = [];
      if (navCols[5]) colContent.push(navCols[5]);
      if (extraContent.length) colContent = colContent.concat(extraContent);
      // If empty, add an empty div to avoid an empty cell
      cellsRow.push(colContent.length ? colContent : document.createElement('div'));
    }
  }

  // Build the block table structure
  const cells = [
    ['Columns (columns6)'],
    cellsRow
  ];

  // Replace the original element with the new block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
