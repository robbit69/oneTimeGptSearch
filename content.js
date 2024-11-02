// 监听来自后台脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getOmniboxText") {
    // 获取地址栏内容
    const omniboxText = document.querySelector('input[type="text"]')?.value || '';
    sendResponse({ text: omniboxText });
  }
  return true;
}); 