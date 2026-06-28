import express from 'express'
import { readDatabase, writeDatabase } from '../utils/db.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const data = await readDatabase()
    res.json(data.categories || [])
  } catch (error) {
    res.status(500).json({ error: 'Unable to load categories.' })
  }
})

router.post('/', async (req, res) => {
  try {
    const category = req.body
    if (!category || !category.name) {
      return res.status(400).json({ error: 'Category name is required.' })
    }

    const data = await readDatabase()
    const newCategory = {
      id: category.id || `cat-${Date.now()}`,
      name: category.name,
      imageUrl: category.imageUrl || '',
      description: category.description || '',
      priceRange: category.priceRange || '',
      status: category.status || 'active',
      featured: category.featured || false
    }
    data.categories = [newCategory, ...(data.categories || [])]
    await writeDatabase(data)
    res.status(201).json(newCategory)
  } catch (error) {
    res.status(500).json({ error: 'Unable to create category.' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const category = req.body
    const { id } = req.params
    const data = await readDatabase()
    const categories = data.categories || []
    const existingIndex = categories.findIndex((item) => item.id === id)
    if (existingIndex === -1) {
      return res.status(404).json({ error: 'Category not found.' })
    }
    categories[existingIndex] = {
      ...categories[existingIndex],
      ...category,
      id
    }
    data.categories = categories
    await writeDatabase(data)
    res.json(categories[existingIndex])
  } catch (error) {
    res.status(500).json({ error: 'Unable to update category.' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const data = await readDatabase()
    const categories = data.categories || []
    const updated = categories.filter((item) => item.id !== id)
    if (updated.length === categories.length) {
      return res.status(404).json({ error: 'Category not found.' })
    }
    data.categories = updated
    await writeDatabase(data)
    res.status(204).end()
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete category.' })
  }
})

export default router
