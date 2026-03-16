const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const SRC = path.join(ROOT, 'src')
const APP_CSS = path.join(SRC, 'App.css')
const STYLES = path.join(SRC, 'styles')

const content = fs.readFileSync(APP_CSS, 'utf8')
const lines = content.split('\n')

const ranges = [
  { name: 'global.css', start: 1, end: 99 },
  { name: 'cocktails.css', start: 100, end: 334 },
  { name: 'cocktails-carousel.css', start: 336, end: 653 },
  { name: 'header.css', start: 655, end: 1045 },
  { name: 'download-modal.css', start: 1046, end: 1147 },
  { name: 'menu.css', start: 1148, end: 1329 },
  { name: 'modal.css', start: 1330, end: 1440 },
  { name: 'footer.css', start: 1441, end: 1716 },
  { name: 'responsive.css', start: 1718, end: 2014 },
]

fs.mkdirSync(STYLES, { recursive: true })

for (const { name, start, end } of ranges) {
  const block = lines.slice(start - 1, end).join('\n')
  fs.writeFileSync(path.join(STYLES, name), block.trimEnd() + '\n', 'utf8')
  console.log('Written', name)
}

const imports = ranges.map((r) => `@import './styles/${r.name}';`).join('\n')
fs.writeFileSync(APP_CSS, imports + '\n', 'utf8')
console.log('App.css replaced with imports.')
