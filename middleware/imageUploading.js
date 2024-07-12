 import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/customer/images'); // Set the destination folder where files will be stored
    },
    filename: (req, file, cb) => {
        // Generate a unique filename for each uploaded file
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
});

// Multer upload configuration
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB (optional)
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) { // Accept only image files
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
}).array('image', 5);

 export default upload;
 