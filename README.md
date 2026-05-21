# Claude RTL Extension

A lightweight Chrome extension for Claude that applies RTL direction to Hebrew messages while keeping English text and code blocks unchanged.

## What it does

- Detects Hebrew text inside Claude messages
- Applies RTL only to message text that contains Hebrew
- Keeps English messages unchanged
- Keeps code blocks LTR
- Does not move message bubbles
- Does not change Claude page layout

## Local installation

1. Open Chrome
2. Go to chrome://extensions
3. Enable Developer mode
4. Click Load unpacked
5. Select this project folder
6. Open https://claude.ai

## Development

After changing files, reload the extension in chrome://extensions and refresh Claude.
