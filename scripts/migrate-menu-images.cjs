/**
 * Migrates menu images from flat public/menu/ to public/menu/<sectionId>/<slug>/.
 * Updates public/menu.json with new image paths.
 * Run from project root: node scripts/migrate-menu-images.cjs
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const MENU_JSON = path.join(ROOT, 'public', 'menu.json')
const MENU_DIR = path.join(ROOT, 'public', 'menu')

function main() {
  const data = JSON.parse(fs.readFileSync(MENU_JSON, 'utf8'))
  const dishes = data.dishes

  for (const dish of dishes) {
    const img = dish.image
    if (!img || !img.startsWith('/menu/')) continue

    const sectionId = dish.sectionId
    const filename = path.basename(img)
    const slug = path.basename(filename, path.extname(filename))
    const newPath = `/menu/${sectionId}/${slug}/${filename}`

    const srcFile = path.join(MENU_DIR, filename)
    const destDir = path.join(MENU_DIR, sectionId, slug)
    const destFile = path.join(destDir, filename)

    if (!fs.existsSync(srcFile)) {
      console.warn('Skip (source missing):', srcFile)
      continue
    }

    fs.mkdirSync(destDir, { recursive: true })
    fs.copyFileSync(srcFile, destFile)
    dish.image = newPath
  }

  fs.writeFileSync(MENU_JSON, JSON.stringify(data, null, 2), 'utf8')
  console.log('Updated menu.json with new image paths.')
}

main()
