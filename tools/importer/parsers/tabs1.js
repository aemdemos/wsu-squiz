/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container by id
  const mobileSearchTabs = element.querySelector('#mobile_search_tabs');
  if (!mobileSearchTabs) return;

  // Find tab label <a> elements and retain order
  const tabNav = mobileSearchTabs.querySelector('ul#mobile_search_nav');
  const tabLinks = tabNav ? Array.from(tabNav.querySelectorAll('li > a')) : [];

  // Map tab hrefs to their content <div> elements
  const tabContents = {};
  mobileSearchTabs.querySelectorAll('.m_tab_content').forEach(div => {
    tabContents['#' + div.id] = div;
  });

  // We'll count how many columns the data rows have (always 2: tab, content)
  const columnCount = 2;

  // Compose the rows array; header is one cell per requirements
  const rows = [['Tabs (tabs1)']];

  tabLinks.forEach(tabLink => {
    const label = tabLink.textContent.trim();
    const href = tabLink.getAttribute('href');
    const contentDiv = tabContents[href];
    if (label && contentDiv) {
      // Get all text and elements in the contentDiv, preserving order
      if (contentDiv.childNodes.length > 0) {
        const nodes = Array.from(contentDiv.childNodes).filter(n => {
          // keep text nodes (non-empty) or element nodes
          return (n.nodeType === 1) || (n.nodeType === 3 && n.textContent.trim() !== '');
        });
        rows.push([
          label,
          nodes.length === 1 ? nodes[0] : nodes
        ]);
      } else {
        rows.push([label, '']);
      }
    }
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Make the header cell span both columns for the first row
  const th = table.querySelector('tr:first-child th');
  if (th && columnCount > 1) {
    th.setAttribute('colspan', columnCount);
  }

  element.replaceWith(table);
}
