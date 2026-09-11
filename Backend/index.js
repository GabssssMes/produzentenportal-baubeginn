const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const pdfRoute = require("./pdfRoutes");
const admin = require("firebase-admin");
//const { initializeApp, cert } = require("firebase-admin/app");

dotenv.config();
const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY); // Pfad ggf. anpassen-> beim testen auf lokalhost
if (serviceAccount.private_key) {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
}
admin.initializeApp({
  credential: cert(serviceAccount),
});
const app = express();

const PORT = process.env.PORT || 8001;
const buildPath = path.join(__dirname, "../Frontend/build/");

app.use(express.static(buildPath));
app.use(express.json());
app.use(cors());
app.use(pdfRoute);

app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// Middleware zur Verifizierung des Firebase Tokens
const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Kein Token bereitgestellt." });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    // Verifiziert das Token direkt mit Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // Speichert Benutzerdaten (z. B. req.user.uid, req.user.email) im Request
    next();
  } catch (error) {
    console.error("Token-Verifizierung fehlgeschlagen:", error);
    return res
      .status(403)
      .json({ message: "Ungültiges oder abgelaufenes Token." });
  }
};

// Öffentlich zugängliche Route
app.get("/api/public", (req, res) => {
  res.json({ message: "Diese Daten kann jeder sehen." });
});

// Geschützte Route – benötigt die Middleware
app.get("/api/protected-data", verifyFirebaseToken, (req, res) => {
  res.json({
    message: `Hallo ${req.user.email}! Dies sind geschützte Daten aus deinem Backend.`,
    userId: req.user.uid,
  });
});

app.listen(PORT, () => {
  console.log(`Server runnin on ${PORT}`);
});
