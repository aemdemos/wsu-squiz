/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <iframe> with a YouTube embed src
  const iframe = element.querySelector('iframe[src*="youtube.com/embed/"]');
  if (!iframe) return;

  const src = iframe.getAttribute('src');
  // Extract YouTube video ID
  let youtubeId = '';
  const ytMatch = src.match(/youtube.com\/embed\/([^/?&]+)/);
  if (ytMatch) {
    youtubeId = ytMatch[1];
  }
  // Build canonical YouTube share URL, fallback to iframe src if we can't extract
  const videoUrl = youtubeId ? `https://youtu.be/${youtubeId}` : src;

  // Try to find the best poster image, which is typically the closest <img> above the iframe
  let imgEl = null;
  let iframeP = iframe.closest('p');
  if (iframeP) {
    let prev = iframeP.previousElementSibling;
    while (prev) {
      if (prev.tagName && prev.tagName.toLowerCase() === 'p') {
        const img = prev.querySelector('img');
        if (img) {
          imgEl = img;
          break;
        }
      }
      prev = prev.previousElementSibling;
    }
  }

  // Always create the link element to the video
  const link = document.createElement('a');
  link.href = videoUrl;
  link.textContent = videoUrl;

  // Build cell contents: image (if available) above the link
  const cellContent = [];
  if (imgEl) cellContent.push(imgEl);
  cellContent.push(link);

  // Compose the Embed block table
  const cells = [
    ['Embed'],
    [cellContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the parent paragraph (with iframe) with the block table
  if (iframeP) {
    iframeP.replaceWith(table);
  } else {
    iframe.replaceWith(table);
  }
}
