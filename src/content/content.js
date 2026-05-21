const RTL_RE =
  /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF\u{10800}-\u{10FFF}\u{1E800}-\u{1E95F}\u{1EE00}-\u{1EEFF}]/u;

const STORAGE_KEY = "claudeRtlEnabled";
const ENABLED_CLASS = "claude-rtl-helper-enabled";
const RTL_TEXT_CLASS = "claude-rtl-helper-text";
const MANAGED_ATTR = "data-claude-rtl-managed";

const MESSAGE_TEXT_SELECTORS = [
  '[data-testid="user-message"]',
  '[data-testid="user-message"] p',
  '[data-testid="user-message"] li',
  '[data-testid="user-message"] blockquote',
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

function hasRtlText(text) {
  return RTL_RE.test(text || "");
}

function getElementText(element) {
  if (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement) {
    return element.value || "";
  }

  return element.innerText || element.textContent || "";
}

function shouldSkipElement(element) {
  return Boolean(
    element.closest(
      'pre, code, svg, button, nav, header, aside, .code-block__code, [class*="code-block"]'
    )
  );
}

function setGlobalEnabledState(enabled) {
  document.documentElement.classList.toggle(ENABLED_CLASS, enabled);
}

function clearManagedElement(element) {
  element.classList.remove(RTL_TEXT_CLASS);

  if (element.getAttribute(MANAGED_ATTR) === "true") {
    element.removeAttribute("dir");
    element.removeAttribute(MANAGED_ATTR);
  }
}

function removeRtlHandling() {
  document
    .querySelectorAll("." + RTL_TEXT_CLASS + ", [" + MANAGED_ATTR + '="true"]')
    .forEach((element) => {
      clearManagedElement(element);
    });
}

function applyDirectionToElement(element) {
  if (!element || shouldSkipElement(element)) {
    return;
  }

  clearManagedElement(element);

  if (!isEnabled) {
    return;
  }

  if (hasRtlText(getElementText(element))) {
    element.classList.add(RTL_TEXT_CLASS);
    element.setAttribute("dir", "rtl");
    element.setAttribute(MANAGED_ATTR, "true");
  }
}

function applyRtlToMessages() {
  setGlobalEnabledState(isEnabled);

  if (!isEnabled) {
    removeRtlHandling();
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
    applyRtlToMessages();
  });
}

chrome.storage.sync.get({ [STORAGE_KEY]: true }, (result) => {
  isEnabled = Boolean(result[STORAGE_KEY]);
  applyRtlToMessages();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "sync" || !changes[STORAGE_KEY]) {
    return;
  }

  isEnabled = Boolean(changes[STORAGE_KEY].newValue);
  applyRtlToMessages();
});

const observer = new MutationObserver(() => {
  scheduleApplyRtl();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true
});
