# 动效风格图鉴

[打开在线图鉴](https://xnrakuan1996.github.io/motion-style-atlas/)

用同一个五秒「令人向往的农场」片头比较画面语言。打开任意卡片可以播放、拖动时间轴、切换风格或复制中文制作话术。下载仓库后双击「风格图鉴.html」也可以离线使用。

## 持续补充

- 自己收藏参考图时用网页的「补充风格」。这些草稿保存在当前浏览器，通过页底 JSON 导入导出迁移。浏览器里的编辑不会提交到 GitHub。
- 给公共图鉴添加可播放条目，在「扩展风格.js」的 extraStyles 增加唯一 id、中文名称、描述、用途、情绪、辨识信号、参考来源及 paint 函数。绘图坐标 720 × 405，时间 0–5 秒。按时间直接计算每帧以支持拖动。封面取该动画 3.7 秒处，话术、搜索与分类由目录自动生成。
- 在本地打开网页，测试封面、播放、暂停、拖动、前后切换和手机布局。将改动提交到 main 后，GitHub Pages 从根目录发布。在线页面和本地文件分别保留自己的浏览器收藏。

## 授权与出处

本图鉴自有源码以 [MIT](LICENSE) 开放。原始 43 款的目录、风格说明和 24 张样图来自 [ConardLi/garden-skills](https://github.com/ConardLi/garden-skills/tree/f2d7adeaf53dcce3d0eb19cbffe8c04f4c636c2a)，附有[上游 MIT 许可](样图/LICENSE)。

首批扩展是本仓库独立绘制的示例，采用下列公开项目介绍的视觉手法，未打包它们的代码、字体、图案或示例图。

| 图鉴条目 | 手法参考 |
| --- | --- |
| 等高线地貌 | [d3-contour](https://github.com/d3/d3-contour) 的等值线表达 |
| 田野翻页书 | [StPageFlip](https://github.com/Nodlik/StPageFlip) 的书脊翻页与纸面遮挡 |
| 亚麻十字绣 | [Embroiderly](https://github.com/embroidery-space/embroiderly) 的方格与十字针图案 |
