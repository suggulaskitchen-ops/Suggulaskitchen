import express from 'express'
import { readDatabase, writeDatabase } from '../utils/db.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const data = await readDatabase()
    res.json(data.testimonials || [])
  } catch (error) {
    res.status(500).json({ error: 'Unable to load testimonials.' })
  }
})

router.post('/', async (req, res) => {
  try {
    const item = req.body
    if (!item || !item.customerName) {
      return res.status(400).json({ error: 'Customer name is required.' })
    }

    const data = await readDatabase()
    const newItem = {
      id: item.id || `testimonial-${Date.now()}`,
      customerName: item.customerName,
      location: item.location || '',
      rating: item.rating || 5,
      review: item.review || '',
      imageUrl: item.imageUrl || '',
      displayOrder: item.displayOrder || 0
    }
    data.testimonials = [newItem, ...(data.testimonials || [])]
    await writeDatabase(data)
    res.status(201).json(newItem)
  } catch (error) {
    res.status(500).json({ error: 'Unable to create testimonial.' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const item = req.body
    const { id } = req.params
    const data = await readDatabase()
    const testimonials = data.testimonials || []
    const existingIndex = testimonials.findIndex((entry) => entry.id === id)
    if (existingIndex === -1) {
      return res.status(404).json({ error: 'Testimonial not found.' })
    }
    testimonials[existingIndex] = {
      ...testimonials[existingIndex],
      ...item,
      id
    }
    data.testimonials = testimonials
    await writeDatabase(data)
    res.json(testimonials[existingIndex])
  } catch (error) {
    res.status(500).json({ error: 'Unable to update testimonial.' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const data = await readDatabase()
    const testimonials = data.testimonials || []
    const updated = testimonials.filter((item) => item.id !== id)
    if (updated.length === testimonials.length) {
      return res.status(404).json({ error: 'Testimonial not found.' })
    }
    data.testimonials = updated
    await writeDatabase(data)
    res.status(204).end()
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete testimonial.' })
  }
})

export default router
