/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the background image (visible in the active tab-pane in .tab-content)
  let bgImg = null;
  const tabContent = element.querySelector('.tab-content');
  if (tabContent) {
    const activePane = tabContent.querySelector('.tab-pane.active');
    if (activePane) {
      const img = activePane.querySelector('img');
      if (img) {
        bgImg = img;
      }
    }
  }

  // Extract visible hero message content from the first tab's blurb
  const tabsList = element.querySelector('.tabs-container ul.nav-tabs');
  let contentEls = [];
  if (tabsList) {
    const firstLi = tabsList.querySelector('li');
    if (firstLi) {
      // Title
      const nameSpan = firstLi.querySelector('.name');
      if (nameSpan && nameSpan.textContent.trim()) {
        const h1 = document.createElement('h1');
        h1.textContent = nameSpan.textContent.trim();
        contentEls.push(h1);
      }
      // Blurb
      const blurb = firstLi.querySelector('.tab-blurb');
      if (blurb) {
        // .title, .content structure
        const titleDiv = blurb.querySelector('.title');
        if (titleDiv && titleDiv.textContent.trim()) {
          // Only add if not duplicating the .name content
          if (!contentEls.length || contentEls[0].textContent !== titleDiv.textContent.trim()) {
            const h2 = document.createElement('h2');
            h2.textContent = titleDiv.textContent.trim();
            contentEls.push(h2);
          }
        }
        const contentDiv = blurb.querySelector('.content');
        if (contentDiv) {
          // Get all nodes inside .content
          Array.from(contentDiv.childNodes).forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'P' && node.textContent.trim()) {
              // Subheading
              const sub = document.createElement('p');
              sub.textContent = node.textContent.trim();
              contentEls.push(sub);
            } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
              // Call-to-action or other text
              // If this is after a <p>, treat as link if there's a blurb href
              if (blurb.href) {
                const a = document.createElement('a');
                a.href = blurb.href;
                a.textContent = node.textContent.trim();
                contentEls.push(a);
              } else {
                const span = document.createElement('span');
                span.textContent = node.textContent.trim();
                contentEls.push(span);
              }
            }
          });
        }
      }
    }
  }

  // Fallback: if nothing captured, include all visible text as a paragraph
  if (contentEls.length === 0) {
    const allText = element.textContent.trim();
    if (allText) {
      const p = document.createElement('p');
      p.textContent = allText;
      contentEls.push(p);
    }
  }

  // Compose the block table as per the guidelines
  const cells = [
    ['Hero'],
    [bgImg ? bgImg : ''],
    [contentEls]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
