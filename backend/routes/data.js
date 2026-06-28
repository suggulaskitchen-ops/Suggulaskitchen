import express from 'express'
import { readDatabase, writeDatabase } from '../utils/db.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const data = await readDatabase()
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Unable to load application data.' })
  }
})

router.get('/counts', async (req, res) => {
  try {
    const data = await readDatabase()
    res.json({
      categories: data.categories.length,
      products: data.products.length,
      gallery: data.gallery.length,
      testimonials: data.testimonials.length,
      socialLinks: data.socialLinks.length
    })
  } catch (error) {
    res.status(500).json({ error: 'Unable to load counts.' })
  }
})

router.put('/', async (req, res) => {
  try {
    const incomingData = req.body
    if (!incomingData || typeof incomingData !== 'object') {
      return res.status(400).json({ error: 'Invalid payload.' })
    }
    await writeDatabase(incomingData)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Unable to save application data.' })
  }
})

export default router
