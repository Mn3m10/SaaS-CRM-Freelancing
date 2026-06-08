import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const storage = multer.diskStorage({
  destination: (req , file , cb) => {
    cb(null , path.join(__dirname , "../images"));
  },
  filename: (req , file , cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null , uniqueName);
  }
})

const fileFilter = (req , file ,cb) => {
  if(file.mimetype.startsWith("image")) {
    cb(null , true);
  } else {
    cb(new Error("Only Images Are Allowed"));
  }
}

const upload = multer({
  storage,
  fileFilter
});

export default upload;