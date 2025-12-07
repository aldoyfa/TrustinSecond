import multer from 'multer';
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `product-${Date.now()}${ext}`; 
    cb(null, filename);
  }
})

//hany filter file .png dan .jpg
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Hanya file .png, .jpg and .jpeg yang diperbolehkan!'), false);
};

export const upload = multer({ storage: storage, fileFilter  })