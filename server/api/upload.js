import { createRouter } from 'h3';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';
import formidable from 'formidable';

const router = createRouter();

const uploadFile = async (req) => {
  const form = formidable({
    uploadDir: join(process.cwd(), 'public/uploads'),
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024
  });

  const uploadDir = join(process.cwd(), 'public/uploads');

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return reject(err);
      }

      const file = files.image;

      if (!file) {
        return reject(new Error('No file uploaded'));
      }

      if (!file.mimetype.startsWith('image/')) {
        return reject(new Error('Invalid file type. Only images are allowed.'));
      }

      const fileName = `${Date.now()}-${file.originalFilename}`;
      const filePath = join(process.cwd(), 'public/uploads', fileName);

      try {
        await mkdir(uploadDir, { recursive: true });
        await writeFile(filePath, await readFile(file.filepath));
        resolve({ url: `/uploads/${fileName}` });
      } catch (error) {
        reject(error);
      }
    });
  });
};

router.post('/api/upload', async (req, res) => {
  try {
    const result = await uploadFile(req);
    res.statusCode = 200;
    return res.end(JSON.stringify(result));
  } catch (error) {
    console.error('Upload error:', error);
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'Failed to upload file' }));
  }
});

export default router; 