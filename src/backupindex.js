const express = require('express');
const { photoVerify, extractPassportInfo } = require('./verifyPhoto');
const fs = require('fs');
const app = express();
const port = 3000;

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

app.post('/api/v1/photoVerify', (req, res) => {
//   var liveImage1 = imageToBase64('/home/bikash/Downloads/liveImage1.jpeg');
//   var liveImage2 = imageToBase64('/home/bikash/Downloads/liveImage2.jpeg');
//   var idPhoto = imageToBase64('/home/bikash/Downloads/idImage.jpeg'); 
//photoVerify(req.body.liveImage1, req.body.liveImage2, req.body.idPhoto)
  photoVerify(req.body.liveImage1, req.body.liveImage2, req.body.idPhoto)
  .then((resp) => {
    res.status(200).send(resp);
  })
  .catch((err) => {
    res.status(400).send(err.message);
  });

//   photoVerify(liveImage1, liveImage2, idPhoto)
//     .then((resp) => {
//       res.status(200).send(resp);
//     })
//     .catch((err) => {
//       res.status(400).send(err.message);
//     });
});

app.post('/api/v1/extractPassportInfo', (req, res) => {
    var idPhoto = imageToBase64('/home/bikash/Downloads/idImage.jpg');
  extractPassportInfo(idPhoto)
    .then((resp) => {
      res.status(200).send(resp);
    })
    .catch((err) => {
      res.status(400).send(err.message);
    });
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
