# Stack Terminal Above SFTP

English | [中文](README_CN.md)

Always stack the terminal above SFTP in split view, instead of only when the window is narrow.

One of the CSS patches from the electerm wiki page
[Custom CSS examples](https://github.com/electerm/electerm/wiki/Custom-CSS-examples),
packaged as a widget.

| | |
| --- | --- |
| Shape | instance widget, one switch |
| Needs | An electerm build with client CSS asset support |
| Applies | `style.css`, applied by electerm itself |
| Unit tests | `npm test` — no dependencies, no install |

## Install

**Settings → Widgets → Import**, then paste:

```text
electerm/electerm-widget-split-view-stack
```

Or **Import folder** against a local clone.

## Use

Electerm applies the style on install. Leave *Apply on launch* enabled to restore it on subsequent launches. To remove the style, press **Stop** in *Running instances*.

## What it changes

Turns the splitter vertical, pins both panes to 50/50 and hides the drag handle; every wrapper in both panes is given a height so the terminal and the file list fill their halves.

`style.css`, in full:

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

## How it works

The manifest lists `style.css` in `electerm.assets.css`. Electerm loads it in each window while the widget runs and removes it on **Stop**.

## Notes

- **Standalone, not the built-in setting.** electerm also has **Settings → Common
  → Custom CSS**, applied by the app into `<style id="custom-css">` and synced
  across devices. This widget does not read or write it. Both can be active; the
  setting's sheet is last in the document, so a rule in both places is won by the
  setting. Keep a rule in one place.
- **It applies to the whole window**, settings panel included — a rule that hides
  the panel you would use to undo it hides itself. Recovery: quit electerm and
  delete `<data dir>/widgets/split-view-stack/`; the auto-run entry then has nothing to
  start.
- The divider is pinned, so it is no longer draggable — the split direction is decided in JavaScript.
- Only applies while split view is on. Toggle it with the split view icon in the session toolbar.
- A session that was already open when you applied it needs one window resize (or a split-view off/on) so the terminal re-fits.

## License

MIT
