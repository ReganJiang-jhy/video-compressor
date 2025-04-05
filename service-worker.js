// 视频压缩工具 - 跨域隔离Service Worker
// 版本：1.0.0

// 服务工作者安装时的事件处理
self.addEventListener('install', (event) => {
  // 立即激活，不等待旧的service worker终止
  self.skipWaiting();
  console.log('视频压缩工具 Service Worker 已安装');
});

// 服务工作者激活时的事件处理
self.addEventListener('activate', (event) => {
  // 立即接管页面
  event.waitUntil(clients.claim());
  console.log('视频压缩工具 Service Worker 已激活');
});

// 拦截请求，添加必要的跨域隔离头信息
self.addEventListener('fetch', (event) => {
  // 创建一个修改过的响应
  const modifyResponse = (response) => {
    // 如果无法修改响应，直接返回原始响应
    if (!response || !response.headers) {
      return response;
    }

    // 克隆响应以便修改头信息
    const newHeaders = new Headers(response.headers);
    
    // 添加跨域隔离所需的头信息
    newHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');
    newHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp');

    // 创建新的响应对象
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  };

  // 处理请求并修改响应
  event.respondWith(
    fetch(event.request)
      .then(modifyResponse)
      .catch((error) => {
        console.error('请求失败:', error);
        // 如果请求失败，返回一个错误响应
        return new Response('请求失败，请检查网络连接', {
          status: 500,
          headers: {
            'Content-Type': 'text/plain',
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Cross-Origin-Embedder-Policy': 'require-corp'
          }
        });
      })
  );
}); 