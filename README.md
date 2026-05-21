# RTL Helper for Claude

A lightweight Chrome extension that improves right-to-left text direction in Claude while keeping English text and code blocks unchanged.

## What it does

- Detects RTL text inside Claude messages
- Applies RTL direction only to message text that contains RTL characters
- Keeps English messages unchanged
- Keeps code blocks LTR
- Does not move message bubbles
- Does not change Claude page layout
- Includes an enable/disable toggle from the extension popup
- Applies cleaner typography while the extension is enabled

## Language support

The extension detects common right-to-left scripts, including Hebrew, Arabic, Persian/Farsi, Urdu, Syriac, Thaana, NKo, Samaritan, Mandaic, Adlam, and additional RTL Unicode ranges.

## Supported site

https://claude.ai/

## Local installation

1. Open Chrome.
2. Go to chrome://extensions.
3. Enable Developer mode.
4. Click Load unpacked.
5. Select this project folder.
6. Open or refresh https://claude.ai/.

## Development

After changing files:

1. Go to chrome://extensions.
2. Click the reload icon on the extension card.
3. Refresh Claude with Ctrl + R.

## Extension icons

The extension uses generated PNG icons from:

assets/icons/logo-source.png

Generated Chrome icon sizes:

assets/icons/icon16.png
assets/icons/icon32.png
assets/icons/icon48.png
assets/icons/icon128.png

These icons are referenced from manifest.json for both the extension listing and the Chrome toolbar action.

## Notes

This extension intentionally changes only text direction, alignment, and typography while enabled.

It should not change the position of messages, bubbles, page layout, or Claude UI containers.

Code blocks are always kept LTR.

This is an independent helper extension and is not affiliated with Anthropic or Claude.
