const express = require("express");
const multer = require("multer");
const { photoVerify, extractPassportInfo } = require("./verifyPhoto");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const { generateKycPdf } = require("./utils/pdfUtill");
const kyc_upload_config = require("./utils/multerConfig");
const { addDefaultValues } = require("./utils/default");
const app = express();
const port = 3000;

// Configure Multer for file uploads
const upload = multer({ dest: "Uploadimages/" });

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(kyc_upload_config.any());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const imageToBase64 = (imagePath) => {
  try {
    // Read image file
    const imageBuffer = fs.readFileSync(imagePath);
    // Convert image to Base64
    return imageBuffer.toString("base64");
  } catch (error) {
    throw new Error(
      `Error converting image ${imagePath} to Base64: ${error.message}`
    );
  }
};

app.post(
  "/api/v1/photoVerify",
  upload.fields([
    { name: "liveImage1" },
    { name: "liveImage2" },
    { name: "idPhoto" },
  ]),
  (req, res) => {
    try {
      const liveImage1 =
        "data:image/jpeg;base64," +
        imageToBase64(req.files["liveImage1"][0].path);
      const liveImage2 =
        "data:image/jpeg;base64," +
        imageToBase64(req.files["liveImage2"][0].path);
      const idPhoto =
        "data:image/jpeg;base64," + imageToBase64(req.files["idPhoto"][0].path);
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
  }
);

app.post(
  "/api/v1/extractPassportInfo",
  upload.single("idPhoto"),
  (req, res) => {
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
  }
);

/**
 * generate pdf using kyc information
 */

app.post("/api/v1/generateKycPdf", (req, res) => {
  const data = {};
  const signImagePath = req.files[0].filename;
  const filePath = path.resolve(__dirname, "../kycupload/" + signImagePath);

  const base64SignImage = "data:image/jpeg;base64," + imageToBase64(filePath);

  data.kyc_title = req.body.title;
  data.kyc_first_name = req.body.firstName;
  data.kyc_middle_name = req.body.middleName;
  data.kyc_last_name = req.body.lastName;
  data.kyc_gender = req.body.gender;
  data.kyc_dob = req.body.dob;
  data.kyc_religion = req.body.religion;
  data.kyc_nationality = req.body.nationality;
  data.kyc_country = req.body.country;
  data.kyc_mobile = req.body.mobile;
  data.kyc_email = req.body.email;
  data.kyc_address = req.body.address;
  data.kyc_passportNo = req.body.passportNo;
  data.kyc_passport_issue_date = req.body.passport_issue_date;
  data.kyc_passport_exp_date = req.body.passport_exp_date;
  data.kyc_country_of_issue = req.body.country_of_issue;
  data.kyc_maretial_status = req.body.maretial_status;
  data.kyc_spouce_name = req.body.spouce_name;
  data.kyc_spouce_nationality = req.body.spouce_nationality;
  data.kyc_spouce_dob = req.body.spouce_dob;
  data.kyc_mother_full_name = req.body.mother_full_name;
  data.kyc_mother_nationality = req.body.mother_nationality;
  data.kyc_father_full_name = req.body.father_full_name;
  data.kyc_father_nationality = req.body.father_nationality;
  data.kyc_father_residence_status = req.body.father_residence_status;
  data.kyc_emirates_number = req.body.emirates_number;
  data.kyc_emirates_issue_date = req.body.emirates_issue_date;
  data.kyc_emirates_exp_date = req.body.kyc_emirates_exp_date;
  data.kyc_sign_image = base64SignImage;
  data.DO_YOU_CURRENTLY_HOLD_ANY_PUBLIC_POSITION =
    req.body.DO_YOU_CURRENTLY_HOLD_ANY_PUBLIC_POSITION;
  data.DO_YOU_HAVE_OR_HAVE_YOU_EVER_HAD_ANY_DIPLOMATIC_IMMUNITY =
    req.body.DO_YOU_HAVE_OR_HAVE_YOU_EVER_HAD_ANY_DIPLOMATIC_IMMUNITY;
  data.DO_YOU_HAVE_A_CLOSE_ASSOCIATE_WHO_HAS_HELD_PUBLIC_POSITION_IN_THE_LAST_12_MONTHS =
    req.body.DO_YOU_HAVE_A_CLOSE_ASSOCIATE_WHO_HAS_HELD_PUBLIC_POSITION_IN_THE_LAST_12_MONTHS;
  data.DID_YOU_HOLD_ANY_PUBLIC_POSITION_IN_THE_LAST_12_MONTHS =
    req.body.DID_YOU_HOLD_ANY_PUBLIC_POSITION_IN_THE_LAST_12_MONTHS;
  data.HAVE_YOU_EVER_HELD_ANY_PUBLIC_POSITION =
    req.body.HAVE_YOU_EVER_HELD_ANY_PUBLIC_POSITION;
  data.DO_YOU_HAVE_A_RELATIVE_WHO_HAS_HELD_PUBLIC_POSITION_IN_THE_LAST_12_MONTHS =
    req.body.DO_YOU_HAVE_A_RELATIVE_WHO_HAS_HELD_PUBLIC_POSITION_IN_THE_LAST_12_MONTHS;
  data.HAS_THERE_BEEN_A_CONVICTION_AGAINST_YOU_BY_A_COURT_OF_LAW =
    req.body.HAS_THERE_BEEN_A_CONVICTION_AGAINST_YOU_BY_A_COURT_OF_LAW;
  data.IF_YOU_HAVE_ANSWERED_YES_TO_ANY_OF_THE_QUESTIONS_ABOVE_PLEASE_PROVIDE_DETAILS_BELOW =
    req.body.IF_YOU_HAVE_ANSWERED_YES_TO_ANY_OF_THE_QUESTIONS_ABOVE_PLEASE_PROVIDE_DETAILS_BELOW;


  generateKycPdf(addDefaultValues(data))
    .then((pdf) => {
      res.setHeader("Content-Disposition", "attachment; filename=example.pdf");
      res.setHeader("Content-Type", "application/pdf");
      res.send(pdf);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});

const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use`);
  } else {
    console.error(err);
  }
});
