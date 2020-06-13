const multer = require('multer');
const fs = require('fs');
const DIR = './images/products/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${DIR}`);
    },
    filename: (req, file, cb) => {
        console.log('DIR + file');
        console.log('./' + DIR + file.originalname);
        fs.exists(`${DIR}${file.originalname}`, (exists) => {
            if (exists) {
                return cb(new Error('Image already exists'));
            } else {
                const fileName = file.originalname.toLowerCase().split(' ').join('-');
                cb(null, fileName);
            }
        });
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

module.exports = {
    upload
}