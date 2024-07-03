const multer = require('multer');
const sanitize = require('sanitize-filename');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './files/');
  },
  filename(req, file, cb) {
    const sanitizedName = sanitize(file.originalname);
    const fileName = sanitize(new Date().toISOString() + sanitizedName);
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter,
});

module.exports = upload;
