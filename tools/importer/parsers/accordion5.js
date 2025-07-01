/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion container in the given element
  const accordion = element.querySelector('#vaccordion');
  if (!accordion) return;

  // Get all direct children that are either h3 (headers) or div (panels)
  const children = Array.from(accordion.children);
  const rows = [];

  for (let i = 0; i < children.length; i += 2) {
    const header = children[i];
    const panel = children[i + 1];
    if (!header || !panel) continue;
    // For the header cell, reference the existing <h3> element
    // For the content cell, reference the whole panel <div> (to preserve all formatting, lists, etc)
    rows.push([header, panel]);
  }

  // Build the cells array for the table: first row is header, then all accordion items as [header, panel]
  const cells = [
    ['Accordion'],
    ...rows
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the accordion element with the table
  accordion.replaceWith(table);
}
