import { createRouter } from 'h3';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import formidable from 'formidable';

const router = createRouter();

router.post('/api/upload', async (req, res) => {
  const form = formidable({
    uploadDir: join(process.cwd(), 'public/uploads'),
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024 // 5MB
  });

  try {
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const file = files.image;
    const fileName = `${Date.now()}-${file.originalFilename}`;
    const filePath = join(process.cwd(), 'public/uploads', fileName);

    await writeFile(filePath, await readFile(file.filepath));

    return {
      url: `/uploads/${fileName}`
    };
  } catch (error) {
    console.error('Upload error:', error);
    res.statusCode = 500;
    return {
      error: 'Failed to upload file'
    };
  }
});

export default router; 