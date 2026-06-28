import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const databasePath = path.join(__dirname, '../../data/database.json')

export async function readDatabase() {
  const fileContents = await fs.readFile(databasePath, 'utf-8')
  return JSON.parse(fileContents)
}

export async function writeDatabase(data) {
  await fs.writeFile(databasePath, JSON.stringify(data, null, 2), 'utf-8')
}
