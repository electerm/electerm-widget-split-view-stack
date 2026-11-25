/**
 * The manifest and the stylesheet, checked without an Electron runtime.
 *
 * Run: node --test test/*.test.js
 */

const test = require('node:test')
const assert = require('node:assert')
const fs = require('node:fs')
const path = require('node:path')

const ROOT = path.join(__dirname, '..')
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'))
const css = fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8').replace(/\r\n/g, '\n')

test('the id is what the widget folder is called', () => {
  assert.strictEqual(pkg.electerm.id, 'split-view-stack')
  assert.strictEqual(pkg.name, pkg.electerm.id)
  assert.match(pkg.electerm.id, /^[a-z0-9-]+$/)
})

test('it is an auto-runnable instance widget with one switch', () => {
  assert.strictEqual(pkg.electerm.type, 'instance')
  assert.strictEqual(pkg.electerm.singleInstance, true)
  assert.strictEqual(pkg.electerm.autoRun, true)
  assert.deepStrictEqual(pkg.electerm.configs.map(c => c.name), ['autoRun'])
  assert.strictEqual(pkg.electerm.configs[0].default, true)
})

test('the stylesheet is the wiki text, not a paraphrase', () => {
  assert.strictEqual(css.trim(), "/* 1. the splitter stacks instead of sitting side by side */\n.term-sftp-box > .ant-splitter-horizontal {\n  flex-direction: column !important;\n}\n\n/* 2. panels become full-width halves (their flex-basis is px, set by JS) */\n.term-sftp-box > .ant-splitter-horizontal > .ant-splitter-panel {\n  flex: 1 1 0 !important;\n  width: 100% !important;\n  max-width: 100% !important;\n}\n\n/* 3. the gutter becomes a 1px rule; dragging is meaningless once sizes are pinned */\n.term-sftp-box > .ant-splitter-horizontal > .ant-splitter-bar {\n  flex: none !important;\n  width: 100% !important;\n  height: 1px !important;\n  background: var(--main-darker);\n}\n.term-sftp-box > .ant-splitter-horizontal > .ant-splitter-bar .ant-splitter-bar-dragger {\n  display: none !important;\n}\n\n/* 4. terminal fills its pane instead of the px box JS computed for a side-by-side split */\n.term-sftp-box > .ant-splitter-horizontal .terms-box,\n.term-sftp-box > .ant-splitter-horizontal .term-wrap {\n  width: 100% !important;\n  height: 100% !important;\n}\n\n/* 5. same for the sftp pane - every wrapper in the chain must pass height down */\n.term-sftp-box > .ant-splitter-horizontal .sftp-wrap,\n.term-sftp-box > .ant-splitter-horizontal .sftp-section,\n.term-sftp-box > .ant-splitter-horizontal .sftp-section > .ant-spin-nested-loading,\n.term-sftp-box > .ant-splitter-horizontal .sftp-section > .ant-spin-nested-loading > .ant-spin-container {\n  height: 100% !important;\n}\n.term-sftp-box > .ant-splitter-horizontal .sftp-panel {\n  height: 100% !important;\n  display: flex !important;\n  flex-direction: column !important;\n}\n.term-sftp-box > .ant-splitter-horizontal .sftp-panel > *:not(.file-list) {\n  flex: none !important;\n}\n.term-sftp-box > .ant-splitter-horizontal .file-list {\n  flex: 1 1 auto !important;\n  min-height: 0 !important;\n}\n.term-sftp-box > .ant-splitter-horizontal .sftp-table {\n  height: 100% !important;\n  display: flex !important;\n  flex-direction: column !important;\n}\n.term-sftp-box > .ant-splitter-horizontal .sftp-table > *:not(.sftp-table-content) {\n  flex: none !important;\n}\n.term-sftp-box > .ant-splitter-horizontal .sftp-table-content {\n  flex: 1 1 auto !important;\n  height: auto !important;\n  min-height: 0 !important;\n}")
})

test('it is a manifest-only widget: no server script at all', () => {
  assert.strictEqual(pkg.main, undefined)
  assert.deepStrictEqual(pkg.electerm.assets.css, ['style.css'])
  assert.strictEqual(fs.existsSync(path.join(ROOT, 'main.js')), false)
})
