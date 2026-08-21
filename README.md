# PhotoPainter 产品展示官网

一个无构建依赖的中文静态产品官网，重点展示 PhotoPainter 产品体验、实际运行界面、软件输出示例与生活方式概念场景。

## 本地预览

```bash
python3 -m http.server 8080
```

然后访问 `http://localhost:8080/`。

## 文件结构

- `index.html` — 页面内容与语义结构
- `styles.css` / `scenes.css` — 响应式视觉系统与场景、功能画廊
- `app.js` — 移动菜单、场景画廊、作品画廊、功能画廊、FAQ 与视频交互
- `assets/lifestyle/` — 内容、完整产品外观与使用环境合成在同一张图中的生活方式概念图
- `assets/scenarios/` / `assets/scenarios-v2/` — PhotoPainter 实际运行软件生成的输入图、软件输出和便签界面渲染稿

## 素材边界

- 生活方式场景图是产品形态与使用环境的概念展示，并非实体产品实拍。
- 实际运行界面截图和操作录屏来自已运行版本，演示数据已脱敏。
- 作品画廊会明确区分输入图像与软件生成效果；软件输出不是实体屏拍摄。
- 页面不收集邮箱、付款信息或其他个人数据。

## 浏览器支持

面向现代 Chrome、Edge、Firefox 与 Safari。布局针对 390、900、1440 像素宽度优化，并支持 `prefers-reduced-motion`。
