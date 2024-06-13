const express = require('express');
const multer = require('multer');
const { photoVerify, extractPassportInfo } = require('./verifyPhoto');
const fs = require('fs');
const app = express();
const port = 3000;

// Configure Multer for file uploads
const upload = multer({ dest: 'Uploadimages/' });

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

const imageToBase64 = (imagePath) => {
    try {
        // Read image file
        const imageBuffer = fs.readFileSync(imagePath);
        // Convert image to Base64
        return imageBuffer.toString('base64');
    } catch (error) {
        throw new Error(`Error converting image ${imagePath} to Base64: ${error.message}`);
    }
};

app.post('/api/v1/photoVerify', upload.fields([{ name: 'liveImage1' }, { name: 'liveImage2' }, { name: 'idPhoto' }]), (req, res) => {
    try {
        const liveImage1 = "data:image/jpeg;base64,"+imageToBase64(req.files['liveImage1'][0].path);
        const liveImage2 = "data:image/jpeg;base64,"+imageToBase64(req.files['liveImage2'][0].path);
        const idPhoto = "data:image/jpeg;base64,"+imageToBase64(req.files['idPhoto'][0].path);

        photoVerify(liveImage1, liveImage2, idPhoto)
            .then((resp) => {
                res.status(200).send(resp);
            })
            .catch((err) => {
                res.status(400).send(err.message);
            });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/api/v1/extractPassportInfo', upload.single('idPhoto'), (req, res) => {
    try {
        const idPhoto = imageToBase64(req.file.path);

        extractPassportInfo(idPhoto)
            .then((resp) => {
                res.status(200).send(resp);
            })
            .catch((err) => {
                res.status(400).send(err.message);
            });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

const server = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use`);
    } else {
        console.error(err);
    }
});
