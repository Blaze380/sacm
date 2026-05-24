import fs from 'fs'
import path from 'path'

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (entry.name.endsWith('.ts')) fixFile(full)
  }
}

function fixFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const next = content.replace(/from "([^"]+)\.ts"/g, 'from "$1"')
  if (next !== content) fs.writeFileSync(filePath, next)
}

walk(new URL('../src/gen', import.meta.url).pathname)
