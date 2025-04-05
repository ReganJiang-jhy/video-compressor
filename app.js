/**
 * 视频压缩工具 - 主要JavaScript文件
 * 实现视频上传、压缩、预览和下载功能
 */

// 在文件开头添加GitHub Pages环境检测
document.addEventListener('DOMContentLoaded', function() {
    // 检测是否在GitHub Pages环境中运行
    const isGitHubPages = window.location.hostname.includes('github.io');
    
    // 如果在GitHub Pages环境中运行，显示警告
    if (isGitHubPages) {
        const notice = document.getElementById('github-notice');
        if (notice) {
            notice.style.display = 'block';
        }
        
        // 禁用一些功能按钮，添加提示
        const compressBtn = document.getElementById('compress-btn');
        if (compressBtn) {
            compressBtn.addEventListener('click', function(e) {
                e.preventDefault();
                alert('在GitHub Pages环境中，压缩功能无法正常工作。\n请下载项目到本地运行以使用完整功能。');
            });
        }
    }
    
    // 检查浏览器是否支持SharedArrayBuffer
    const hasSharedArrayBuffer = typeof SharedArrayBuffer !== 'undefined';
    
    if (!hasSharedArrayBuffer) {
        console.warn('您的浏览器不支持SharedArrayBuffer，视频压缩功能可能无法正常工作。');
        // 可以在这里添加用户界面提示
    }
});

// 获取DOM元素
const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');
const compressionSettings = document.getElementById('compression-settings');
const uploadSection = document.getElementById('upload-area');
const videoPreview = document.getElementById('video-preview');
const originalVideo = document.getElementById('original-video');
const compressedVideo = document.getElementById('compressed-video');
const originalFilename = document.getElementById('original-filename');
const originalSize = document.getElementById('original-size');
const compressedSize = document.getElementById('compressed-size');
const compressionRate = document.getElementById('compression-rate');
const downloadBtn = document.getElementById('download-btn');
const compressionRatio = document.getElementById('compression-ratio');
const ratioValue = document.getElementById('ratio-value');
const qualityPreset = document.getElementById('quality-preset');
const startCompression = document.getElementById('start-compression');
const loadingOverlay = document.getElementById('loading-overlay');
const progressText = document.getElementById('progress-text');
const ffmpegError = document.getElementById('ffmpeg-error');

// 全局变量
let originalVideoFile = null;
let compressedVideoBlob = null;
let ffmpeg = null;
let ffmpegLoaded = false;
let fileInputHandled = false; // 用于防止重复处理文件选择

// 初始化页面
window.onload = function() {
    console.log('页面加载完成...');
    
    // 隐藏加载提示
    loadingOverlay.style.display = 'none';
    
    // 设置事件监听器
    setupEventListeners();
    
    // 显示上传区域
    uploadSection.style.display = 'block';
    
    // 检查FFmpeg是否已加载
    initFFmpeg();
};

// 显示FFmpeg加载错误提示
function showFFmpegError() {
    ffmpegError.style.display = 'flex';
}

// 初始化FFmpeg
async function initFFmpeg() {
    // 显示正在加载提示
    loadingOverlay.style.display = 'flex';
    const loadingText = document.getElementById('loading-text');
    if (loadingText) {
        loadingText.textContent = '正在加载处理引擎...';
    }
    progressText.textContent = '请稍候...';
    
    try {
        console.log('开始初始化FFmpeg...');
        
        // 检查FFmpeg是否可用
        if (typeof FFmpeg === 'undefined') {
            throw new Error('FFmpeg.wasm 库未正确加载，请检查网络连接并刷新页面');
        }

        // 创建FFmpeg实例
        ffmpeg = FFmpeg.createFFmpeg({
            log: true,
            corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
            progress: ({ ratio }) => {
                // 更新进度条
                if (ratio && ratio <= 1) {
                    let percent = Math.round(ratio * 100);
                    progressText.textContent = `${percent}%`;
                }
            }
        });

        // 加载FFmpeg
        console.log('加载FFmpeg中...');
        await ffmpeg.load();
        console.log('FFmpeg加载完成！可以使用视频压缩功能');
        ffmpegLoaded = true;
        
        // 隐藏加载提示
        loadingOverlay.style.display = 'none';
        
    } catch (error) {
        console.error('FFmpeg初始化失败:', error);
        loadingOverlay.style.display = 'none';
        showFFmpegError();
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 设置拖放区域的事件监听
    setupDropArea();
    
    // 设置文件输入的事件监听
    let fileInputTriggered = false;
    fileInput.addEventListener('click', function(e) {
        if (fileInputTriggered) {
            e.preventDefault();
            return false;
        }
        fileInputTriggered = true;
        setTimeout(() => {
            fileInputTriggered = false;
        }, 1000);
    });
    
    fileInput.addEventListener('change', function(e) {
        if (!fileInputHandled && e.target.files.length > 0) {
            fileInputHandled = true;
            
            handleFileSelect(e);
            
            setTimeout(() => {
                fileInputHandled = false;
            }, 200);
        }
    });
    
    // 压缩比例滑块事件
    compressionRatio.addEventListener('input', () => {
        ratioValue.textContent = `${compressionRatio.value}%`;
    });
    
    // 开始压缩按钮事件
    startCompression.addEventListener('click', compressVideo);
    
    // 下载按钮事件
    downloadBtn.addEventListener('click', downloadCompressedVideo);
}

// 设置拖放区域
function setupDropArea() {
    // 防止浏览器默认拖放行为
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    // 高亮拖放区域
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    // 处理拖放文件
    dropArea.addEventListener('drop', handleDrop, false);
    
    // 点击上传区域触发文件选择
    dropArea.addEventListener('click', () => {
        fileInput.click();
    });
}

// 阻止默认行为
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// 高亮拖放区域
function highlight() {
    dropArea.classList.add('active');
}

// 取消高亮拖放区域
function unhighlight() {
    dropArea.classList.remove('active');
}

// 处理拖放文件
function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length) {
        if (fileInputHandled) return;
        fileInputHandled = true;
        
        handleFiles(files);
        
        setTimeout(() => {
            fileInputHandled = false;
        }, 200);
    }
}

