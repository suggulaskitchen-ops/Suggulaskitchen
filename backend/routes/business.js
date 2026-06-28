import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const router = express.Router()
const dataFile = path.join(__dirname, '../../data/database.json')

router.get('/', async (req, res) => {
  try {
    const file = await fs.readFile(dataFile, 'utf-8')
    const data = JSON.parse(file)
    res.json({
      ...data.businessInfo,
      socialLinks: data.socialLinks || []
    })
  } catch (error) {
    res.status(500).json({ error: 'Unable to load business information.' })
  }
})

router.put('/', async (req, res) => {
  try {
    const businessInfo = req.body
    if (!businessInfo || typeof businessInfo !== 'object') {
      return res.status(400).json({ error: 'Invalid business information payload.' })
    }

    const file = await fs.readFile(dataFile, 'utf-8')
    const data = JSON.parse(file)
    data.businessInfo = { ...data.businessInfo, ...businessInfo }
    if (Array.isArray(businessInfo.socialLinks)) {
      data.socialLinks = businessInfo.socialLinks
    }
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2), 'utf-8')
    res.json({
      ...data.businessInfo,
      socialLinks: data.socialLinks || []
    })
  } catch (error) {
    res.status(500).json({ error: 'Unable to save business information.' })
  }
})

export default router
