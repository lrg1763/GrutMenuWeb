/**
 * Flatten menu images: move all public/menu/<section>/<slug>/<file> to public/menu/<file>
 * and update menu.json to use /menu/<file>.
 * Run from project root: node scripts/flatten-menu-images.cjs
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const MENU_JSON = path.join(ROOT, 'public', 'menu.json')
const MENU_DIR = path.join(ROOT, 'public', 'menu')

const data = JSON.parse(fs.readFileSync(MENU_JSON, 'utf8'))

for (const dish of data.dishes) {
  const img = dish.image
  if (!img || !img.startsWith('/menu/') || img === '/menu/') continue

  const parts = img.split('/').filter(Boolean)  // ['menu', 'grill', 'porterhouse', 'porterhouse.webp']
  if (parts.length < 3) continue
  const filename = parts[parts.length - 1]
  const srcPath = path.join(MENU_DIR, parts.slice(1).join(path.sep))  // menu/grill/porterhouse/porterhouse.webp
  const destPath = path.join(MENU_DIR, filename)

  if (fs.existsSync(srcPath) && srcPath !== destPath) {
    fs.copyFileSync(srcPath, destPath)
  }
  dish.image = '/menu/' + filename
}

fs.writeFileSync(MENU_JSON, JSON.stringify(data, null, 2), 'utf8')
console.log('Updated menu.json with flat paths.')

// Remove all subdirectories and their contents
function rmDirRecursive(dir) {
  if (!fs.existsSync(dir)) return
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) rmDirRecursive(full)
    else fs.unlinkSync(full)
  }
  fs.rmdirSync(dir)
}

const entries = fs.readdirSync(MENU_DIR, { withFileTypes: true })
for (const e of entries) {
  if (e.isDirectory()) {
    rmDirRecursive(path.join(MENU_DIR, e.name))
    console.log('Removed dir', e.name)
  }
}
console.log('Done. All dish photos are now in public/menu/ (flat).')
