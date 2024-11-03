let searchSettings = null;

// 初始化
chrome.runtime.onInstalled.addListener(() => {
    loadSettings();
});

// 加载设置
async function loadSettings() {
    const result = await chrome.storage.sync.get('searchSettings');
    if (!result.searchSettings) {
        // 如果没有保存的设置，创建默认设置
        const defaultSettings = {
            triggerWord: 'g',
            defaultPrompt: 'ask: ',
            url: 'https://chatgpt.com/?q={question}&hints=search',
            showContextMenu: true
        };
        await chrome.storage.sync.set({ searchSettings: defaultSettings });
        searchSettings = defaultSettings;
    } else {
        searchSettings = result.searchSettings;
    }
    updateContextMenu();
}

// 更新右键菜单
function updateContextMenu() {
    chrome.contextMenus.removeAll(() => {
        if (searchSettings && searchSettings.showContextMenu) {
            chrome.contextMenus.create({
                id: "gptSearch",
                title: "使用GPT搜索",
                contexts: ["selection"]
            });
        }
    });
}
// 监听设置更新
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'settingsUpdated') {
        // 直接使用从 options 传来的设置
        searchSettings = message.settings;
        updateContextMenu();
    }
    return true; // 保持消息通道开放
});

// 处理右键菜单点击
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "gptSearch") {
        openSearch(info.selectionText);
    }
});

// 监听快捷键
chrome.commands.onCommand.addListener(async (command) => {
    if (command === "trigger-search") {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.url) {
            const url = new URL(tab.url);
            const searchText = url.searchParams.get('q') || tab.title;
            if (searchText) {
                openSearch(searchText);
            }
        }
    }
});

// 监听 omnibox 输入
chrome.omnibox.onInputEntered.addListener((text) => {
    if (text.trim()) {
        openSearch(text);
    }
});

// 打开搜索
function openSearch(query) {
    const fullQuery = `${searchSettings.defaultPrompt} ${query}`;
    const url = searchSettings.url.replace('{question}', encodeURIComponent(fullQuery));
    chrome.tabs.create({ url });
} 
