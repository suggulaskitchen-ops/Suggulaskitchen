import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import businessRoute from './routes/business.js'
import dataRoute from './routes/data.js'
import categoriesRoute from './routes/categories.js'
import productsRoute from './routes/products.js'
import galleryRoute from './routes/gallery.js'
import testimonialsRoute from './routes/testimonials.js'
import uploadsRoute from './routes/uploads.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' })
})

app.use('/api/business', businessRoute)
app.use('/api/data', dataRoute)
app.use('/api/categories', categoriesRoute)
app.use('/api/products', productsRoute)
app.use('/api/gallery', galleryRoute)
app.use('/api/testimonials', testimonialsRoute)
app.use('/api/uploads', uploadsRoute)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' })
})

app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`)
})
