const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, 'public/imagens');
    },

    filename: (request, file, callback) => {
        const nomeArquivo = Date.now() + path.extname(file.originalname);
        callback(null, nomeArquivo);
    }
});

const upload = multer({ storage });

module.exports = upload;