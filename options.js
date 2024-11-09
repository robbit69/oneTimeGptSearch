import { defaultSettings, saveSettings, getCurrentSettings, resetOptions } from './settings.js';

// 保存设置
async function saveOptions() {
    const defaultPrompt = document.getElementById('defaultPrompt').value;
    const url = document.getElementById('url').value;

    const newSettings = await saveSettings({
        defaultPrompt: defaultPrompt || defaultSettings.defaultPrompt,
        url: url || defaultSettings.url
    });
            
    const status = document.getElementById('status');
    status.style.display = 'block';
    setTimeout(() => {
        status.style.display = 'none';
    }, 2000);
}

// 恢复设置
async function restoreOptions() {
    const currentSettings = await getCurrentSettings();
    
    document.getElementById('defaultPrompt').value = currentSettings.defaultPrompt;
    document.getElementById('url').value = currentSettings.url;
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('reset').addEventListener('click', resetOptions);
