// eruda-inertia-svelte.js

const TOOL_NAME = 'inertia';
const CDN = '//cdn.jsdelivr.net/npm/eruda'; // 'https://localhost:5173/resources/js/devtool/eruda.min.js';
const isBrowser = typeof window !== 'undefined';

function getPage() {
    try {
        const raw = document.getElementById('app')?.dataset?.page;
        if (raw) return JSON.parse(raw);
    } catch {}
    return {};
}

function loadEruda() {
    if (!isBrowser) return Promise.reject(new Error('[eruda-inertia] SSR'));
    if (window.eruda) return Promise.resolve(window.eruda);
    return new Promise((resolve, reject) => {
        const s = Object.assign(document.createElement('script'), {
            src: CDN,
            onload: () => resolve(window.eruda),
            onerror: () => reject(new Error('[eruda-inertia] CDN load failed')),
        });
        document.head.appendChild(s);
    });
}

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
.eis-root {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  font-family: 'Geist Mono','JetBrains Mono','Fira Code',monospace;
  font-size: 12px;
  background: #1c1c1c;
  color: #e0e0e0;
  display: flex;
  flex-direction: column;
}

/* ── Toolbar ── */
.eis-toolbar {
  display: flex;
  align-items: center;
  padding: 0 8px;
  height: 36px;
  min-height: 36px;
  background: #161616;
  border-bottom: 1px solid #2a2a2a;
  flex-shrink: 0;
  gap: 0;
}
.eis-logo {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-right: 12px;
  flex-shrink: 0;
}
.eis-logo-icon { width: 15px; height: 15px; flex-shrink: 0; }
.eis-logo-text { font-size: 11px; font-weight: 700; color: #fff; letter-spacing: .3px; }
.eis-logo-text em { color: #ff3e00; font-style: normal; }
.eis-tabs {
  display: flex;
  align-items: stretch;
  height: 100%;
  flex: 1;
}
.eis-tab {
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: #666;
  padding: 0 12px;
  cursor: pointer;
  font-size: 11px;
  font-family: inherit;
  font-weight: 500;
  transition: color .15s, border-color .15s;
  white-space: nowrap;
}
.eis-tab:hover { color: #ccc; }
.eis-tab.active { color: #ff3e00; border-bottom-color: #ff3e00; font-weight: 700; }
.eis-refresh {
  margin-left: auto;
  background: transparent;
  border: 1px solid #2d2d2d;
  color: #555;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color .15s, border-color .15s;
  flex-shrink: 0;
}
.eis-refresh:hover { color: #ff3e00; border-color: #ff3e00; }

/* ── Info bar ── */
.eis-infobar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
  background: #191919;
  border-bottom: 1px solid #252525;
  flex-shrink: 0;
}
.eis-component-badge {
  background: rgba(255,62,0,.12);
  color: #ff3e00;
  border: 1px solid rgba(255,62,0,.25);
  padding: 1px 7px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.eis-url {
  color: #555;
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}
.eis-version { color: #3a3a3a; font-size: 10px; flex-shrink: 0; }

/* ── Content ── */
.eis-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

/* ── Section header (Props / Events / State) ── */
.eis-section-header {
  padding: 8px 10px 4px;
  font-size: 11px;
  font-weight: 700;
  color: #888;
  letter-spacing: .5px;
  user-select: none;
}

/* ── Tree ── */
.eis-tree { padding: 0 0 6px; }
.eis-tree-row {
  display: flex;
  align-items: baseline;
  padding: 2px 0;
  cursor: default;
  white-space: nowrap;
  user-select: none;
}
.eis-tree-row:hover { background: rgba(255,255,255,.03); }
.eis-tree-row.expandable { cursor: pointer; }

/* depth-based left padding via inline style on .eis-tree-indent */
.eis-tree-indent { display: inline-flex; align-items: center; flex-shrink: 0; }

.eis-toggle {
  display: inline-block;
  width: 14px;
  text-align: center;
  font-size: 9px;
  color: #aaa;
  flex-shrink: 0;
  transition: color .1s;
}

.eis-tree-row:hover { background: rgba(255,255,255,.03); }
.eis-tree-row.selected { background: rgba(255,62,0,0.1)!important; border-left: 2px solid #ff3e00; }
.eis-tree-row.expandable { cursor: pointer; }

.eis-key   { color: #c792ea; flex-shrink: 0; }
.eis-colon { color: #555; margin: 0 4px; flex-shrink: 0; }
.eis-val   { overflow: hidden; text-overflow: ellipsis; }

.eis-val.t-string  { color: #89ddff; }
.eis-val.t-number  { color: #f78c6c; }
.eis-val.t-bool    { color: #ff5370; }
.eis-val.t-null    { color: #546e7a; font-style: italic; }
.eis-val.t-object  { color: #546e7a; }
.eis-val.t-array   { color: #546e7a; }
.eis-val.t-func    { color: #82aaff; }

.eis-children { display: none; }
.eis-children.open { display: block; }

/* ── History ── */
.eis-history { padding: 0; }
.eis-hist-item {
  display: flex;
  align-items: flex-start;
  padding: 6px 10px;
  border-bottom: 1px solid #222;
  gap: 8px;
}
.eis-hist-item:last-child { border-bottom: none; }
.eis-hist-item:hover { background: rgba(255,255,255,.03); }
.eis-hist-idx { color: #3a3a3a; font-size: 10px; min-width: 18px; flex-shrink: 0; padding-top: 1px; }
.eis-hist-body { flex: 1; overflow: hidden; }
.eis-hist-name { color: #ff3e00; font-weight: 700; font-size: 11px; display: block; margin-bottom: 2px; }
.eis-hist-url  { color: #4a7a5a; font-size: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
.eis-hist-time { color: #3a3a3a; font-size: 10px; flex-shrink: 0; padding-top: 1px; white-space: nowrap; }

/* ── Empty / Status ── */
.eis-empty { color: #444; padding: 6px 10px; font-style: italic; font-size: 11px; }
.eis-statusbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px;
  background: #161616;
  border-top: 1px solid #222;
  flex-shrink: 0;
}
.eis-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ff3e00;
  box-shadow: 0 0 4px rgba(255,62,0,.5);
  flex-shrink: 0;
}
.eis-status-text { color: #3a3a3a; font-size: 10px; }

/* ── Penambahan Fitur Split Layout ── */
.eis-split-view {
  display: flex;
  height: 100%;
  overflow: hidden;
}

.eis-split-sidebar {
  width: 250px;
  min-width: 250px;
  max-width: 45%;
  border-right: 1px solid #2a2a2a;
  overflow-y: auto;
  background: #1a1a1a;
  flex-shrink: 0;
}

.eis-split-main {
  flex: 1;
  overflow-y: auto;
  background: #1c1c1c;
  padding-bottom: 20px;
}

.eis-prop-item {
  padding: 10px 12px;
  border-bottom: 1px solid #252525;
  cursor: pointer;
  font-size: 11px;
  color: #888;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all.15s ease;
}

.eis-prop-item:hover {
  background: rgba(255,255,255,0.03);
  color: #ccc;
}

.eis-prop-item.active {
  background: rgba(255,62,0,0.12);
  color: #ff3e00;
  border-left: 3px solid #ff3e00;
  font-weight: 700;
}

.eis-split-header {
  padding: 8px 10px;
  background: #161616;
  font-size: 10px;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #252525;
}
`;

const SVELTE_ICON = `<svg class="eis-logo-icon" viewBox="0 0 98.1 118" xmlns="http://www.w3.org/2000/svg">
  <path fill="#ff3e00" d="M91.8 15.6C80.9-.1 59.2-4.7 43.6 5.2L16.1 22.8C8.6 27.5 3.4 35.2 2 44c-1.3 7.3.6 14.9 5.1 20.8-3.2 4.9-4.4 10.8-3.1 16.5 2.5 11.1 11.1 19.9 22 22.9 4.7 1.3 9.6 1.2 14.3-.2 2.4 4.4 6.2 7.9 10.9 9.9 4.5 2 9.5 2.2 14.1.6 7.9-2.6 14.1-9.2 16.2-17.4l.1-.3c1.6-5.5 1.4-11.4-.5-16.7 3.4-4.8 4.8-10.7 3.8-16.5-1.1-6.3-4.6-12-9.8-15.9.8-3.6.5-7.4-.8-10.8-1.5-3.8-4.2-7-7.7-9.2-6.5-4.2-15.1-3.1-20.3 2.5L38.4 56c-.8.9-1.5 1.8-2 2.9-.7 1.4-.9 3-.6 4.5.2 1 .7 1.9 1.3 2.7.8 1 1.9 1.8 3.1 2.2 2.3.8 4.9.2 6.6-1.5l14.1-15.4c.6-.6 1.4-1 2.2-1 .8 0 1.6.3 2.2 1 .6.6 1 1.4 1 2.3 0 .9-.4 1.7-1 2.3L51.2 71.5c-4.7 5.1-11.9 7.1-18.6 5.2-3.4-1-6.5-2.9-8.8-5.6-2.3-2.7-3.8-6-4.2-9.5-.6-5.4 1.2-10.7 4.9-14.7L52 20.3c4.5-4.9 11-7.5 17.6-7 6.8.5 13 3.9 17 9.3 3.2 4.4 4.7 9.7 4.3 15.1-.1 1.6-.4 3.2-.9 4.7-.3.9-.2 1.9.2 2.7.4.8 1.1 1.5 1.9 1.8 1.4.6 3 .4 4.1-.6.5-.4.8-1 1-1.6.7-2.3 1.1-4.7 1.2-7.1.3-8.3-2.5-16.5-7.6-23z"/>
</svg>`;

const _esc = (s) =>
    String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

// ── Tree: value formatting ────────────────────────────────────────────────────
function typeOf(v) {
    if (v === null || v === undefined) return 't-null';
    if (typeof v === 'function') return 't-func';
    if (Array.isArray(v)) return 't-array';
    if (typeof v === 'object') return 't-object';
    if (typeof v === 'string') return 't-string';
    if (typeof v === 'number') return 't-number';
    if (typeof v === 'boolean') return 't-bool';
    return '';
}

function formatVal(v) {
    if (v === null) return 'null';
    if (v === undefined) return 'undefined';
    if (typeof v === 'function')
        return `function ${_esc(v.name || 'anonymous')}()`;
    if (Array.isArray(v)) return `Array [${v.length}]`;
    if (typeof v === 'object')
        return `Object {${Object.keys(v).length > 0 ? '…' : ''}}`;
    if (typeof v === 'string') return `"${_esc(v)}"`;
    return _esc(String(v));
}

let _nodeId = 0;

// Returns HTML string; expandable nodes store children in a sibling div
function renderTree(obj, depth = 0) {
    if (depth > 6) return '';
    const indent = depth * 16 + 10; // px

    return Object.entries(obj)
        .map(([k, v]) => {
            const tc = typeOf(v);
            const isExp =
                (tc === 't-object' || tc === 't-array') &&
                v !== null &&
                Object.keys(v).length > 0;
            const nid = `en${++_nodeId}`;
            const children = isExp
                ? `<div class="eis-children" id="${nid}">${renderTree(v, depth + 1)}</div>`
                : '';

            return `
      <div class="eis-tree-row${isExp ? ' expandable' : ''}"
           style="padding-left:${indent}px"
           ${isExp ? `data-toggle="${nid}"` : ''}>
        <span class="eis-toggle">${isExp ? '▶' : ''}</span>
        <span class="eis-key">${_esc(String(k))}</span>
        <span class="eis-colon">:</span>
        <span class="eis-val ${tc}">${formatVal(v)}</span>
      </div>
      ${children}`;
        })
        .join('');
}

// ── Plugin ────────────────────────────────────────────────────────────────────
function createPlugin(eruda) {
    const { util } = eruda;

    class InertiaPlugin extends eruda.Tool {
        constructor() {
            super();
            this.name = TOOL_NAME;
            this._css = util.evalCss(CSS);
            this._history = [];
            this._tab = 'props';
            this._page = getPage();
            this._selectedProp = null;

            this._onNavigate = (ev) => {
                const p = ev.detail?.page ?? {};
                this._page = p;
                this._history.unshift({
                    url: p.url ?? location.href,
                    component: p.component ?? '—',
                    time: new Date().toLocaleTimeString(),
                });
                if (this._history.length > 50) this._history.pop();
                this._render();
            };
        }

        init($el) {
            super.init($el);
            this.$el = $el;
            document.addEventListener('inertia:navigate', this._onNavigate);
            this._bind();
            this._render();
        }

        show() {
            super.show();
            this._render();
        }

        _render() {
            if (!this.$el) return;
            _nodeId = 0; // reset ID counter on each render
            const p = Object.keys(this._page).length ? this._page : getPage();
            const props = p.props ?? {};
            const p_keys = Object.keys(props);

            // Auto-select prop pertama jika belum ada yang dipilih
            if (this._selectedProp === null && p_keys.length > 0) {
                this._selectedProp = p_keys;
            }

            const propsTab = `
        <div class="eis-split-view">
          <div class="eis-split-sidebar">
            <div class="eis-split-header">Properties</div>
            ${
                p_keys.length
                    ? p_keys
                          .map(
                              (k) => `
              <div class="eis-prop-item ${this._selectedProp === k ? 'active' : ''}"
                   data-action="select-prop" data-prop="${_esc(k)}">
                ${_esc(k)}
              </div>
            `,
                          )
                          .join('')
                    : '<div class="eis-empty">No props.</div>'
            }
          </div>
          <div class="eis-split-main">
            <div class="eis-split-header">Detail: ${this._selectedProp || '—'}</div>
            <div class="eis-tree">
              ${
                  this._selectedProp && props[this._selectedProp] !== undefined
                      ? typeof props[this._selectedProp] === 'object' &&
                        props[this._selectedProp] !== null
                          ? renderTree(props[this._selectedProp])
                          : `<div class="eis-tree-row" style="padding-left:10px">
                       <span class="eis-val ${typeOf(props[this._selectedProp])}">${formatVal(props[this._selectedProp])}</span>
                     </div>`
                      : '<div class="eis-empty">Select a property to view.</div>'
              }
            </div>
          </div>
        </div>`;

            const histTab = `
        <div class="eis-history">
          ${
              this._history.length
                  ? this._history
                        .map(
                            (h, i) => `
                <div class="eis-hist-item">
                  <span class="eis-hist-idx">${i + 1}</span>
                  <div class="eis-hist-body">
                    <span class="eis-hist-name">&lt;${_esc(h.component)}&gt;</span>
                    <span class="eis-hist-url">${_esc(h.url)}</span>
                  </div>
                  <span class="eis-hist-time">${h.time}</span>
                </div>`,
                        )
                        .join('')
                  : '<div class="eis-empty">No navigation events yet.</div>'
          }
        </div>`;

            this.$el.html(`
        <div class="eis-root">
          <div class="eis-toolbar">
            <div class="eis-logo">
              ${SVELTE_ICON}
              <span class="eis-logo-text">Inertia<em>/</em>Svelte</span>
            </div>
            <div class="eis-tabs">
              <button class="eis-tab ${this._tab === 'props' ? 'active' : ''}" data-action="tab-props">Props</button>
              <button class="eis-tab ${this._tab === 'history' ? 'active' : ''}" data-action="tab-hist">
                History${this._history.length ? ` (${this._history.length})` : ''}
              </button>
            </div>
            <button class="eis-refresh" data-action="refresh">↺</button>
          </div>

          <div class="eis-infobar">
            <span class="eis-component-badge">${_esc(p.component ?? 'Unknown')}</span>
            <span class="eis-url">${_esc(p.url ?? location.href)}</span>
            ${p.version ? `<span class="eis-version">v${_esc(p.version)}</span>` : ''}
          </div>

          <div class="eis-content" id="eis-content">
            ${this._tab === 'props' ? propsTab : histTab}
          </div>

          <div class="eis-statusbar">
            <span class="eis-status-dot"></span>
            <span class="eis-status-text">
              ${this._history.length} navigations · ${Object.keys(props).length} props
            </span>
          </div>
        </div>
      `);
        }

        _bind() {
            const root = this.$el.get(0);
            if (!root) return;

            // Single delegated listener — no inline onclick, no ID lookups per button
            root.addEventListener(
                'click',
                (e) => {
                    const action =
                        e.target.closest('[data-action]')?.dataset.action;
                    if (action === 'refresh') {
                        this._page = getPage();
                        this._render();
                        return;
                    }
                    if (action === 'tab-props') {
                        this._tab = 'props';
                        this._render();
                        return;
                    }
                    if (action === 'tab-hist') {
                        this._tab = 'history';
                        this._render();
                        return;
                    }
                    if (action === 'select-prop') {
                        this._selectedProp =
                            e.target.closest('[data-prop]').dataset.prop;
                        this._render();
                        return;
                    }

                    // Tree node toggle
                    const row = e.target.closest('.eis-tree-row');
                    if (row) {
                        const cid = row.dataset.toggle;
                        const children = root.querySelector('#' + cid);
                        const toggle = row.querySelector('.eis-toggle');
                        if (!children || !toggle) return;
                        const open = children.classList.toggle('open');
                        toggle.textContent = open ? '▼' : '▶';
                    }
                },
                { capture: false },
            );
        }

        destroy() {
            super.destroy();
            document.removeEventListener('inertia:navigate', this._onNavigate);
            util.evalCss.remove(this._css);
        }
    }

    return new InertiaPlugin();
}

// ── Public API ────────────────────────────────────────────────────────────────
export async function initEruda(opts = {}) {
    if (!isBrowser) return;
    const { defaults = {}, devOnly = true } = opts;
    if (devOnly && import.meta.env?.PROD) return;
    const eruda = await loadEruda();
    eruda.init({ defaults });
    eruda.add((eruda) => createPlugin(eruda));
}
