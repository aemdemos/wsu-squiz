/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the mobile search tabs block
  const mobileTabs = element.querySelector('#mobile_search_tabs');
  if (!mobileTabs) return;
  
  // Find the tab labels navigation
  const nav = mobileTabs.querySelector('ul#mobile_search_nav');
  if (!nav) return;
  const navLinks = Array.from(nav.querySelectorAll('li > a'));

  // Find the tab content containers (div.m_tab_content)
  const tabContents = Array.from(mobileTabs.querySelectorAll('div.m_tab_content'));

  // Header row as required by the example -- exactly one cell
  const rows = [['Tabs']];

  // For each tab, create a row: [Tab Label, Tab Content]
  navLinks.forEach((navLink, idx) => {
    const label = navLink.textContent.trim();
    const contentDiv = tabContents[idx];
    if (!contentDiv) return;
    // For content: move ALL children to a container so text and embedded elements are preserved
    const cellContainer = document.createElement('div');
    while (contentDiv.firstChild) {
      cellContainer.appendChild(contentDiv.firstChild);
    }
    // If somehow empty, at least preserve text
    if (!cellContainer.hasChildNodes() && contentDiv.textContent.trim()) {
      cellContainer.textContent = contentDiv.textContent;
    }
    rows.push([label, cellContainer]);
  });

  // Fix: Ensure the header row has only ONE cell, and each content row has TWO cells, matching the example
  // This is already handled by the above code

  // Build and replace with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
