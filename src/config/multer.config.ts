import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';   // npm install uuid   (if not installed)
export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      // Generate unique filename: 1234567890-abc123.jpg
      const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
      const ext = extname(file.originalname);
      callback(null, `${uniqueSuffix}${ext}`);
    },
  }),
  // Optional: Limit file size (e.g. 5MB)
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
};