const HEBREW_RE = /[\u0590-\u05FF]/;

const MESSAGE_TEXT_SELECTORS = [
  '[data-testid="user-message"]',
  '[data-testid="user-message"] p',
  '.standard-markdown',
  '.standard-markdown p',
  '.standard-markdown li',
  '.standard-markdown blockquote',
  '.standard-markdown h1',
  '.standard-markdown h2',
  '.standard-markdown h3',
  '.standard-markdown h4',
  '.standard-markdown h5',
  '.standard-markdown h6',
  '.progressive-markdown',
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

function hasHebrew(text) {
  return HEBREW_RE.test(text || "");
}

function getElementText(element) {
  if (!element) {
    return "";
  }

  if (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement) {
    return element.value || "";
  }

  return element.innerText || element.textContent || "";
}

function shouldSkipElement(element) {
  return Boolean(
    element.closest(
      'pre, code, svg, button, nav, header, aside, .code-block__code'
    )
  );
}

function applyDirectionToElement(element) {
  if (!element || shouldSkipElement(element)) {
    return;
  }

  const text = getElementText(element);

  element.classList.remove("claude-rtl-helper-text");

  if (hasHebrew(text)) {
    element.classList.add("claude-rtl-helper-text");
  }
}

function applyRtlToHebrewMessages() {
  const elements = document.querySelectorAll(MESSAGE_TEXT_SELECTORS.join(","));

  elements.forEach((element) => {
    applyDirectionToElement(element);
  });
}

let scheduled = false;

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

applyRtlToHebrewMessages();

const observer = new MutationObserver(() => {
  scheduleApplyRtl();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true
});
