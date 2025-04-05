# 视频压缩工具

一个基于浏览器的视频压缩工具，使用FFmpeg.wasm实现，无需安装任何软件即可在浏览器中压缩视频。

## 功能特点

- 支持拖拽上传视频文件
- 实时预览压缩效果
- 可调节压缩比例和质量
- 支持多种视频格式
- 无需安装任何软件
- 完全在浏览器中运行

## 使用方法

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
git clone https://github.com/你的用户名/video-compressor.git
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

## 许可证

MIT License

## 贡献指南

欢迎提交Issue和Pull Request！

## 联系方式

如有问题，请通过GitHub Issues联系。 