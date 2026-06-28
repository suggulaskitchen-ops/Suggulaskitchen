import fs from 'fs'
import path from 'path'

const dist = path.resolve('dist')
const index = path.join(dist, 'index.html')
const notFound = path.join(dist, '404.html')
const noJekyll = path.join(dist, '.nojekyll')

fs.copyFileSync(index, notFound)
fs.writeFileSync(noJekyll, '')
console.log('Copied index.html to dist/404.html and created dist/.nojekyll for GitHub Pages SPA fallback.')
