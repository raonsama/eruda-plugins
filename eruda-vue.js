// eruda-inertia-vue.js

const TOOL_NAME = 'inertia';
const CDN = '//cdn.jsdelivr.net/npm/eruda'; // 'https://localhost:5173/resources/js/devtool/eruda.min.js';
const isBrowser = typeof window !== 'undefined';

function getPage() {
  try {
    const raw = document.getElementById('app')?.dataset?.page;
    if (raw) return JSON.parse(raw);
  } catch { }
  return {};
}

function loadEruda() {
  if (!isBrowser) return Promise.reject(new Error('[eruda-inertia-vue] SSR'));
  if (window.eruda) return Promise.resolve(window.eruda);
  return new Promise((resolve, reject) => {
    const s = Object.assign(document.createElement('script'), {
      src: CDN,
      onload: () => resolve(window.eruda),
      onerror: () => reject(new Error('[eruda-inertia-vue] CDN load failed')),
    });
    document.head.appendChild(s);
  });
}

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
.eiv-root {
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
.eiv-toolbar {
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
.eiv-logo {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-right: 12px;
  flex-shrink: 0;
}
.eiv-logo-icon { width: 15px; height: 15px; flex-shrink: 0; }
.eiv-logo-text { font-size: 11px; font-weight: 700; color: #fff; letter-spacing: .3px; }
.eiv-logo-text em { color: #42b883; font-style: normal; }
.eiv-tabs {
  display: flex;
  align-items: stretch;
  height: 100%;
  flex: 1;
}
.eiv-tab {
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
.eiv-tab:hover { color: #ccc; }
.eiv-tab.active { color: #42b883; border-bottom-color: #42b883; font-weight: 700; }
.eiv-refresh {
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
.eiv-refresh:hover { color: #42b883; border-color: #42b883; }

/* ── Info bar ── */
.eiv-infobar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
  background: #191919;
  border-bottom: 1px solid #252525;
  flex-shrink: 0;
}
.eiv-component-badge {
  background: rgba(66,184,131,.12);
  color: #42b883;
  border: 1px solid rgba(66,184,131,.25);
  padding: 1px 7px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.eiv-url {
  color: #555;
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}
.eiv-version { color: #3a3a3a; font-size: 10px; flex-shrink: 0; }

/* ── Content ── */
.eiv-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

/* ── Section header ── */
.eiv-section-header {
  padding: 8px 10px 4px;
  font-size: 11px;
  font-weight: 700;
  color: #888;
  letter-spacing: .5px;
  user-select: none;
}

/* ── Tree ── */
.eiv-tree { padding: 0 0 6px; }
.eiv-tree-row {
  display: flex;
  align-items: baseline;
  padding: 2px 0;
  cursor: default;
  white-space: nowrap;
  user-select: none;
}
.eiv-tree-row:hover { background: rgba(255,255,255,.03); }
.eiv-tree-row.expandable { cursor: pointer; }
.eiv-tree-indent { display: inline-flex; align-items: center; flex-shrink: 0; }
.eiv-toggle {
  display: inline-block;
  width: 14px;
  text-align: center;
  font-size: 9px;
  color: #aaa;
  flex-shrink: 0;
  transition: color .1s;
}
.eiv-tree-row.selected { background: rgba(66,184,131,.10)!important; border-left: 2px solid #42b883; }

.eiv-key   { color: #c792ea; flex-shrink: 0; }
.eiv-colon { color: #555; margin: 0 4px; flex-shrink: 0; }
.eiv-val   { overflow: hidden; text-overflow: ellipsis; }

.eiv-val.t-string  { color: #89ddff; }
.eiv-val.t-number  { color: #f78c6c; }
.eiv-val.t-bool    { color: #ff5370; }
.eiv-val.t-null    { color: #546e7a; font-style: italic; }
.eiv-val.t-object  { color: #546e7a; }
.eiv-val.t-array   { color: #546e7a; }
.eiv-val.t-func    { color: #82aaff; }

.eiv-children { display: none; }
.eiv-children.open { display: block; }

/* ── History ── */
.eiv-history { padding: 0; }
.eiv-hist-item {
  display: flex;
  align-items: flex-start;
  padding: 6px 10px;
  border-bottom: 1px solid #222;
  gap: 8px;
}
.eiv-hist-item:last-child { border-bottom: none; }
.eiv-hist-item:hover { background: rgba(255,255,255,.03); }
.eiv-hist-idx { color: #3a3a3a; font-size: 10px; min-width: 18px; flex-shrink: 0; padding-top: 1px; }
.eiv-hist-body { flex: 1; overflow: hidden; }
.eiv-hist-name { color: #42b883; font-weight: 700; font-size: 11px; display: block; margin-bottom: 2px; }
.eiv-hist-url  { color: #4a7a5a; font-size: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
.eiv-hist-time { color: #3a3a3a; font-size: 10px; flex-shrink: 0; padding-top: 1px; white-space: nowrap; }

/* ── Empty / Status ── */
.eiv-empty { color: #444; padding: 6px 10px; font-style: italic; font-size: 11px; }
.eiv-statusbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px;
  background: #161616;
  border-top: 1px solid #222;
  flex-shrink: 0;
}
.eiv-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #42b883;
  box-shadow: 0 0 4px rgba(66,184,131,.5);
  flex-shrink: 0;
}
.eiv-status-text { color: #3a3a3a; font-size: 10px; }

/* ── Split Layout ── */
.eiv-split-view {
  display: flex;
  height: 100%;
  overflow: hidden;
}
.eiv-split-sidebar {
  width: 250px;
  min-width: 250px;
  max-width: 45%;
  border-right: 1px solid #2a2a2a;
  overflow-y: auto;
  background: #1a1a1a;
  flex-shrink: 0;
}
.eiv-split-main {
  flex: 1;
  overflow-y: auto;
  background: #1c1c1c;
  padding-bottom: 20px;
}
.eiv-prop-item {
  padding: 10px 12px;
  border-bottom: 1px solid #252525;
  cursor: pointer;
  font-size: 11px;
  color: #888;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all .15s ease;
}
.eiv-prop-item:hover {
  background: rgba(255,255,255,.03);
  color: #ccc;
}
.eiv-prop-item.active {
  background: rgba(66,184,131,.12);
  color: #42b883;
  border-left: 3px solid #42b883;
  font-weight: 700;
}
.eiv-split-header {
  padding: 8px 10px;
  background: #161616;
  font-size: 10px;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #252525;
}
`;

// Vue logo SVG
const VUE_ICON = `<svg class="eiv-logo-icon" viewBox="0 0 261.76 226.69" xmlns="http://www.w3.org/2000/svg">
  <path fill="#42b883" d="M161.096.001l-30.225 52.351L100.647.001H-.005l130.876 226.688L261.749.001z"/>
  <path fill="#35495e" d="M161.096.001l-30.225 52.351L100.647.001H52.346l78.525 136.01L209.398.001z"/>
</svg>`;

const _esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

// ── Tree helpers ──────────────────────────────────────────────────────────────
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
  if (typeof v === 'function') return `function ${_esc(v.name || 'anonymous')}()`;
  if (Array.isArray(v)) return `Array [${v.length}]`;
  if (typeof v === 'object') return `Object {${Object.keys(v).length > 0 ? '…' : ''}}`;
  if (typeof v === 'string') return `"${_esc(v)}"`;
  return _esc(String(v));
}

let _nodeId = 0;

function renderTree(obj, depth = 0) {
  if (depth > 6) return '';
  const indent = depth * 16 + 10;
  return Object.entries(obj)
    .map(([k, v]) => {
      const tc = typeOf(v);
      const isExp =
        (tc === 't-object' || tc === 't-array') &&
        v !== null &&
        Object.keys(v).length > 0;
      const nid = `en${++_nodeId}`;
      const children = isExp
        ? `<div class="eiv-children" id="${nid}">${renderTree(v, depth + 1)}</div>`
        : '';
      return `
      <div class="eiv-tree-row${isExp ? ' expandable' : ''}"
           style="padding-left:${indent}px"
           ${isExp ? `data-toggle="${nid}"` : ''}>
        <span class="eiv-toggle">${isExp ? '▶' : ''}</span>
        <span class="eiv-key">${_esc(String(k))}</span>
        <span class="eiv-colon">:</span>
        <span class="eiv-val ${tc}">${formatVal(v)}</span>
      </div>
      ${children}`;
    })
    .join('');
}

// ── Vue Router event detection ─────────────────────────────────────────────
// Supports both Inertia (inertia:navigate) and Vue Router (vue-router:navigate custom event).
// Call installVueRouterHook(router) if you have access to the router instance.
function emitNavigate(page) {
  document.dispatchEvent(
    new CustomEvent('eiv:navigate', { detail: { page } }),
  );
}

/**
 * Optional: pass your Vue Router instance to auto-track navigations.
 * @param {import('vue-router').Router} router
 */
export function installVueRouterHook(router) {
  router.afterEach((to) => {
    // Build a minimal page object compatible with the panel
    emitNavigate({
      url: to.fullPath,
      component: to.name ?? to.matched.at(-1)?.components?.default?.name ?? to.path,
      props: to.params,
    });
  });
}

// ── Plugin ────────────────────────────────────────────────────────────────────
function createPlugin(eruda) {
  const { util } = eruda;

  class VuePlugin extends eruda.Tool {
    constructor() {
      super();
      this.name = TOOL_NAME;
      this._css = util.evalCss(CSS);
      this._history = [];
      this._tab = 'props';
      this._page = getPage();
      this._selectedProp = null;

      // Handles both Inertia and Vue Router navigations
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

      // Inertia.js navigate event
      this._onInertia = (ev) => {
        const p = ev.detail?.page ?? {};
        this._onNavigate({ detail: { page: p } });
      };
    }

    init($el) {
      super.init($el);
      this.$el = $el;
      document.addEventListener('inertia:navigate', this._onInertia);
      document.addEventListener('eiv:navigate', this._onNavigate);
      this._bind();
      this._render();
    }

    show() {
      super.show();
      this._render();
    }

    _render() {
      if (!this.$el) return;
      _nodeId = 0;
      const p = Object.keys(this._page).length ? this._page : getPage();
      const props = p.props ?? {};
      const p_keys = Object.keys(props);

      if (this._selectedProp === null && p_keys.length > 0) {
        this._selectedProp = p_keys[0];
      }

      const propsTab = `
        <div class="eiv-split-view">
          <div class="eiv-split-sidebar">
            <div class="eiv-split-header">Properties</div>
            ${p_keys.length
          ? p_keys
            .map(
              (k) => `
              <div class="eiv-prop-item ${this._selectedProp === k ? 'active' : ''}"
                   data-action="select-prop" data-prop="${_esc(k)}">
                ${_esc(k)}
              </div>`,
            )
            .join('')
          : '<div class="eiv-empty">No props.</div>'
        }
          </div>
          <div class="eiv-split-main">
            <div class="eiv-split-header">Detail: ${this._selectedProp || '—'}</div>
            <div class="eiv-tree">
              ${this._selectedProp && props[this._selectedProp] !== undefined
          ? typeof props[this._selectedProp] === 'object' &&
            props[this._selectedProp] !== null
            ? renderTree(props[this._selectedProp])
            : `<div class="eiv-tree-row" style="padding-left:10px">
                       <span class="eiv-val ${typeOf(props[this._selectedProp])}">${formatVal(props[this._selectedProp])}</span>
                     </div>`
          : '<div class="eiv-empty">Select a property to view.</div>'
        }
            </div>
          </div>
        </div>`;

      const histTab = `
        <div class="eiv-history">
          ${this._history.length
          ? this._history
            .map(
              (h, i) => `
                <div class="eiv-hist-item">
                  <span class="eiv-hist-idx">${i + 1}</span>
                  <div class="eiv-hist-body">
                    <span class="eiv-hist-name">&lt;${_esc(h.component)}&gt;</span>
                    <span class="eiv-hist-url">${_esc(h.url)}</span>
                  </div>
                  <span class="eiv-hist-time">${h.time}</span>
                </div>`,
            )
            .join('')
          : '<div class="eiv-empty">No navigation events yet.</div>'
        }
        </div>`;

      this.$el.html(`
        <div class="eiv-root">
          <div class="eiv-toolbar">
            <div class="eiv-logo">
              ${VUE_ICON}
              <span class="eiv-logo-text">Inertia<em>/</em>Vue</span>
            </div>
            <div class="eiv-tabs">
              <button class="eiv-tab ${this._tab === 'props' ? 'active' : ''}" data-action="tab-props">Props</button>
              <button class="eiv-tab ${this._tab === 'history' ? 'active' : ''}" data-action="tab-hist">
                History${this._history.length ? ` (${this._history.length})` : ''}
              </button>
            </div>
            <button class="eiv-refresh" data-action="refresh">↺</button>
          </div>

          <div class="eiv-infobar">
            <span class="eiv-component-badge">${_esc(p.component ?? 'Unknown')}</span>
            <span class="eiv-url">${_esc(p.url ?? location.href)}</span>
            ${p.version ? `<span class="eiv-version">v${_esc(p.version)}</span>` : ''}
          </div>

          <div class="eiv-content" id="eiv-content">
            ${this._tab === 'props' ? propsTab : histTab}
          </div>

          <div class="eiv-statusbar">
            <span class="eiv-status-dot"></span>
            <span class="eiv-status-text">
              ${this._history.length} navigations · ${Object.keys(props).length} props
            </span>
          </div>
        </div>
      `);
    }

    _bind() {
      const root = this.$el.get(0);
      if (!root) return;

      root.addEventListener(
        'click',
        (e) => {
          const action = e.target.closest('[data-action]')?.dataset.action;
          if (action === 'refresh') {
            this._page = getPage();
            this._selectedProp = null; // reset so first prop auto-selects
            this._render();
            return;
          }
          if (action === 'tab-props') { this._tab = 'props'; this._render(); return; }
          if (action === 'tab-hist') { this._tab = 'history'; this._render(); return; }
          if (action === 'select-prop') {
            this._selectedProp = e.target.closest('[data-prop]').dataset.prop;
            this._render();
            return;
          }

          // Tree toggle
          const row = e.target.closest('.eiv-tree-row');
          if (row) {
            const cid = row.dataset.toggle;
            const children = root.querySelector('#' + cid);
            const toggle = row.querySelector('.eiv-toggle');
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
      document.removeEventListener('inertia:navigate', this._onInertia);
      document.removeEventListener('eiv:navigate', this._onNavigate);
      util.evalCss.remove(this._css);
    }
  }

  return new VuePlugin();
}

// ── Public API ────────────────────────────────────────────────────────────────
/**
 * @param {object} opts
 * @param {object}  [opts.defaults]  - eruda.init() defaults
 * @param {boolean} [opts.devOnly]   - skip in production (default: true)
 * @param {import('vue-router').Router} [opts.router] - Vue Router instance for auto-tracking
 */
export async function initEruda(opts = {}) {
  if (!isBrowser) return;
  const { defaults = {}, devOnly = true, router } = opts;
  if (devOnly && import.meta.env?.PROD) return;
  const eruda = await loadEruda();
  eruda.init({ defaults });
  eruda.add((e) => createPlugin(e));
  if (router) installVueRouterHook(router);
}
