// Script inyectado en el HTML (TXT/DOCX): resalta coincidencias y navega entre ellas.
export const SEARCH_SCRIPT = String.raw`
window.__q = ''; window.__i = -1; window.__m = [];
function clearMarks() {
  document.querySelectorAll('mark.f').forEach(function (m) {
    var p = m.parentNode; p.replaceChild(document.createTextNode(m.textContent), m); p.normalize();
  });
  window.__m = []; window.__i = -1;
}
function build(q) {
  var re = new RegExp(q.replace(/[.*+?^$|(){}\[\]\\]/g, '\\$&'), 'gi');
  var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  var nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
  nodes.forEach(function (n) {
    if (n.parentNode.tagName === 'SCRIPT' || n.parentNode.tagName === 'STYLE') return;
    var t = n.nodeValue; re.lastIndex = 0;
    if (!re.test(t)) return;
    re.lastIndex = 0;
    var f = document.createDocumentFragment(), last = 0, m;
    while ((m = re.exec(t))) {
      f.appendChild(document.createTextNode(t.slice(last, m.index)));
      var k = document.createElement('mark'); k.className = 'f'; k.textContent = m[0]; f.appendChild(k);
      last = m.index + m[0].length;
    }
    f.appendChild(document.createTextNode(t.slice(last)));
    n.parentNode.replaceChild(f, n);
  });
  window.__m = Array.prototype.slice.call(document.querySelectorAll('mark.f'));
}
function go(i) {
  if (!window.__m.length) return;
  window.__m.forEach(function (m) { m.classList.remove('cur'); });
  window.__i = i % window.__m.length;
  var el = window.__m[window.__i]; el.classList.add('cur');
  el.scrollIntoView({ block: 'center' });
}
window.folioFind = function (q) {
  if (!q) { clearMarks(); window.__q = ''; }
  else if (q === window.__q && window.__m.length) { go(window.__i + 1); }
  else { clearMarks(); window.__q = q; build(q); go(0); }
  window.ReactNativeWebView.postMessage(JSON.stringify({ count: window.__m.length }));
};
`;
