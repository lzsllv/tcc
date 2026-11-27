const multer = require('multer');
const path = require('path');

const uploadDirectory = path.join(__dirname, '..', '..', 'public', 'imagens');

const storage = multer.diskStorage({
    destination: uploadDirectory,

    filename: (request, file, callback) => {
        const nomeArquivo = Date.now() + path.extname(file.originalname);
        callback(null, nomeArquivo);
    }
});

const upload = multer({ storage });

module.exports = upload;