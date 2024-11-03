// 默认设置
const defaultSettings = {
    triggerWord: 'g',
    defaultPrompt: 'ask: ',
    url: 'https://chatgpt.com/?q={question}&hints=search',
    showContextMenu: true
};

// 保存设置
function saveOptions() {
    const defaultPrompt = document.getElementById('defaultPrompt').value;
    const url = document.getElementById('url').value;

    // 直接从存储获取当前设置，更新后保存
    chrome.storage.sync.get('searchSettings', (result) => {
        const currentSettings = result.searchSettings || {...defaultSettings};
        const newSettings = {
            ...currentSettings,
            defaultPrompt: defaultPrompt || defaultSettings.defaultPrompt,
            url: url || defaultSettings.url
        };

        // 保存新设置到存储
        chrome.storage.sync.set({
            searchSettings: newSettings
        }, () => {
            // 通知 background.js
            chrome.runtime.sendMessage({ 
                type: 'settingsUpdated', 
                settings: newSettings 
            });
            
            const status = document.getElementById('status');
            status.style.display = 'block';
            setTimeout(() => {
                status.style.display = 'none';
            }, 2000);
        });
    });
}

// 重置设置
function resetOptions() {
    // 重置为默认设置
    currentSettings = {...defaultSettings};
    
    chrome.storage.sync.set({
        searchSettings: currentSettings
    }, () => {
        // 发送消息通知 background.js 更新设置
        chrome.runtime.sendMessage({ type: 'settingsUpdated', settings: currentSettings });
        
        restoreOptions();
        const status = document.getElementById('status');
        status.textContent = '设置已重置';
        status.style.display = 'block';
        setTimeout(() => {
            status.style.display = 'none';
            status.textContent = '设置已保存';
        }, 2000);
    });
}

// 恢复设置
function restoreOptions() {
    chrome.storage.sync.get('searchSettings', (result) => {
        currentSettings = result.searchSettings || {...defaultSettings};
        document.getElementById('defaultPrompt').value = currentSettings.defaultPrompt;
        document.getElementById('url').value = currentSettings.url;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('reset').addEventListener('click', resetOptions); 
