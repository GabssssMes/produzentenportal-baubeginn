const express = require("express");
const {
  createPdf,
  uploadFile,
  uploadAusweis,
  uploadStromrechnung,
  uploadKataster,
} = require("./pdfController");
const pdfRoute = express.Router();
const multer = require("multer");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./Backend/Documents/Uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});
let upload = multer({ storage });

pdfRoute.post("/uploadFile", upload.single("file"), uploadFile); // to upload Unterschrift
//pdfRoute.get("/fetchPdf", fetchPdf); // to fetch the generated pdf
//pdfRoute.post("/sendPdf", sendPdf); //sent pdf to mail

//storage = multer.diskStorage({
//  destination: function (req, file, cb) {
//    return cb(null, "./Documents/ID");
//  },
//  filename: function (req, file, cb) {
//    return cb(null, `${Date.now()}_${file.originalname}`);
//  },
//});
//upload = multer({ storage });

pdfRoute.post("/uploadAusweis", upload.single("file"), uploadAusweis); // to upload Ausweis

/*storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./Documents/Bill");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});
upload = multer({ storage });*/

pdfRoute.post(
  "/uploadStromrechnung",
  upload.single("file"),
  uploadStromrechnung
); // to upload Stromrechnung

/*storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./Documents/Cadastral");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});
upload = multer({ storage });*/

pdfRoute.post("/uploadKataster", upload.single("file"), uploadKataster); // to upload Katasterauszug

pdfRoute.post("/createPdf", createPdf); // to generate pdf

module.exports = pdfRoute;
