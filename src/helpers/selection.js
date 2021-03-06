/**
 * Based on the stackoverflow solution: https://stackoverflow.com/questions/6846230/coordinates-of-selected-text-in-browser-page
 * Author: https://stackoverflow.com/users/3743216/jakobovski
 */
export default () => {
  let sel = document.selection;
  let range;
  let rect;
  let x = 0;
  let y = 0;
  if (sel) {
    if (sel.type !== "Control") {
      range = sel.createRange();
      range.collapse(true);
      x = range.boundingLeft;
      y = range.boundingTop;
    }
  } else if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      range = sel.getRangeAt(0).cloneRange();
      if (range.getClientRects) {
        range.collapse(true);
        if (range.getClientRects().length > 0) {
          rect = range.getClientRects()[0];
          x = rect.left;
          y = rect.top;
        }
      }
      // Fall back to inserting a temporary element
      if (x === 0 && y === 0) {
        const span = document.createElement("span");
        if (span.getClientRects) {
          // Ensure span has dimensions and position by
          // adding a zero-width space character
          span.appendChild(document.createTextNode("\u200b"));
          range.insertNode(span);
          rect = span.getClientRects()[0];
          x = rect.left;
          y = rect.top;
          const spanParent = span.parentNode;
          spanParent.removeChild(span);

          // Glue any broken text nodes back together
          spanParent.normalize();
        }
      }
    }
  }
  return { x: x, y: y };
};
