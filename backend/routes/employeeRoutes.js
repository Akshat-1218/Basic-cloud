const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const controller = require('../controllers/employeeController');

const uploadDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' +
      Math.round(Math.random() * 1E9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /\.(pdf|doc|docx|jpg|jpeg|png)$/i.test(file.originalname);

    if (allowed) cb(null, true);
    else cb(new Error('Only PDF, DOC, DOCX, JPG and PNG files are allowed'));
  }
});

router.get('/', controller.getEmployees);
router.get('/:id', controller.getEmployee);
router.post('/', controller.createEmployee);
router.put('/:id', controller.updateEmployee);
router.delete('/:id', controller.deleteEmployee);

router.post('/:id/upload', upload.single('document'), controller.uploadDocument);

module.exports = router;