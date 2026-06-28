import express from 'express'
import path from 'path'
import fs from 'fs'
import multer from 'multer'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadDir = path.join(__dirname, '../uploads')

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir)
  },
  filename(req, file, cb) {
    const timestamp = Date.now()
    const safeName = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '')
    cb(null, `${timestamp}-${safeName}`)
  }
})

const upload = multer({ storage })
const router = express.Router()

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded.' })
  }

  const protocol = req.protocol
  const host = req.get('host')
  const url = `${protocol}://${host}/uploads/${req.file.filename}`

  res.json({ url })
})

export default router
