# 分屏上下排列

[English](README.md) | 中文

分屏时始终上下排列终端和 sftp，而不是只在窗口较窄时才这样。

electerm wiki 页面
[Custom CSS examples](https://github.com/electerm/electerm/wiki/Custom-CSS-examples)
里的一个 CSS 补丁，打包成插件：装上、点 **Start widget**，补丁立刻生效，之后每次启动都在。

| | |
| --- | --- |
| 形态 | instance 插件，只有一个开关 |
| 需要 | 支持客户端 CSS 资源的 electerm 版本 |
| 应用内容 | `style.css`，逐字复制自 wiki |
| 单元测试 | `npm test`，零依赖，无需安装 |

## 安装

**设置 → 插件 → 导入**，粘贴：

```text
electerm/electerm-widget-split-view-stack
```

也可以用**导入文件夹**指向本地克隆。

## 使用

**设置 → 插件 → Stack Terminal Above SFTP** → **Start widget**。保留 *Apply on launch*，每次启动都会自动
重新应用；在 *Running instances* 里点 **Stop** 可以撤销。

## 它改了什么

把分隔条改成上下方向，两个面板固定各占一半，并隐藏拖拽手柄；两侧每一层容器都补上高度，让终端和文件列表真正填满各自那一半。

`style.css` 全文：

```css
/* 1. the splitter stacks instead of sitting side by side */
.term-sftp-box > .ant-splitter-horizontal {
  flex-direction: column !important;
}

/* 2. panels become full-width halves (their flex-basis is px, set by JS) */
.term-sftp-box > .ant-splitter-horizontal > .ant-splitter-panel {
  flex: 1 1 0 !important;
  width: 100% !important;
  max-width: 100% !important;
}

/* 3. the gutter becomes a 1px rule; dragging is meaningless once sizes are pinned */
.term-sftp-box > .ant-splitter-horizontal > .ant-splitter-bar {
  flex: none !important;
  width: 100% !important;
  height: 1px !important;
  background: var(--main-darker);
}
.term-sftp-box > .ant-splitter-horizontal > .ant-splitter-bar .ant-splitter-bar-dragger {
  display: none !important;
}

/* 4. terminal fills its pane instead of the px box JS computed for a side-by-side split */
.term-sftp-box > .ant-splitter-horizontal .terms-box,
.term-sftp-box > .ant-splitter-horizontal .term-wrap {
  width: 100% !important;
  height: 100% !important;
}

/* 5. same for the sftp pane - every wrapper in the chain must pass height down */
.term-sftp-box > .ant-splitter-horizontal .sftp-wrap,
.term-sftp-box > .ant-splitter-horizontal .sftp-section,
.term-sftp-box > .ant-splitter-horizontal .sftp-section > .ant-spin-nested-loading,
.term-sftp-box > .ant-splitter-horizontal .sftp-section > .ant-spin-nested-loading > .ant-spin-container {
  height: 100% !important;
}
.term-sftp-box > .ant-splitter-horizontal .sftp-panel {
  height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
}
.term-sftp-box > .ant-splitter-horizontal .sftp-panel > *:not(.file-list) {
  flex: none !important;
}
.term-sftp-box > .ant-splitter-horizontal .file-list {
  flex: 1 1 auto !important;
  min-height: 0 !important;
}
.term-sftp-box > .ant-splitter-horizontal .sftp-table {
  height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
}
.term-sftp-box > .ant-splitter-horizontal .sftp-table > *:not(.sftp-table-content) {
  flex: none !important;
}
.term-sftp-box > .ant-splitter-horizontal .sftp-table-content {
  flex: 1 1 auto !important;
  height: auto !important;
  min-height: 0 !important;
}
```

## 实现方式

清单中的 `electerm.assets.css` 列出 `style.css`。插件运行时，electerm 在每个窗口加载该样式表，停止时移除。

## 说明

- **独立于内置设置。** electerm 自己还有 **设置 → 通用 → 自定义 CSS**，由应用写入
  `<style id="custom-css">` 并跟随账号同步。这个插件不读也不写它。两者可以同时生效；内置设置
  的样式表在文档最后，所以同一条规则两处都写时内置设置赢。一条规则只放一处。
- **作用于整个窗口**，包括设置面板——把撤销按钮所在的面板藏起来的规则，会把自己一起藏起来。
  恢复办法：退出 electerm，删掉 `<data dir>/widgets/split-view-stack/`，自动运行项就没有东西可启动了。
- 分隔条被固定，不能再拖动——分屏方向是 JavaScript 决定的。
- 只在分屏打开时生效，用会话工具栏里的分屏图标切换。
- 应用时已经开着的会话，需要拖动一次窗口大小（或把分屏关掉再打开），让终端按新尺寸重新排版。

## License

MIT
