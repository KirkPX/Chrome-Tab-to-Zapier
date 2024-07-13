## Introduction

Chrome Tab to Zapier is a Chrome extension that allows you to quickly capture the current tab's URL, title, and description, send it to a Zapier webhook, and then close the tab. This extension is perfect for saving interesting web pages for later review or processing.

## Installation

To install the extension in developer mode:

1. Download the extension files and place them in a directory on your computer.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable "Developer mode" by toggling the switch in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.
5. The extension should now appear in your Chrome toolbar.

## Zapier Setup

To use this extension, you need to set up a Zapier webhook:

1. Log in to your Zapier account (or create one if you don't have it).
2. Create a new Zap.
3. Choose "Webhooks by Zapier" as your trigger app.
4. Select "Catch Hook" as the trigger event.
5. Zapier will provide you with a custom webhook URL. Copy this URL.
6. Click on the extension icon in Chrome to open the popup.
7. Paste the webhook URL into the "Zapier Webhook URL" field and click "Save".
8. (Optional) Enter a label in the "Label" field to categorize your captures.

In your Zap, you can now set up actions to process the received data. The extension sends the following fields:

- url: The webpage URL
- title: The page title or user-provided title
- description: The page meta description or extracted content
- userEmail: The email of the logged-in Chrome user
- label: The label set in the extension settings

## Usage

The extension provides two main functions:

1. **Capture URL and close tab**
    - Default shortcut: Cmd+Shift+S on Mac, Ctrl+Shift+S on Windows/Linux
    - This captures the current tab's information and sends it to Zapier, then closes the tab.
2. **Capture URL with custom title and close tab**
    - Default shortcut: Cmd+Shift+A on Mac, Ctrl+Shift+A on Windows/Linux
    - This prompts you to enter a custom title before capturing the tab's information.

You can also click the extension icon to trigger the default capture function.

## Customizing Shortcuts

To customize the keyboard shortcuts:

1. Navigate to `chrome://extensions/shortcuts` in Chrome.
2. Find "URL Grabber and Tab Closer" in the list.
3. Click on the pencil icon next to each shortcut to modify it.
4. Enter your preferred key combination.
5. Click outside the input box to save the new shortcut.

## Troubleshooting

- If the extension isn't working, check that you've entered a valid Zapier webhook URL in the settings.
- Ensure you're signed into Chrome if you want to capture your user email.
- Check the console in Chrome's DevTools for any error messages if the extension isn't behaving as expected.

## Security Considerations

- The extension stores your Zapier webhook URL in Chrome's sync storage. While this is generally secure, be cautious when using shared computers.
- The extension requires certain permissions to function. Review these in the manifest.json file if you have concerns.
- Always be cautious when capturing sensitive information from web pages.

## Support

There really isn’t any. Would love your feedback, though!
