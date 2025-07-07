/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.children).filter(child => child.matches(selector));
  }

  // Find the block that contains the tabs
  const subNavWrapper = element.querySelector('.main_nav_sub_wrapper');
  if (!subNavWrapper) return;
  const mainNavSub = subNavWrapper.querySelector(':scope > .main_nav_sub');
  if (!mainNavSub) return;

  // The header row must be a single column: ['Footer']
  const rows = [['Footer']];

  // Each main tab is a direct child li
  const tabLis = getDirectChildren(mainNavSub, 'li');
  tabLis.forEach(li => {
    // Tab label: prefer direct a > span, fallback to direct a text
    let label = '';
    const a = li.querySelector(':scope > a');
    if (a) {
      const span = a.querySelector('span');
      label = span ? span.textContent.trim() : (a.textContent || '').trim();
    }
    // Tab content: .dropdown_wrap > ul.dropdown, if present
    let content = '';
    const dropdownWrap = li.querySelector(':scope > .dropdown_wrap');
    if (dropdownWrap) {
      const dropdownUl = dropdownWrap.querySelector(':scope > ul.dropdown');
      if (dropdownUl) {
        content = dropdownUl;
      }
    }
    rows.push([label, content]); // This creates a 2-column row for each tab, only header is 1-col
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
