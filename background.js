import { getCurrentSettings } from './settings.js';

let searchSettings = null;

// 初始化
async function initSettings() {
    searchSettings = await getCurrentSettings();
    updateContextMenu();
}

// 初始化调用
initSettings();

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

// 处理右键菜单点击
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "gptSearch") {
        openSearch(info.selectionText);
    }
});

// 监听快捷键命令
chrome.commands.onCommand.addListener(async (command) => {
    if (command === "trigger-search") {
        try {
            // 首先获取当前活动标签页
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            // 然后在该标签页执行脚本
            const [selection] = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => window.getSelection().toString()
            });
            
            if (selection && selection.result) {
                openSearch(selection.result);
            }
        } catch (error) {
            console.error('获取选中文本时出错:', error);
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
