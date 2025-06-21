import express from "express";
import path from "path";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "backend/upload/");
  },

  filename: (req, file, cb) => {
    const extensionName = path.extname(file.originalname);

    cb(null, `${file.fieldname}-${Date.now()}${extensionName}`);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png||image\/webp/;

  const extensionName = path.extname(file.originalname);
  const mimetype = file.mimetype;

  if (filetypes.test(extensionName) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Images only"), false);
  }
};

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

router.post("/", (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      res.status(400).send({ message: err.message });
    } else if (req.file) {
      res.status(200).send({
        message: "Image uploaded successfully",
        image: `${req.file.path}`,
      });
    } else {
      res.status(400).send({ message: "No image file provided" });
    }
  });
});
export default router;

/*

 multer.diskStorage()
This creates a storage engine for multer — telling it where to save uploaded files and what to name them


*cb(error, value)
it’s a function multer provides to your destination and filename functions.

You use cb to:

Pass an error if something goes wrong → cb(new Error("msg"))

Or proceed successfully:

cb(null, value)
➝ null means no error
➝ value is either the destination path or the new filename.

*/
