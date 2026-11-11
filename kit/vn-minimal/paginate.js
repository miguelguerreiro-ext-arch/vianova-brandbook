/* VN-Minimal paginator.
   Runs inside a browser page that holds <section id="cover"> and <main id="flow">.
   Lays the flow out on fixed A4 pages by measuring the real DOM:
     - blocks with class "span" take the full measure
     - everything else flows in two columns (native CSS multi-column per page)
   Writes the result as JSON into <script id="vn-result">.
   Config comes from window.VN_CONFIG = { maxContentPages, densities, header, footerWord, tocTitle, firstFolio } */
(async () => {
  const cfg = window.VN_CONFIG;
  const PT = 96 / 72;
  const log = [];
  const result = { ok: false, log };

  const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };

  try {
    await Promise.all(['400 12px Poppins', '600 12px Poppins', '700 12px Poppins'].map((f) => document.fonts.load(f)));
    await document.fonts.ready;
    const loaded = [...document.fonts].filter((f) => /Poppins/.test(f.family) && f.status === 'loaded').length;
    result.fontsLoaded = loaded;
    if (loaded < 3) log.push('WARN Poppins faces loaded: ' + loaded);

    const flowSrc = document.getElementById('flow');
    const coverSrc = document.getElementById('cover');
    const stage = document.getElementById('stage');

    /* ---- 1. Bake hyphenation: ask the browser where it would hyphenate each long word,
            then store those points as soft hyphens so every renderer breaks at the same places. ---- */
    const bakeHyphens = (root) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      const re = /[A-Za-zÄÖÜäöüß]{6,}/g;      // short words too: justified columns need the extra break points
      const words = new Set();
      nodes.forEach((n) => (n.nodeValue.match(re) || []).forEach((w) => words.add(w)));
      const list = [...words];
      const box = el('div');
      box.lang = 'de';
      box.style.cssText = 'position:absolute;left:0;top:0;width:1px;visibility:hidden;font:400 12px/20px Poppins;hyphens:auto;-webkit-hyphens:auto;overflow-wrap:normal;word-break:normal';
      list.forEach((w) => { const d = el('div'); d.textContent = w; box.appendChild(d); });
      document.body.appendChild(box);
      const map = new Map();                    // word -> hyphenation points
      const never = new Set(cfg.noHyphen || []);   // names and foreign words the German rules would break wrongly
      const r = document.createRange();
      list.forEach((w, i) => {
        if (never.has(w)) return;
        const tn = box.children[i].firstChild;
        let lastTop = null;
        const pts = [];
        for (let k = 0; k < w.length; k++) {
          r.setStart(tn, k); r.setEnd(tn, k + 1);
          // the first letter after a hyphenation point reports two boxes (the hyphen, then the letter); take the letter's
          const rcs = r.getClientRects();
          const rc = rcs[rcs.length - 1];
          if (!rc) continue;
          if (lastTop !== null && rc.top > lastTop + 4 && k >= 2 && w.length - k >= 3) pts.push(k);   // at least 2 letters before, 3 after
          lastTop = rc.top;
        }
        if (pts.length) map.set(w, pts);
      });
      box.remove();
      // Justified prose takes every point. Figures, tables and headings are ragged and narrow, so they keep
      // the stricter rule: words of nine letters and more, at least three letters before the break.
      nodes.forEach((n) => {
        const strict = !!n.parentElement.closest('figure, h1, h2, h4');
        n.nodeValue = n.nodeValue.replace(re, (w) => {
          let pts = map.get(w);
          if (!pts) return w;
          if (strict) { if (w.length < 9) return w; pts = pts.filter((p) => p >= 3); }
          let s = '', prev = 0;
          pts.forEach((p) => { s += w.slice(prev, p) + '\u00AD'; prev = p; });
          return s + w.slice(prev);
        });
      });
      return { words: list.length, hyphenated: map.size };
    };
    result.hyphenation = bakeHyphens(flowSrc);

    /* ---- 2. Page scaffolding ---- */
    const headerHTML = `<div class="vn-header"><img src="${cfg.logo}" alt="Vianova"><div class="vn-ref">${cfg.header}</div></div><div class="vn-rule"></div>`;
    const footerHTML = '<div class="vn-footer"><div class="vn-frule"></div><div class="vn-frow"><span class="vn-crumb"></span><span class="vn-folio"></span></div></div>';

    const paginate = (d) => {
      stage.innerHTML = '';
      const pages = [];
      const warnings = [];
      const makePage = (kind) => {
        const p = el('div', 'vn-page');
        p.lang = 'de';
        p.dataset.kind = kind;
        p.style.setProperty('--body', d.size + 'pt');
        p.style.setProperty('--lh', d.lh + 'pt');
        p.style.setProperty('--gap', d.gap + 'pt');
        for (const [k, v] of Object.entries(cfg.vars || {})) p.style.setProperty(k, v);   // document-level overrides
        p.innerHTML = '<div class="vn-bar"></div>' + (kind === 'cover' ? '' : headerHTML + '<div class="vn-content"></div>' + footerHTML);
        stage.appendChild(p);
        pages.push(p);
        return p;
      };

      const cover = makePage('cover');
      cover.insertAdjacentHTML('afterbegin', coverSrc.innerHTML);   // before the brand bar, so the bar stays on top
      const tocPage = makePage('toc');

      const LINE = d.lh * PT;
      const SLACK = LINE;                 // one spare line per filled column block
      const MIN_RUN = LINE * 4;           // do not start prose with less room than this
      const MIN_SECTION = 100 * PT;       // a section header needs this much below it
      const GAP = 20 * PT;
      const MIN_LAST_LINE = 0.86;         // a page's last line must be at least this full before it is stretched

      let content = null;
      let H = 0;
      let floats = [];
      const cTop = () => content.getBoundingClientRect().top;
      const lastBottom = () => (content.lastElementChild ? content.lastElementChild.getBoundingClientRect().bottom - cTop() : 0);
      const usedBottom = () => {
        const last = content.lastElementChild;
        if (!last) return 0;
        return lastBottom() + parseFloat(getComputedStyle(last).marginBottom || 0);
      };
      const remaining = () => H - usedBottom();
      const fits = () => lastBottom() <= H + 0.5;
      const newPage = () => {
        const p = makePage('content');
        content = p.querySelector('.vn-content');
        H = content.clientHeight;
        const f = floats; floats = [];
        f.forEach((x) => content.appendChild(x));
      };

      const colIndex = (rect, base, colW) => Math.floor((rect.left - base.left + 1) / (colW + GAP));

      const pruneEmpty = (node) => {
        [...node.querySelectorAll('*')].reverse().forEach((e) => {
          if (!e.textContent.replace(/[\s­]/g, '') && !e.querySelector('img') && e.tagName !== 'IMG' && e.tagName !== 'BR') e.remove();
        });
      };

      /* Split a block at the first character that fell into the third column. Returns the tail element.
         Works on the block's text as one string so a split never lands inside a word, even where
         the word crosses an inline element or carries soft hyphens. */
      const splitBlock = (block, base, colW) => {
        const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
        const nodes = [];
        let node, total = 0;
        while ((node = walker.nextNode())) { nodes.push({ node, start: total }); total += node.nodeValue.length; }
        if (!total) return null;
        const text = nodes.map((x) => x.node.nodeValue).join('');
        const locate = (g) => {
          let i = nodes.length - 1;
          while (i > 0 && nodes[i].start > g) i--;
          return { node: nodes[i].node, offset: g - nodes[i].start };
        };
        const r = document.createRange();
        const colOf = (g) => {                      // column of character g, or -1 if it has no box of its own
          const ch = text[g];
          if (ch === '\u00AD' || /\s/.test(ch)) return -1;
          const { node: n, offset: o } = locate(g);
          r.setStart(n, o); r.setEnd(n, o + 1);
          const rc = r.getClientRects();
          return rc.length ? colIndex(rc[rc.length - 1], base, colW) : -1;
        };
        // characters that have a box of their own, in order; columns only ever increase along this list
        const idx = [];
        for (let k = 0; k < total; k++) if (text[k] !== '\u00AD' && !/\s/.test(text[k])) idx.push(k);
        if (!idx.length || colOf(idx[idx.length - 1]) < 2) return null;
        let lo = 0, hi = idx.length - 1;            // first character that sits in column >= 2
        while (lo < hi) {
          const mid = (lo + hi) >> 1;
          if (colOf(idx[mid]) >= 2) hi = mid; else lo = mid + 1;
        }
        let g = idx[lo];
        // Prefer not to split a word across two pages: step back to a real break opportunity (after a space
        // or an explicit hyphen) and carry the whole word over. Keep the hyphenated split only where carrying
        // the word over would leave the page's last line visibly loose.
        const hyphenAt = text[g - 1] === '\u00AD' ? g : -1;
        let gw = g;
        while (gw > 0 && !/[ \n\t\-–\/]/.test(text[gw - 1])) gw--;
        let hyphenBreak = false;
        if (hyphenAt > 0 && gw > 0) {
          let k = gw - 1;
          while (k > 0 && (/\s/.test(text[k]) || text[k] === '\u00AD')) k--;
          const at = locate(k);
          r.setStart(at.node, at.offset); r.setEnd(at.node, at.offset + 1);
          const rc = r.getClientRects();
          if (rc.length) {
            const last = rc[rc.length - 1];
            const colLeft = base.left + colIndex(last, base, colW) * (colW + GAP);
            if ((last.right - colLeft) / colW < MIN_LAST_LINE) hyphenBreak = true;
          }
        }
        g = hyphenBreak ? hyphenAt : gw;
        if (g <= 0) return null;                    // nothing of this block belongs on the page
        const { node: n, offset: o } = locate(g);
        const li = n.parentElement.closest('li');
        r.setStart(n, o);
        r.setEndAfter(block);
        const frag = r.extractContents();
        const tail = frag.firstElementChild;
        pruneEmpty(block);
        pruneEmpty(tail);
        if (!block.textContent.replace(/[\s\u00AD]/g, '')) { block.remove(); return tail; }
        tail.classList.add('vn-cont');
        const midItem = li && li.isConnected && tail.tagName === 'UL' && tail.firstElementChild;
        if (midItem) tail.firstElementChild.classList.add('vn-cont');
        // the piece left on this page ends mid-sentence: mark it so its last line can be set full width
        const head = block.tagName === 'UL' ? (midItem ? li : null) : block;
        if (head) { head.classList.add('vn-split'); if (hyphenBreak) head.classList.add('vn-hy'); }
        return tail;
      };

      /* Move everything that overflowed two columns out of `cols`; returns it in reading order. */
      const splitOverflow = (cols) => {
        let rest = [];
        for (let guard = 0; guard < 60; guard++) {
          const base = cols.getBoundingClientRect();
          const colW = (base.width - GAP) / 2;
          const kids = [...cols.children];
          let idx = -1, partial = false;
          for (let i = 0; i < kids.length; i++) {
            const rects = [...kids[i].getClientRects()];
            if (!rects.length) continue;
            const cis = rects.map((x) => colIndex(x, base, colW));
            if (Math.max(...cis) >= 2) { idx = i; partial = Math.min(...cis) < 2; break; }
          }
          if (idx < 0) break;
          const tail = kids.slice(idx + 1);
          tail.forEach((k) => k.remove());
          const k = kids[idx];
          const moved = [];
          if (partial && k.matches('p, ul')) {
            const t = splitBlock(k, base, colW);
            if (t) moved.push(t); else { k.remove(); moved.push(k); }
          } else { k.remove(); moved.push(k); }
          rest = [...moved, ...tail, ...rest];
          while (cols.lastElementChild && cols.lastElementChild.matches('h2, h4')) {
            const h = cols.lastElementChild; h.remove(); rest.unshift(h);
          }
        }
        return rest;
      };

      const placeRun = (run) => {
        let guard = 0;
        while (run.length && guard++ < 40) {
          if (content.children.length && remaining() < MIN_RUN) newPage();
          const cols = el('div', 'vn-cols vn-balance');
          run.forEach((b) => cols.appendChild(b));
          content.appendChild(cols);
          if (fits()) {
            // a few lines only: keep them in the left column instead of splitting them in two
            if (cols.getBoundingClientRect().height <= LINE * 1.6) {
              cols.className = 'vn-cols vn-single';
              if (!fits()) cols.className = 'vn-cols vn-balance';
            }
            return;
          }
          cols.className = 'vn-cols';
          const top = cols.getBoundingClientRect().top - cTop();
          const avail = H - top - SLACK;
          cols.style.height = avail + 'px';
          let rest = splitOverflow(cols);
          cols.style.height = Math.round(avail + SLACK) + 'px';
          if (!cols.children.length) {
            cols.remove();
            if (!content.children.length) {      // nothing fits on an empty page: force the first block
              const forced = el('div', 'vn-cols vn-balance');
              forced.appendChild(rest.shift());
              content.appendChild(forced);
              warnings.push('forced block on page ' + pages.length);
            }
          }
          run = rest;
          if (run.length) newPage();
        }
      };

      const splitTable = (fig) => {
        const table = fig.querySelector('.vn-table');
        if (!table) return false;
        const head = table.querySelector(':scope > .vn-head');
        const rows = [...table.querySelectorAll(':scope > .vn-tr:not(.vn-head)')];
        const cap = fig.querySelector(':scope > .vn-cap');
        const top = cTop();
        let n = 0;
        for (const r of rows) { if (r.getBoundingClientRect().bottom - top <= H - 2) n++; else break; }
        // every row fits but the caption does not: keep two rows back to carry the caption
        if (rows.length - n < 2) n = rows.length - 2;
        if (n < 2) return false;
        const fig2 = fig.cloneNode(false);
        const t2 = table.cloneNode(false);
        if (head) { const h2 = head.cloneNode(true); h2.dataset.repeat = '1'; t2.appendChild(h2); }
        rows.slice(n).forEach((r) => t2.appendChild(r));
        fig2.appendChild(t2);
        if (cap) fig2.appendChild(cap);
        fig2.classList.add('vn-cont');
        return fig2;
      };

      let joinPrev = false;
      const queue = [...flowSrc.cloneNode(true).children];
      newPage();
      let guard = 0;
      while (queue.length && guard++ < 2000) {
        const b = queue[0];
        if (b.classList.contains('span')) {
          queue.shift();
          joinPrev = joinPrev && b.hasAttribute('data-float');
          if (b.matches('.vn-section') && content.children.length && remaining() < MIN_SECTION) newPage();
          content.appendChild(b);
          if (fits()) continue;
          if (b.matches('.vn-tablefig')) {
            const tail = splitTable(b);
            if (tail) { queue.unshift(tail); newPage(); continue; }
          }
          if (content.children.length === 1) { warnings.push('block taller than a page on page ' + pages.length); continue; }
          b.remove();
          if (b.hasAttribute('data-float')) { floats.push(b); joinPrev = true; continue; }
          newPage();
          queue.unshift(b);
        } else {
          let run = [];
          while (queue.length && !queue[0].classList.contains('span')) run.push(queue.shift());
          // a figure was just deferred to the next page: let this text continue the columns above it
          const prev = content.lastElementChild;
          if (joinPrev && prev && prev.matches('.vn-cols')) { run = [...prev.children, ...run]; prev.remove(); }
          joinPrev = false;
          placeRun(run);
        }
      }
      if (floats.length) newPage();

      /* ---- crumbs, folios, contents ---- */
      const toc = [];
      let section = null;
      pages.forEach((p, i) => {
        const folio = i + cfg.firstFolio;
        if (p.dataset.kind !== 'content') return;
        const c = p.querySelector('.vn-content');
        const first = c.firstElementChild;
        if (first && first.matches('.vn-section')) section = first;
        p.querySelector('.vn-crumb').textContent = section ? `${section.dataset.no} · ${section.dataset.title}` : '';
        p.querySelector('.vn-folio').textContent = `${cfg.footerWord} ${folio}`;
        p.dataset.title = section ? section.dataset.title : '';
        c.querySelectorAll('h1.vn-section, h2.vn-sub').forEach((h) => {
          toc.push({ level: h.tagName === 'H1' ? 1 : 2, no: h.dataset.no, title: h.dataset.title, page: folio });
          if (h.tagName === 'H1') section = h;
        });
      });
      const tc = tocPage.querySelector('.vn-content');
      tc.innerHTML = `<div class="vn-toc-title">${cfg.tocTitle}</div><div class="vn-toc">` + toc.map((t) =>
        `<div class="vn-toc-row${t.level === 2 ? ' vn-toc-sub' : ''}"><span class="vn-tn">${t.no}</span><span class="vn-tt">${t.title}</span><span class="vn-tp">${t.page}</span></div>`).join('') + '</div>';
      tocPage.querySelector('.vn-crumb').textContent = cfg.tocTitle;
      tocPage.querySelector('.vn-folio').textContent = `${cfg.footerWord} ${1 + cfg.firstFolio}`;
      tocPage.dataset.title = cfg.tocTitle;
      cover.dataset.title = 'Titel';

      /* ---- checks ---- */
      const stats = pages.map((p, i) => {
        const c = p.querySelector('.vn-content');
        if (!c) return { page: i + 1, kind: p.dataset.kind };
        const top = c.getBoundingClientRect().top;
        const h = c.clientHeight;
        let bottom = 0, overflowCols = 0;
        [...c.children].forEach((k) => { bottom = Math.max(bottom, k.getBoundingClientRect().bottom - top); });
        c.querySelectorAll('.vn-cols').forEach((cols) => {
          const base = cols.getBoundingClientRect();
          const colW = cols.classList.contains('vn-single') ? base.width : (base.width - GAP) / 2;
          [...cols.children].forEach((k) => [...k.getClientRects()].forEach((rc) => {
            if (rc.right > base.right + 1 || rc.bottom > base.bottom + 1.5) overflowCols++;
          }));
        });
        return { page: i + 1, kind: p.dataset.kind, freePt: Math.round((h - bottom) / PT), overflow: bottom > h + 0.5, overflowCols };
      });
      return { pages, warnings, stats, toc };
    };

    /* ---- 3. Density solver: loosest setting that fits the page limit ---- */
    let chosen = null, run = null;
    const tried = [];
    for (const d of cfg.densities) {
      run = paginate(d);
      const contentPages = run.pages.filter((p) => p.dataset.kind === 'content').length;
      const cs = run.stats.filter((s) => s.kind === 'content');
      tried.push({ ...d, contentPages, lastFree: cs[cs.length - 1].freePt });
      chosen = d;
      if (contentPages <= cfg.maxContentPages) break;
    }
    result.tried = tried;
    result.density = chosen;
    result.warnings = run.warnings;
    result.stats = run.stats;
    result.toc = run.toc;
    /* Text integrity: the paged text must equal the source flow, character for character
       (whitespace and soft hyphens aside). Floated figures may move, so they are compared as a set. */
    const squash = (s) => s.replace(/[\s ­]/g, '');
    const streams = (roots) => {
      let main = '';
      const fl = [];
      roots.forEach((root) => {
        const c = root.cloneNode(true);
        c.querySelectorAll('[data-repeat]').forEach((x) => x.remove());   // table heads repeated after a page break
        c.querySelectorAll('figure[data-float]').forEach((f) => { fl.push(squash(f.textContent)); f.remove(); });
        main += squash(c.textContent);
      });
      return { main, floats: fl.sort() };
    };
    const a = streams([flowSrc]);
    const b = streams(run.pages.filter((p) => p.dataset.kind === 'content').map((p) => p.querySelector('.vn-content')));
    let firstDiff = -1;
    if (a.main !== b.main) { firstDiff = 0; while (a.main[firstDiff] === b.main[firstDiff]) firstDiff++; }
    result.integrity = {
      mainEqual: a.main === b.main,
      floatsEqual: JSON.stringify(a.floats) === JSON.stringify(b.floats),
      srcChars: a.main.length, outChars: b.main.length,
      diffAt: firstDiff < 0 ? null : { src: a.main.slice(Math.max(0, firstDiff - 40), firstDiff + 40), out: b.main.slice(Math.max(0, firstDiff - 40), firstDiff + 40) },
    };
    result.flowText = flowSrc.textContent.replace(/­/g, '');
    result.pages = run.pages.map((p) => {
      const kind = p.dataset.kind, title = p.dataset.title || '';
      p.removeAttribute('style'); p.removeAttribute('data-kind'); p.removeAttribute('data-title');
      return { kind, title, inner: p.innerHTML };
    });
    result.ok = true;
  } catch (e) {
    log.push('ERROR ' + (e && e.stack ? e.stack : e));
  }
  const out = document.createElement('script');
  out.type = 'application/json';
  out.id = 'vn-result';
  out.textContent = JSON.stringify(result).replace(/</g, '\\u003c');
  document.body.appendChild(out);
  document.title = 'VN_DONE';
})();
