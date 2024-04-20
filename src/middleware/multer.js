import multer from "multer";
import path from "path";
import { v4 as uuidV4 } from "uuid";

const tempDir = path.join(process.cwd(), "temp");
const storeImageDir = path.join(process.cwd(), "public/avatars");

const extensionWhiteList = [".jpg", ".jpeg", ".png", ".bmp", ".gif"];
const mimetypeWhiteList = [
  "imagee/jpg",
  "image/jpeg",
  "image/png",
  "image/bmp",
  "image/gif",
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidV4()}.${file.originalname}`);
  },
});

// Inicjalizacja multer
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLocaleLowerCase();
    const mimetype = file.mimetype;

    if (
      !extensionWhiteList.includes(extension) ||
      !mimetypeWhiteList.includes(mimetype)
    ) {
      return cb(null, false);
    }

    return cb(null, true);
  },
  limits: { fileSize: 1024 * 1024 * 5 }, //5 mb
});

const isAccessible = async (path) => {
  try {
    await fs.access(path);
    return true;
  } catch (error) {
    return false;
  }
};

const setupFolder = async (path) => {
  const folderExist = isAccessible(path);

  if (!folderExist) {
    try {
      await fs.mkdir(path);
    } catch (error) {
      console.log(
        "Access denied or error occurred while creating folder:",
        error
      );
      process.exit(1);
    }
  }
};

export { upload, setupFolder, tempDir, storeImageDir };
