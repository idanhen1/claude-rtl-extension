const HEBREW_RE = /[\u0590-\u05FF]/;
const STORAGE_KEY = "claudeRtlEnabled";
const ENABLED_CLASS = "claude-rtl-helper-enabled";
const RTL_TEXT_CLASS = "claude-rtl-helper-text";

const MESSAGE_TEXT_SELECTORS = [
  '[data-testid="user-message"]',
  '[data-testid="user-message"] p',
  '.standard-markdown p',
  '.standard-markdown li',
  '.standard-markdown blockquote',
  '.standard-markdown h1',
  '.standard-markdown h2',
  '.standard-markdown h3',
  '.standard-markdown h4',
  '.standard-markdown h5',
  '.standard-markdown h6',
  '.progressive-markdown p',
  '.progressive-markdown li',
  '.progressive-markdown blockquote',
  '.progressive-markdown h1',
  '.progressive-markdown h2',
  '.progressive-markdown h3',
  '.progressive-markdown h4',
  '.progressive-markdown h5',
  '.progressive-markdown h6',
  'textarea'
];

let isEnabled = true;
let scheduled = false;

function hasHebrew(text) {
  return HEBREW_RE.test(text || "");
}

function getElementText(element) {
  if (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement) {
    return element.value || "";
  }

  return element.innerText || element.textContent || "";
}

function shouldSkipElement(element) {
  return Boolean(
    element.closest('pre, code, svg, button, nav, header, aside, .code-block__code, [class*="code-block"]')
  );
}

function removeRtlClasses() {
  document.querySelectorAll("." + RTL_TEXT_CLASS).forEach((element) => {
    element.classList.remove(RTL_TEXT_CLASS);
  });
}

function setGlobalEnabledState(enabled) {
  document.documentElement.classList.toggle(ENABLED_CLASS, enabled);
}

function applyDirectionToElement(element) {
  if (!element || shouldSkipElement(element)) {
    return;
  }

  element.classList.remove(RTL_TEXT_CLASS);

  if (!isEnabled) {
    return;
  }

  if (hasHebrew(getElementText(element))) {
    element.classList.add(RTL_TEXT_CLASS);
  }
}

function applyRtlToHebrewMessages() {
  setGlobalEnabledState(isEnabled);

  if (!isEnabled) {
    removeRtlClasses();
    return;
  }

  document.querySelectorAll(MESSAGE_TEXT_SELECTORS.join(",")).forEach((element) => {
    applyDirectionToElement(element);
  });
}

function scheduleApplyRtl() {
  if (scheduled) {
    return;
  }

  scheduled = true;

  window.requestAnimationFrame(() => {
    scheduled = false;
    applyRtlToHebrewMessages();
  });
}

chrome.storage.sync.get({ [STORAGE_KEY]: true }, (result) => {
  isEnabled = Boolean(result[STORAGE_KEY]);
  applyRtlToHebrewMessages();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "sync" || !changes[STORAGE_KEY]) {
    return;
  }

  isEnabled = Boolean(changes[STORAGE_KEY].newValue);
  applyRtlToHebrewMessages();
});

const observer = new MutationObserver(() => {
  scheduleApplyRtl();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true
});
