import express from 'express'
import { readDatabase, writeDatabase } from '../utils/db.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const data = await readDatabase()
    res.json(data.products || [])
  } catch (error) {
    res.status(500).json({ error: 'Unable to load products.' })
  }
})

router.post('/', async (req, res) => {
  try {
    const product = req.body
    if (!product || !product.name) {
      return res.status(400).json({ error: 'Product name is required.' })
    }

    const data = await readDatabase()
    const newProduct = {
      id: product.id || `prod-${Date.now()}`,
      name: product.name,
      category: product.category || '',
      shortDescription: product.shortDescription || '',
      price: product.price || 0,
      offerPrice: product.offerPrice || 0,
      availability: product.availability || 'available',
      featured: product.featured || false,
      bestSeller: product.bestSeller || false,
      newArrival: product.newArrival || false,
      veg: product.veg ?? true,
      preparationTime: product.preparationTime || 0,
      ingredients: product.ingredients || '',
      spiceLevel: product.spiceLevel || '',
      imageUrl: product.imageUrl || '',
      galleryImages: product.galleryImages || [],
      seoTitle: product.seoTitle || '',
      seoDescription: product.seoDescription || '',
      slug: product.slug || '',
      displayOrder: product.displayOrder || 0
    }
    data.products = [newProduct, ...(data.products || [])]
    await writeDatabase(data)
    res.status(201).json(newProduct)
  } catch (error) {
    res.status(500).json({ error: 'Unable to create product.' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const product = req.body
    const { id } = req.params
    const data = await readDatabase()
    const products = data.products || []
    const existingIndex = products.findIndex((item) => item.id === id)
    if (existingIndex === -1) {
      return res.status(404).json({ error: 'Product not found.' })
    }
    products[existingIndex] = {
      ...products[existingIndex],
      ...product,
      id
    }
    data.products = products
    await writeDatabase(data)
    res.json(products[existingIndex])
  } catch (error) {
    res.status(500).json({ error: 'Unable to update product.' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const data = await readDatabase()
    const products = data.products || []
    const updated = products.filter((item) => item.id !== id)
    if (updated.length === products.length) {
      return res.status(404).json({ error: 'Product not found.' })
    }
    data.products = updated
    await writeDatabase(data)
    res.status(204).end()
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete product.' })
  }
})

export default router
