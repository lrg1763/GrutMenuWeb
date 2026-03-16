/**
 * Organize menu images: one folder public/menu/ with subfolders by section (grill, garniry, ...).
 * Moves public/menu/<file> to public/menu/<sectionId>/<file> and updates menu.json.
 * Run from project root: node scripts/menu-by-sections.cjs
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const MENU_JSON = path.join(ROOT, 'public', 'menu.json')
const MENU_DIR = path.join(ROOT, 'public', 'menu')

const data = JSON.parse(fs.readFileSync(MENU_JSON, 'utf8'))

for (const dish of data.dishes) {
  const img = dish.image
  if (!img || !img.startsWith('/menu/')) continue

  const filename = path.basename(img)
  const sectionId = dish.sectionId
  const srcPath = path.join(MENU_DIR, filename)
  const destDir = path.join(MENU_DIR, sectionId)
  const destPath = path.join(destDir, filename)

  if (!fs.existsSync(srcPath)) continue

  fs.mkdirSync(destDir, { recursive: true })
  fs.copyFileSync(srcPath, destPath)
  dish.image = '/menu/' + sectionId + '/' + filename
}

fs.writeFileSync(MENU_JSON, JSON.stringify(data, null, 2), 'utf8')
console.log('Updated menu.json with section paths.')

// Remove files left in menu root
const entries = fs.readdirSync(MENU_DIR, { withFileTypes: true })
for (const e of entries) {
  if (e.isFile()) {
    fs.unlinkSync(path.join(MENU_DIR, e.name))
    console.log('Removed', e.name, 'from menu root')
  }
}
console.log('Done. Photos are in public/menu/<section>/')