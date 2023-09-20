const multer = require('multer')
const path = require("path");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, './uploads/'));
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname+'-'+Date.now()+file.originalname.match(/\..*$/)[0]);
    }
})

const acceptedMIMETypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "image/png",
    "image/jpg",
    "image/jpeg"
];

const multi_upload = multer({
    storage,
    limits: { fileSize: 100*1024*1024 },
    fileFilter: (req, file, cb) => {
        if (acceptedMIMETypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error("Solo formatos .pdf, .docx, .doc e imagen")
            err.name = "ExtensionError"
            return cb(err);
        }
    }
}).single('uploadedFiles');


module.exports = { multerMiddleware: multi_upload }