import { defineEventHandler } from 'h3'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { join } from 'path'
import formidable from 'formidable'

const uploadFile = async (event) => {
  const form = formidable({
    uploadDir: join(process.cwd(), 'public/uploads'),
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024
  })

  const uploadDir = join(process.cwd(), 'public/uploads')

  return new Promise((resolve, reject) => {
    // В Nuxt 3 нужно получить raw request
    const req = event.node.req

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return reject(err)
      }

      const file = files.image?.[0] // formidable v3+ возвращает массив

      if (!file) {
        return reject(new Error('No file uploaded'))
      }

      if (!file.mimetype?.startsWith('image/')) {
        return reject(new Error('Invalid file type. Only images are allowed.'))
      }

      const fileName = `${Date.now()}-${file.originalFilename}`
      const filePath = join(process.cwd(), 'public/uploads', fileName)

      try {
        await mkdir(uploadDir, { recursive: true })
        await writeFile(filePath, await readFile(file.filepath))
        resolve({ url: `/uploads/${fileName}` })
      } catch (error) {
        reject(error)
      }
    })
  })
}

export default defineEventHandler(async (event) => {
  try {
    const result = await uploadFile(event)
    return result
  } catch (error) {
    console.error('Upload error:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to upload file'
    })
  }
}) 