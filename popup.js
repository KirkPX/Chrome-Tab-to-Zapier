document.addEventListener('DOMContentLoaded', () => {
  const webhookUrlInput = document.getElementById('webhookUrl');
  const labelInput = document.getElementById('label');
  const saveButton = document.getElementById('save');
  const saveConfirmation = document.getElementById('saveConfirmation');
  const shortcutsButton = document.getElementById('customizeShortcuts');

  chrome.storage.sync.get(['zapierWebhookUrl', 'zapierLabel'], (data) => {
    if (data.zapierWebhookUrl) {
      webhookUrlInput.value = data.zapierWebhookUrl;
    }
    if (data.zapierLabel) {
      labelInput.value = data.zapierLabel;
    }
  });

  saveButton.addEventListener('click', () => {
    const webhookUrl = webhookUrlInput.value.trim();
    const label = labelInput.value.trim();
    if (webhookUrl) {
      chrome.storage.sync.set({ 
        zapierWebhookUrl: webhookUrl,
        zapierLabel: label
      }, () => {
        console.log('Settings saved');
        saveConfirmation.style.display = 'block';
        setTimeout(() => {
          saveConfirmation.style.display = 'none';
        }, 3000); // Hide the confirmation message after 3 seconds
      });
    } else {
      alert('Please enter a valid webhook URL');
    }
  });

  shortcutsButton.addEventListener('click', () => {
    chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
  });
});