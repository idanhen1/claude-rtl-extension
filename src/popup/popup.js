const STORAGE_KEY = "claudeRtlEnabled";

const toggle = document.getElementById("rtlToggle");
const statusText = document.getElementById("statusText");
const statusDot = document.getElementById("statusDot");

function updateStatus(isEnabled) {
  statusText.textContent = isEnabled
    ? "RTL Helper is active on Claude"
    : "RTL Helper is disabled";

  statusDot.classList.toggle("off", !isEnabled);
}

chrome.storage.sync.get({ [STORAGE_KEY]: true }, (result) => {
  const isEnabled = Boolean(result[STORAGE_KEY]);
  toggle.checked = isEnabled;
  updateStatus(isEnabled);
});

toggle.addEventListener("change", () => {
  const isEnabled = toggle.checked;

  chrome.storage.sync.set({ [STORAGE_KEY]: isEnabled }, () => {
    updateStatus(isEnabled);
  });
});
