const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const pdfRoute = require("./pdfRoutes");
const fs = require("fs");

dotenv.config();

const PORT = process.env.PORT || 8001;
const buildPath = path.join(__dirname, "../Frontend/build/");

app.use(express.static(buildPath));
app.use(express.json());
app.use(cors());
app.use(pdfRoute);

app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server runnin on ${PORT}`);
});
setInterval(() => {
  console.log("check");
  deleteFilesOlderThan("./Backend/Documents/Uploads", 7200000);
}, 300000);

const deleteFilesOlderThan = (directory, time) => {
  fs.readdir(directory, function (err, files) {
    files.forEach(function (file, index) {
      fs.stat(directory + "/" + file, function (err, stat) {
        var endTime, now;
        if (err) {
          return console.error(err);
        }
        now = new Date().getTime();
        endTime = new Date(stat.ctime).getTime() + time;
        if (now > endTime) {
          if (fs.existsSync(directory)) {
            fs.unlinkSync(directory + "/" + file);
          }
        }
      });
    });
  });
};
