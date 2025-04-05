/**
 * 视频压缩工具 - 简易HTTP服务器
 * 设置了正确的COOP/COEP头以支持SharedArrayBuffer
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// 配置端口
const PORT = 8080;

// 简单的MIME类型映射
const mimeTypes = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

// 创建HTTP服务器
const server = http.createServer(function(req, res) {
  console.log(new Date().toISOString() + " - " + req.method + " " + req.url);
  
  // 设置跨域隔离所需的HTTP头
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  
  // 处理URL路径
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }
  
  // 获取文件扩展名
  const extname = path.extname(filePath);
  let contentType = mimeTypes[extname] || 'application/octet-stream';
  
  // 读取文件
  fs.readFile(filePath, function(err, content) {
    if (err) {
      if (err.code === 'ENOENT') {
        // 文件不存在
        console.log("文件不存在: " + filePath);
        
        // 检查是否存在404页面
        fs.readFile('./404.html', function(err, content) {
          if (err) {
            // 没有404页面，返回简单的404文本
            res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
            res.end('404 - 页面不存在');
          } else {
            // 返回自定义404页面
            res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
            res.end(content, 'utf-8');
          }
        });
      } else {
        // 服务器错误
        console.error("服务器错误: " + err.code);
        res.writeHead(500, { 'Content-Type': 'text/html; charset=UTF-8' });
        res.end("服务器错误: " + err.code);
      }
    } else {
      // 成功响应
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// 启动服务器
server.listen(PORT, '127.0.0.1', function() {
  console.log("\n==============================================");
  console.log("    视频压缩工具服务器已启动!");
  console.log("    已设置跨域隔离支持 (COOP & COEP)");
  console.log("    服务器地址: http://localhost:" + PORT);
  console.log("    SharedArrayBuffer 可以正常工作");
  console.log("    请保持此窗口开启");
  console.log("==============================================");
});

// 处理服务器错误
server.on('error', function(e) {
  if (e.code === 'EADDRINUSE') {
    console.error("错误: 端口 " + PORT + " 已被占用，请尝试修改PORT值");
  } else {
    console.error("服务器错误: " + e.message);
  }
});

// 处理程序终止信号
process.on('SIGINT', function() {
  console.log('\n正在关闭服务器...');
  server.close(function() {
    console.log('服务器已关闭');
    process.exit(0);
  });
}); 