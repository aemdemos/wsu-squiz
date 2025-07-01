/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all tab items
  function getSecondaryNavItems(element) {
    const subNavWrap = element.querySelector('.main_nav_sub_wrapper');
    if (!subNavWrap) return [];
    const subNav = subNavWrap.querySelector('ul.main_nav_sub');
    if (!subNav) return [];
    return Array.from(subNav.children).filter(li => li.tagName === 'LI');
  }

  // Extract label and content for each tab
  function getTabFromNavItem(li) {
    // Get label
    let label = '';
    let anchor = li.querySelector(':scope > a');
    if (anchor) {
      let span = anchor.querySelector('span');
      if (span) {
        label = span.textContent.trim();
      } else {
        label = anchor.textContent.trim();
      }
    } else {
      let span = li.querySelector(':scope > span');
      if (span) label = span.textContent.trim();
    }
    // Get content
    const dropdownWrap = li.querySelector(':scope > .dropdown_wrap');
    let content = '';
    if (dropdownWrap) {
      content = dropdownWrap;
    } else if (anchor) {
      content = anchor;
    } else {
      content = document.createTextNode('');
    }
    return [label, content];
  }

  // Compose header row as one cell (spans both columns visually)
  const headerRow = ['Tabs (tabs4)'];
  const tableRows = [headerRow];
  // Compose tab rows as two-column rows (label, content)
  const tabLis = getSecondaryNavItems(element);
  tabLis.forEach(li => {
    const [label, content] = getTabFromNavItem(li);
    tableRows.push([label, content]);
  });

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