// 处理文件选择
function handleFileSelect(e) {
    const files = e.target.files;
    
    if (files.length) {
        handleFiles(files);
    }
}

// 处理选择的文件
function handleFiles(files) {
    const file = files[0];
    
    // 检查是否为视频文件
    if (!file.type.startsWith('video/')) {
        alert('请上传视频文件！');
        return;
    }
    
    // 保存原始视频文件
    originalVideoFile = file;
    
    // 显示原始视频预览
    displayOriginalVideo(file);
    
    // 显示压缩设置区域
    compressionSettings.style.display = 'block';
    
    // 重置压缩后的视频预览
    compressedVideo.src = '';
    compressedSize.textContent = '-';
    compressionRate.textContent = '-';
    downloadBtn.disabled = true;
    
    // 确保视频预览区域不可见
    videoPreview.style.display = 'none';
}

// 显示原始视频预览
function displayOriginalVideo(file) {
    // 创建视频URL并设置到video元素
    const videoURL = URL.createObjectURL(file);
    originalVideo.src = videoURL;
    
    // 显示文件名和大小
    originalFilename.textContent = file.name;
    originalSize.textContent = formatFileSize(file.size);
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 压缩视频
async function compressVideo() {
    if (!originalVideoFile) {
        alert('请先上传视频文件！');
        return;
    }
    
    if (!ffmpegLoaded) {
        loadingOverlay.style.display = 'none';
        alert('视频处理引擎尚未加载完成，请稍候再试或刷新页面');
        return;
    }
    
    try {
        // 显示加载中提示
        loadingOverlay.style.display = 'flex';
        const loadingText = document.getElementById('loading-text');
        if (loadingText) {
            loadingText.textContent = '视频压缩中，请稍候...';
        }
        progressText.textContent = '0%';
        
        // 读取文件数据
        const data = await readFileAsArrayBuffer(originalVideoFile);
        
        // 将视频文件写入FFmpeg文件系统
        const inputFileName = 'input.' + originalVideoFile.name.split('.').pop();
        const outputFileName = 'output.mp4';
        
        ffmpeg.FS('writeFile', inputFileName, new Uint8Array(data));
        
        // 获取压缩质量设置
        const quality = qualityPreset.value;
        const outputQuality = getQualitySettings(quality);
        
        // 获取压缩比率
        const ratio = compressionRatio.value / 100;
        
        // 构建FFmpeg命令
        const args = [
            '-i', inputFileName,
            '-c:v', 'libx264',
            '-crf', outputQuality.crf.toString(),
            '-preset', outputQuality.preset,
            '-c:a', 'aac',
            '-b:a', '128k',
            '-movflags', '+faststart',
            '-vf', `scale=iw*${ratio}:ih*${ratio}`,
            outputFileName
        ];
        
        // 运行FFmpeg命令
        await ffmpeg.run(...args);
        
        // 读取输出文件
        const output = ffmpeg.FS('readFile', outputFileName);
        
        // 创建输出视频Blob
        const blob = new Blob([output.buffer], { type: 'video/mp4' });
        
        // 显示压缩后的视频
        displayCompressedVideo(blob);
        
        // 清理FFmpeg文件系统
        ffmpeg.FS('unlink', inputFileName);
        ffmpeg.FS('unlink', outputFileName);
        
        // 隐藏加载提示
        loadingOverlay.style.display = 'none';
        
        // 显示视频预览区域
        videoPreview.style.display = 'block';
        
    } catch (error) {
        console.error('视频压缩失败:', error);
        loadingOverlay.style.display = 'none';
        alert('视频压缩失败: ' + error.message);
    }
}

// 获取压缩质量设置
function getQualitySettings(quality) {
    switch (quality) {
        case 'low':
            return { crf: 28, preset: 'ultrafast' };
        case 'medium':
            return { crf: 23, preset: 'medium' };
        case 'high':
            return { crf: 18, preset: 'slow' };
        default:
            return { crf: 23, preset: 'medium' };
    }
}

// 读取文件为ArrayBuffer
function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('文件读取失败'));
        reader.readAsArrayBuffer(file);
    });
}

// 显示压缩后的视频
function displayCompressedVideo(blob) {
    // 保存压缩后的视频Blob
    compressedVideoBlob = blob;
    
    // 创建视频URL并设置到video元素
    const videoURL = URL.createObjectURL(blob);
    compressedVideo.src = videoURL;
    
    // 显示压缩后的文件大小
    compressedSize.textContent = formatFileSize(blob.size);
    
    // 计算压缩率
    const originalBytes = originalVideoFile.size;
    const compressedBytes = blob.size;
    const compressionPercentage = ((originalBytes - compressedBytes) / originalBytes * 100).toFixed(2);
    compressionRate.textContent = compressionPercentage + '%';
    
    // 启用下载按钮
    downloadBtn.disabled = false;
}

// 下载压缩后的视频
function downloadCompressedVideo() {
    if (!compressedVideoBlob) {
        alert('没有可下载的压缩视频！');
        return;
    }
    
    // 创建下载链接
    const url = URL.createObjectURL(compressedVideoBlob);
    
    // 创建a标签并设置下载属性
    const a = document.createElement('a');
    a.href = url;
    a.download = '压缩_' + originalVideoFile.name;
    
    // 触发点击事件
    document.body.appendChild(a);
    a.click();
    
    // 清理
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
} 