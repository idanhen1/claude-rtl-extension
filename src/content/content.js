function applyRtlToHebrewMessages() {
  const elements = document.querySelectorAll("p, span, div, textarea");

  elements.forEach((element) => {
    const text = element.innerText || element.value || "";

    if (/[\u0590-\u05FF]/.test(text)) {
      element.classList.add("claude-rtl-helper");
    }
  });
}

applyRtlToHebrewMessages();

const observer = new MutationObserver(() => {
  applyRtlToHebrewMessages();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
