import express from 'express'
import { readDatabase, writeDatabase } from '../utils/db.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const data = await readDatabase()
    res.json(data.gallery || [])
  } catch (error) {
    res.status(500).json({ error: 'Unable to load gallery items.' })
  }
})

router.post('/', async (req, res) => {
  try {
    const item = req.body
    if (!item || !item.imageUrl) {
      return res.status(400).json({ error: 'Image URL is required.' })
    }

    const data = await readDatabase()
    const newItem = {
      id: item.id || `gallery-${Date.now()}`,
      title: item.title || '',
      imageUrl: item.imageUrl,
      description: item.description || '',
      status: item.status || 'active'
    }
    data.gallery = [newItem, ...(data.gallery || [])]
    await writeDatabase(data)
    res.status(201).json(newItem)
  } catch (error) {
    res.status(500).json({ error: 'Unable to create gallery item.' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const item = req.body
    const { id } = req.params
    const data = await readDatabase()
    const gallery = data.gallery || []
    const existingIndex = gallery.findIndex((entry) => entry.id === id)
    if (existingIndex === -1) {
      return res.status(404).json({ error: 'Gallery item not found.' })
    }
    gallery[existingIndex] = {
      ...gallery[existingIndex],
      ...item,
      id
    }
    data.gallery = gallery
    await writeDatabase(data)
    res.json(gallery[existingIndex])
  } catch (error) {
    res.status(500).json({ error: 'Unable to update gallery item.' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const data = await readDatabase()
    const gallery = data.gallery || []
    const updated = gallery.filter((item) => item.id !== id)
    if (updated.length === gallery.length) {
      return res.status(404).json({ error: 'Gallery item not found.' })
    }
    data.gallery = updated
    await writeDatabase(data)
    res.status(204).end()
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete gallery item.' })
  }
})

export default router
