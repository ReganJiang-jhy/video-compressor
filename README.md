# 视频压缩工具

一个基于浏览器的视频压缩工具，使用FFmpeg.wasm实现，无需安装任何软件即可在浏览器中压缩视频。

## 在线演示

👉 [在线体验](https://reganjiang-jhy.github.io/video-compressor/)

**注意**：在线演示版本仅提供界面预览，完整功能需要下载到本地运行。这是因为视频压缩功能需要特定的HTTP头部支持，而GitHub Pages不支持自定义HTTP头。

## 功能特点

- 支持拖拽上传视频文件
- 实时预览压缩效果
- 可调节压缩比例和质量
- 支持多种视频格式
- 无需安装任何软件
- 完全在浏览器中运行

## 使用方法

### 本地使用（推荐）

1. [下载项目源码](https://github.com/ReganJiang-jhy/video-compressor/archive/refs/heads/main.zip)
2. 解压文件到本地文件夹
3. 双击运行`启动工具.bat`文件
4. 在自动打开的浏览器中使用工具

### 压缩视频步骤

1. 点击"选择文件"或拖拽视频文件到上传区域
2. 调整压缩比例（建议30%-70%）
3. 选择压缩质量（低/中/高）
4. 点击"开始压缩"按钮
5. 等待压缩完成
6. 预览压缩效果并下载

## 技术栈

- HTML5
- CSS3
- JavaScript
- FFmpeg.wasm
- Node.js (本地服务器)

## 安装说明

1. 克隆仓库：
```bash
git clone https://github.com/ReganJiang-jhy/video-compressor.git
```

2. 安装依赖：
```bash
npm install
```

3. 启动服务器：
```bash
npm start
```

4. 在浏览器中访问：
```
http://localhost:3000
```

## 注意事项

- 压缩大文件时可能需要较长时间
- 建议使用Chrome或Firefox浏览器
- 压缩比例过低可能导致视频质量严重下降
- 压缩比例过高可能导致文件变大
- 压缩比例建议设置在30%-70%之间，这样既能减小文件体积，又能保持合理画质

## 为什么需要本地服务器？

视频压缩功能依赖于现代浏览器的SharedArrayBuffer功能，而这个功能出于安全考虑，需要特定的HTTP头部支持：

- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

本地服务器自动配置了这些必要的HTTP头部。

## 许可证

MIT License

## 贡献指南

欢迎提交Issue和Pull Request！

## 联系方式

如有问题，请通过[GitHub Issues](https://github.com/ReganJiang-jhy/video-compressor/issues)联系。 