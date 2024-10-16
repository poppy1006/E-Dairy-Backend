import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const imagesDir = path.join(__dirname, "../../../public/images");
    // Ensure the directory exists
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    cb(null, imagesDir);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 50000000 }, //50 MB
});

export default upload;
