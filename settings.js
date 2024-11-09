// 导出共享的默认设置
export const defaultSettings = {
    triggerWord: 'g',
    defaultPrompt: 'ask: ',
    url: 'https://chatgpt.com/?q={question}&hints=search',
    showContextMenu: true
};

// 重置设置
export async function resetOptions() {
    await chrome.storage.local.remove('gptSearchSettings');
    await chrome.storage.local.set({ 'gptSearchSettings': defaultSettings });
    return defaultSettings;
}

// 获取当前设置
export async function getCurrentSettings() {
    const result = await chrome.storage.local.get('gptSearchSettings');
    return result.gptSearchSettings || await resetOptions();
}

// 保存设置
export async function saveSettings(newSettings) {
    const settings = {
        ...defaultSettings,
        ...newSettings
    };
    await chrome.storage.local.set({ 'gptSearchSettings': settings });
    return settings;
}