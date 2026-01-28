(() => {
  const STORAGE_KEY = "profileDataOverride";

  const $ = (id) => document.getElementById(id);
  const statusEl = $("status");
  const editorEl = $("json-editor");
  const storageKeyEl = $("storage-key");
  const overrideActiveEl = $("override-active");

  function setStatus(kind, message) {
    statusEl.classList.remove("ok", "warn", "err");
    if (kind) statusEl.classList.add(kind);
    statusEl.textContent = message;
  }

  function prettyJson(obj) {
    return JSON.stringify(obj, null, 2);
  }

  function safeParseJson(text) {
    try {
      const obj = JSON.parse(text);
      return { ok: true, obj };
    } catch (err) {
      return { ok: false, error: err };
    }
  }

  function getBaseProfileData() {
    // `profile-data.js` defines `profileData` in browser scope.
    if (typeof profileData === "undefined") return null;
    return profileData;
  }

  function getOverride() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = safeParseJson(raw);
    if (!parsed.ok) return null;
    return parsed.obj;
  }

  function getEffective() {
    const override = getOverride();
    if (override) return override;
    return getBaseProfileData();
  }

  function refreshBadges() {
    storageKeyEl.textContent = STORAGE_KEY;
    const raw = localStorage.getItem(STORAGE_KEY);
    overrideActiveEl.textContent = raw ? "YES" : "NO";
  }

  function loadIntoEditor(obj) {
    if (!obj) {
      editorEl.value = "";
      setStatus("err", "Could not load profileData. Make sure `profile-data.js` exists and is loaded.");
      refreshBadges();
      return;
    }
    editorEl.value = prettyJson(obj);
    setStatus("ok", "Loaded.");
    refreshBadges();
  }

  function download(filename, text, mime = "application/json") {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function copyToClipboard(text) {
    if (navigator.clipboard?.writeText) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback
    const t = document.createElement("textarea");
    t.value = text;
    t.style.position = "fixed";
    t.style.opacity = "0";
    document.body.appendChild(t);
    t.focus();
    t.select();
    document.execCommand("copy");
    t.remove();
    return Promise.resolve();
  }

  function initThemeMenu() {
    const themeToggle = $("theme-toggle");
    const themeMenu = $("theme-menu");

    if (!themeToggle || !themeMenu) return;

    themeToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      themeMenu.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (!themeMenu.contains(e.target) && !themeToggle.contains(e.target)) {
        themeMenu.classList.remove("active");
      }
    });

    document.querySelectorAll(".theme-option").forEach((opt) => {
      opt.addEventListener("click", () => {
        const themeName = opt.getAttribute("data-theme");
        if (window.applyTheme && themeName) {
          window.applyTheme(themeName);
        }
        themeMenu.classList.remove("active");
      });
    });
  }

  function init() {
    // Apply last selected theme (shared with site).
    if (window.initTheme) window.initTheme();
    initThemeMenu();

    $("btn-load-effective").addEventListener("click", () => loadIntoEditor(getEffective()));
    $("btn-load-base").addEventListener("click", () => loadIntoEditor(getBaseProfileData()));

    $("btn-save").addEventListener("click", () => {
      const parsed = safeParseJson(editorEl.value);
      if (!parsed.ok) {
        setStatus("err", `Invalid JSON: ${parsed.error.message}`);
        refreshBadges();
        return;
      }
      localStorage.setItem(STORAGE_KEY, prettyJson(parsed.obj));
      setStatus("ok", "Saved override to localStorage. Refresh `landing/index.html` to see changes.");
      refreshBadges();
    });

    $("btn-reset").addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      setStatus("warn", "Override cleared. The site will use the base `profile-data.js` again.");
      refreshBadges();
    });

    $("btn-download-json").addEventListener("click", () => {
      const parsed = safeParseJson(editorEl.value);
      if (!parsed.ok) {
        setStatus("err", `Invalid JSON: ${parsed.error.message}`);
        refreshBadges();
        return;
      }
      download("profileData.override.json", prettyJson(parsed.obj));
      setStatus("ok", "Downloaded `profileData.override.json`.");
      refreshBadges();
    });

    $("btn-copy-js").addEventListener("click", async () => {
      const parsed = safeParseJson(editorEl.value);
      if (!parsed.ok) {
        setStatus("err", `Invalid JSON: ${parsed.error.message}`);
        refreshBadges();
        return;
      }

      const js = `// Profile Data Configuration\n// Generated from admin page\n\nconst profileData = ${prettyJson(parsed.obj)};\n\n// Export for use in other files\nif (typeof module !== 'undefined' && module.exports) {\n  module.exports = profileData;\n}\n`;
      try {
        await copyToClipboard(js);
        setStatus("ok", "Copied a full `profile-data.js` snippet to clipboard.");
      } catch (e) {
        setStatus("warn", "Could not copy automatically. Your browser may block clipboard access.");
      }
      refreshBadges();
    });

    // Initial load uses effective data (override if present).
    loadIntoEditor(getEffective());
  }

  window.addEventListener("load", init);
})();

