
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Thư mục upload, cần tạo trước khi chạy code
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Định dạng tên file upload
    }
});

const upload = multer({storage: storage });

module.exports = upload;