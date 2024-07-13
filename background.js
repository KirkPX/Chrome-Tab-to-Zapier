chrome.commands.onCommand.addListener((command) => {
    if (command === "trigger-zap") {
        triggerZapAndCloseTab();
    } else if (command === "trigger-zap-with-title") {
        promptForTitleAndTriggerZap();
    }
});

chrome.action.onClicked.addListener((tab) => {
    triggerZapAndCloseTab();
});

function promptForTitleAndTriggerZap() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) {
            showNotification('Error', 'No active tab found');
            return;
        }

        const currentTab = tabs[0];
        chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            func: () => prompt("Enter a title (or leave blank for page title):")
        }).then((results) => {
            if (chrome.runtime.lastError) {
                showNotification('Error', 'Failed to prompt for title');
                return;
            }
            const userTitle = results[0].result;
            triggerZapAndCloseTab(userTitle);
        }).catch(err => {
            showNotification('Error', 'Failed to prompt for title');
        });
    });
}

function triggerZapAndCloseTab(userTitle = null) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) {
            showNotification('Error', 'No active tab found');
            return;
        }

        const currentTab = tabs[0];

        const tabInfo = {
            url: currentTab.url,
            title: userTitle || currentTab.title
        };

        chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            func: getPageDescription
        }).then((results) => {
            if (chrome.runtime.lastError) {
                showNotification('Error', 'Failed to get page description');
                return;
            }

            tabInfo.description = results[0].result;

            chrome.identity.getProfileUserInfo((userInfo) => {
                tabInfo.userEmail = userInfo.email || 'Not available';

                chrome.storage.sync.get('zapierLabel', (data) => {
                    tabInfo.label = data.zapierLabel || '';

                    sendToZapier(tabInfo, currentTab.id);
                });
            });
        }).catch(err => {
            showNotification('Error', 'Failed to collect page information');
        });
    });
}

function getPageDescription() {
    function getMetaContent(selectors) {
        for (let selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                return element.content || element.textContent;
            }
        }
        return null;
    }

    const metaSelectors = [
        'meta[name="description"]',
        'meta[property="og:description"]',
        'meta[name="twitter:description"]',
        'meta[itemprop="description"]',
        'meta[property="description"]',
        '[data-testid="post-content"]',
        '.post-content',
        'article p:first-of-type',
    ];

    let description = getMetaContent(metaSelectors);

    if (!description) {
        const contentSelectors = [
            '.entry-content p:first-of-type',
            '#content p:first-of-type',
            'article p:first-of-type',
            '.post-content p:first-of-type',
            'body p:first-of-type'
        ];

        for (let selector of contentSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                description = element.textContent.trim().substring(0, 200) + '...';
                break;
            }
        }
    }

    return description || 'No description available';
}

function sendToZapier(info, tabId) {
    chrome.storage.sync.get('zapierWebhookUrl', (data) => {
        const webhookUrl = data.zapierWebhookUrl;
        if (!webhookUrl) {
            showNotification('Error', 'Zapier webhook URL not set');
            chrome.runtime.openOptionsPage();
            return;
        }

        fetch(webhookUrl, {
            method: 'POST',
            body: JSON.stringify(info),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            try {
                const jsonData = JSON.parse(data);
            } catch (e) {
                // Response is not JSON, use raw data
            }
            showNotification('Success', 'Page info sent to Zapier');
            chrome.tabs.remove(tabId, () => {
                if (chrome.runtime.lastError) {
                    showNotification('Error', 'Failed to close the tab');
                }
            });
        })
        .catch(error => {
            showNotification('Error', 'Failed to send page info to Zapier');
        });
    });
}

function showNotification(title, message) {
    chrome.notifications.create({
        type: 'basic',
        title: title,
        message: message,
        iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=='
    });
}
