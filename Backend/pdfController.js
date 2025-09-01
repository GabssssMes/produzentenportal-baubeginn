const { PDFDocument } = require("pdf-lib");
const { writeFileSync, readFileSync, unlinkSync } = require("fs");
const nodemailer = require("nodemailer");
const fs = require("fs");

exports.uploadFile = async (req, res) => {
  res.send(req.file.filename);
};
exports.uploadAusweis = async (req, res) => {
  res.send(req.file.filename);
};
exports.uploadStromrechnung = async (req, res) => {
  res.send(req.file.filename);
};
exports.uploadKataster = async (req, res) => {
  res.send(req.file.filename);
};
exports.createPdf = async (req, res) => {
  //console.log(req.body);
  const PersonalData = req.body.Personendaten;
  const PersonalDataEl = req.body.PersonendatenEl;
  const PVData = req.body.PVDaten;
  const PVAdress = req.body.PVAdresse;
  const SPI = req.body.Spi;
  const Modul = req.body.Modul;
  const Inverter = req.body.Inverter;
  const Speicher = req.body.Speicher;
  const current = new Date();
  const date = `${current.getDate()}.${
    current.getMonth() + 1
  }.${current.getFullYear()}`;
  const Geburtsdatum = changeDateFormat(PersonalData["Geburtsdatum"].content);
  const Baubeginn = changeDateFormat(PVData["Baubeginn"].content);
  let attachmentSize = 0;

  let filesToDelete = [];
  let pdfsToSend = [];
  let pathsAndFilenames = [];
  const UploadedFileSizes = [
    req.body.Unterschrift.size[req.body.Unterschrift.size.length - 1],
    req.body.Ausweis.size[req.body.Ausweis.size.length - 1],
    req.body.Stromrechnung.size[req.body.Stromrechnung.size.length - 1],
    req.body.Kataster.size[req.body.Kataster.size.length - 1],
  ];
  const UploadedFilesToSend = [
    {
      filename:
        req.body.Unterschrift.filename[
          req.body.Unterschrift.filename.length - 1
        ],
      path:
        "./Backend/Documents/Uploads/" +
        req.body.Unterschrift.filename[
          req.body.Unterschrift.filename.length - 1
        ],
    },
    {
      filename: req.body.Ausweis.filename[req.body.Ausweis.filename.length - 1],
      path:
        "./Backend/Documents/Uploads/" +
        req.body.Ausweis.filename[req.body.Ausweis.filename.length - 1],
    },
    {
      filename:
        req.body.Stromrechnung.filename[
          req.body.Stromrechnung.filename.length - 1
        ],
      path:
        "./Backend/Documents/Uploads/" +
        req.body.Stromrechnung.filename[
          req.body.Stromrechnung.filename.length - 1
        ],
    },
    {
      filename:
        req.body.Kataster.filename[req.body.Kataster.filename.length - 1],
      path:
        "./Backend/Documents/Uploads/" +
        req.body.Kataster.filename[req.body.Kataster.filename.length - 1],
    },
  ];
  if (Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <= 20) {
    //Wenn Edyna und <20kW
    if (
      (PVData["POD"].content.split("")[2] === "0" &&
        PVData["POD"].content.split("")[3] === "8" && //Wenn Anlage in Lüsen
        PVData["POD"].content.split("")[4] === "1") ||
      (PVData["POD"].content.split("")[2] === "1" &&
        PVData["POD"].content.split("")[3] === "5" && //wenn Anlage in Vierschach
        PVData["POD"].content.split("")[4] === "9") ||
      (PVData["POD"].content.split("")[2] === "0" &&
        PVData["POD"].content.split("")[3] === "4" && //wenn Anlage in Gsies
        PVData["POD"].content.split("")[4] === "5") ||
      (PVData["POD"].content.split("")[2] === "0" &&
        PVData["POD"].content.split("")[3] === "5" && //wenn Anlage in Kiens
        PVData["POD"].content.split("")[4] === "0") ||
      (PVData["POD"].content.split("")[2] === "0" &&
        PVData["POD"].content.split("")[3] === "5" && //wenn Anlage in Toblach
        PVData["POD"].content.split("")[4] === "5") ||
      (PVData["POD"].content.split("")[2] === "0" &&
        PVData["POD"].content.split("")[3] === "3" && //Wenn Anlage in Bruneck
        PVData["POD"].content.split("")[4] === "9")
    ) {
      attachmentSize = attachmentSize + 700000;
      let pdfDoc4,
        filename4 =
          "Dichiarazione fino 20kW" +
          PersonalData["Nachname"].content +
          "_" +
          PersonalData["Vorname"].content +
          ".pdf",
        path4 =
          "./Dichiarazione fino 20kW" +
          PersonalData["Nachname"].content +
          "_" +
          PersonalData["Vorname"].content +
          ".pdf";
      pdfDoc4 = await PDFDocument.load(
        readFileSync("./Backend/Documents/Dichiarazione fino 20kW.pdf")
      );
      const pages4 = pdfDoc4.getPages();

      pages4[0].drawText(
        PersonalData["Nachname"].content +
          " " +
          PersonalData["Vorname"].content,
        {
          x: 118,
          y: 700,
          size: 6,
        }
      );
      pages4[0].drawText(PersonalData["Geburtsort"].content, {
        x: 267,
        y: 700,
        size: 6,
      });
      pages4[0].drawText(
        PersonalData[
          "Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"
        ].content,
        {
          x: 410,
          y: 700,
          size: 6,
        }
      );
      pages4[0].drawText(Geburtsdatum, {
        x: 66,
        y: 685,
        size: 6,
      });

      pages4[0].drawText(PersonalData["Steuernummer"].content, {
        x: 190,
        y: 685,
        size: 6,
      });
      pages4[0].drawText(PersonalData["Straße"].content, {
        x: 344,
        y: 685,
        size: 6,
      });
      pages4[0].drawText(PersonalData["Hausnummer"].content, {
        x: 443,
        y: 685,
        size: 6,
      });
      pages4[0].drawText(PersonalData["Postleitzahl"].content, {
        x: 491,
        y: 685,
        size: 6,
      });
      pages4[0].drawText(PersonalData["Wohnhaft in der Gemeinde"].content, {
        x: 96,
        y: 671,
        size: 6,
      });
      pages4[0].drawText(
        PersonalData[
          "Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"
        ].content,
        {
          x: 220,
          y: 671,
          size: 6,
        }
      );
      pages4[0].drawText(PVData["POD"].content, {
        x: 90,
        y: 605,
        size: 8,
      });
      pages4[0].drawText(
        PVAdress["Straße"].content + " " + PVAdress["Nummer"].content,
        {
          x: 108,
          y: 583,
          size: 6,
        }
      );
      pages4[0].drawText(PVAdress["Postleitzahl"].content, {
        x: 202,
        y: 583,
        size: 8,
      });
      pages4[0].drawText(PVAdress["Gemeinde"].content, {
        x: 342,
        y: 583,
        size: 8,
      });
      pages4[0].drawText(
        PVAdress["Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"]
          .content,
        {
          x: 476,
          y: 583,
          size: 8,
        }
      );
      pages4[0].drawText(
        PVData["Nennleistung der gesamten Inverter[kW]"].content,
        {
          x: 193,
          y: 560,
          size: 8,
        }
      );
      if (
        Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <
        Number(PVData["Spitzenleistung[kW]"].content)
      ) {
        pages4[0].drawText(
          PVData["Nennleistung der gesamten Inverter[kW]"].content,
          {
            x: 244,
            y: 538,
            size: 8,
          }
        );
      } else {
        pages4[0].drawText(PVData["Spitzenleistung[kW]"].content, {
          x: 244,
          y: 538,
          size: 8,
        });
      }
      pages4[0].drawText(date, {
        x: 90,
        y: 130,
        size: 8,
      });

      filesToDelete = filesToDelete.concat([filename4]);
      pdfsToSend = pdfsToSend.concat([pdfDoc4]);
      pathsAndFilenames = pathsAndFilenames.concat([
        {
          filename: filename4,
          path: path4,
          contentType: "application/pdf",
        },
      ]);
    }
  }
  if (Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) > 20) {
    attachmentSize = attachmentSize + 2450000;
    let pdfDoc4,
      filename4 =
        "07 Bis - Nuova Dichiaraz  sostitutiva di atto notorio Off  elettr  - DL 16_2012_" +
        PersonalData["Nachname"].content +
        "_" +
        PersonalData["Vorname"].content +
        ".pdf",
      path4 =
        "./07 Bis - Nuova Dichiaraz  sostitutiva di atto notorio Off  elettr  - DL 16_2012_" +
        PersonalData["Nachname"].content +
        "_" +
        PersonalData["Vorname"].content +
        ".pdf";
    pdfDoc4 = await PDFDocument.load(
      readFileSync(
        "./Backend/Documents/07 Bis - Nuova Dichiaraz  sostitutiva di atto notorio Off  elettr  - DL 16_2012_Vorlage.pdf"
      )
    );
    const pages4 = pdfDoc4.getPages();

    let pdfDoc5,
      filename5 =
        "DENUNCIA ATTIVITA OFFICINA_" +
        PersonalData["Nachname"].content +
        "_" +
        PersonalData["Vorname"].content +
        ".pdf",
      path5 =
        "./DENUNCIA ATTIVITA OFFICINA_" +
        PersonalData["Nachname"].content +
        "_" +
        PersonalData["Vorname"].content +
        ".pdf";
    pdfDoc5 = await PDFDocument.load(
      readFileSync("./Backend/Documents/DENUNCIA ATTIVITA OFFICINA_Vorlage.pdf")
    );
    const pages5 = pdfDoc5.getPages();
    if (PersonalData["Privatperson"].selectedValue !== "Ja") {
      attachmentSize = attachmentSize + 410000;
      let pdfDoc6,
        filename6 =
          "Delega_UTF_" +
          PersonalData["Nachname"].content +
          "_" +
          PersonalData["Vorname"].content +
          ".pdf",
        path6 =
          "./Delega_UTF_" +
          PersonalData["Nachname"].content +
          "_" +
          PersonalData["Vorname"].content +
          ".pdf";
      pdfDoc6 = await PDFDocument.load(
        readFileSync("./Backend/Documents/Vorlage Delega.pdf")
      );
      const pages6 = pdfDoc6.getPages();
      pages6[0].drawText(
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
        {
          x: 121,
          y: 605,
          size: 8,
        }
      );
      pages6[0].drawText(PersonalData["Geburtsort"].content, {
        x: 387,
        y: 605,
        size: 8,
      });
      pages6[0].drawText(Geburtsdatum, {
        x: 318,
        y: 605,
        size: 8,
      });
      pages6[0].drawText(PersonalData["Steuernummer"].content, {
        x: 93,
        y: 584,
        size: 8,
      });
      pages6[0].drawText(
        PersonalData["Postleitzahl"].content +
          " " +
          PersonalData["Wohnhaft in der Gemeinde"].content,
        {
          x: 289,
          y: 584,
          size: 8,
        }
      );
      pages6[0].drawText(
        PersonalData["Straße"].content +
          " " +
          PersonalData["Hausnummer"].content,
        {
          x: 58,
          y: 564,
          size: 8,
        }
      );
      pages6[0].drawText(PersonalData["Privatperson"].content, {
        x: 58,
        y: 544,
        size: 8,
      });
      pages6[0].drawText(PersonalData["Privatperson"].content, {
        x: 58,
        y: 790,
        size: 8,
      });
      pages6[0].drawText(PersonalData["Partita Iva"].content, {
        x: 322,
        y: 544,
        size: 8,
      });
      pages6[0].drawText(PersonalData["Partita Iva"].content, {
        x: 450,
        y: 544,
        size: 8,
      });
      pages6[0].drawText(
        PVData["Nennleistung der gesamten Inverter[kW]"].content,
        {
          x: 415,
          y: 504,
          size: 8,
        }
      );
      pages6[0].drawText(
        PVAdress["Postleitzahl"].content + " " + PVAdress["Gemeinde"].content,
        {
          x: 125,
          y: 484,
          size: 8,
        }
      );
      pages6[0].drawText(
        PVAdress["Straße"].content + " " + PVAdress["Nummer"].content,
        {
          x: 354,
          y: 484,
          size: 8,
        }
      );
      pages6[0].drawText(date, {
        x: 97,
        y: 252,
        size: 8,
      });
      filesToDelete = filesToDelete.concat([filename6]);
      pdfsToSend = pdfsToSend.concat([pdfDoc6]);
      pathsAndFilenames = pathsAndFilenames.concat([
        {
          filename: filename6,
          path: path6,
          contentType: "application/pdf",
        },
      ]);
    }

    pages4[0].drawText(
      PersonalData["Nachname"].content + " " + PersonalData["Vorname"].content,
      {
        x: 159,
        y: 695,
        size: 8,
      }
    );
    pages4[0].drawText(PersonalData["Geburtsort"].content, {
      x: 101,
      y: 657,
      size: 8,
    });
    pages4[0].drawText(Geburtsdatum, {
      x: 409,
      y: 656,
      size: 8,
    });
    pages4[0].drawText(PersonalData["Wohnhaft in der Gemeinde"].content, {
      x: 117,
      y: 620,
      size: 8,
    });
    pages4[0].drawText(
      PersonalData["Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"]
        .content,
      {
        x: 439,
        y: 620,
        size: 8,
      }
    );
    pages4[0].drawText(PersonalData["Straße"].content, {
      x: 120,
      y: 585,
      size: 8,
    });
    pages4[0].drawText(PersonalData["Hausnummer"].content, {
      x: 428,
      y: 585,
      size: 8,
    });
    if (PersonalData["Privatperson"].selectedValue === "Ja") {
      pages4[0].drawLine({
        start: { x: 174, y: 553 },
        end: { x: 267, y: 553 },
      });
      pages4[0].drawLine({
        start: { x: 174, y: 550 },
        end: { x: 267, y: 550 },
      });
    } else {
      pages4[0].drawLine({
        start: { x: 139, y: 553 },
        end: { x: 171, y: 553 },
      });
      pages4[0].drawLine({
        start: { x: 139, y: 550 },
        end: { x: 171, y: 550 },
      });
      pages4[0].drawText(PersonalData["Privatperson"].content, {
        x: 327,
        y: 548,
        size: 8,
      });
    }
    pages4[0].drawText(
      PVData["Nennleistung der gesamten Inverter[kW]"].content,
      {
        x: 449,
        y: 513,
        size: 8,
      }
    );
    pages4[0].drawText(PVAdress["Gemeinde"].content, {
      x: 161,
      y: 477,
      size: 8,
    });
    pages4[0].drawText(PVAdress["Straße"].content, {
      x: 349,
      y: 477,
      size: 8,
    });
    pages4[0].drawText(PVAdress["Nummer"].content, {
      x: 480,
      y: 477,
      size: 8,
    });

    pages5[0].drawText(PersonalData["Vorname"].content, {
      x: 348,
      y: 503,
      size: 8,
    });
    pages5[0].drawText(PersonalData["Nachname"].content, {
      x: 130,
      y: 503,
      size: 8,
    });
    pages5[0].drawText(PersonalData["Geburtsort"].content, {
      x: 99,
      y: 483,
      size: 8,
    });
    pages5[0].drawText(Geburtsdatum, {
      x: 454,
      y: 483,
      size: 8,
    });
    pages5[0].drawText(PersonalData["Steuernummer"].content, {
      x: 116,
      y: 461,
      size: 8,
    });
    pages5[0].drawText(PersonalData["Wohnhaft in der Gemeinde"].content, {
      x: 301,
      y: 461,
      size: 8,
    });
    pages5[0].drawText(
      PersonalData["Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"]
        .content,
      {
        x: 524,
        y: 461,
        size: 8,
      }
    );
    pages5[0].drawText(PersonalData["Straße"].content, {
      x: 100,
      y: 440,
      size: 8,
    });
    pages5[0].drawText(PersonalData["Hausnummer"].content, {
      x: 467,
      y: 440,
      size: 8,
    });
    pages5[0].drawText(PersonalData["Postleitzahl"].content, {
      x: 525,
      y: 440,
      size: 8,
    });
    if (PersonalData["Privatperson"].selectedValue === "Ja") {
      pages5[0].drawText("titolare", {
        x: 159,
        y: 420,
        size: 8,
      });
    } else {
      pages5[0].drawText("legale rappresentante", {
        x: 159,
        y: 420,
        size: 8,
      });
      pages5[0].drawText(PersonalData["Privatperson"].content, {
        x: 217,
        y: 398,
        size: 8,
      });
      pages5[0].drawText(PersonalData["Partita Iva"].content, {
        x: 121,
        y: 376,
        size: 8,
      });
    }
    pages5[0].drawText(
      PVData["Nennleistung der gesamten Inverter[kW]"].content,
      {
        x: 325,
        y: 130,
        size: 8,
      }
    );
    pages5[0].drawText(PVAdress["Straße"].content, {
      x: 103,
      y: 108,
      size: 8,
    });
    pages5[0].drawText(PVAdress["Nummer"].content, {
      x: 466,
      y: 108,
      size: 8,
    });
    pages5[0].drawText(PVAdress["Postleitzahl"].content, {
      x: 519,
      y: 108,
      size: 8,
    });
    pages5[0].drawText(PVAdress["Gemeinde"].content, {
      x: 131,
      y: 87,
      size: 8,
    });
    pages5[0].drawText(
      PVAdress["Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"]
        .content,
      {
        x: 521,
        y: 87,
        size: 8,
      }
    );
    pages5[1].drawText(PVData["POD"].content, {
      x: 363,
      y: 380,
      size: 8,
    });
    pages5[1].drawText(
      Modul["Marke"].content + ", " + Modul["Modell"].content,
      {
        x: 58,
        y: 254,
        size: 6,
      }
    );
    pages5[1].drawText(Modul["Leistung[kW]"].content, {
      x: 221,
      y: 254,
      size: 6,
    });
    pages5[1].drawText(Modul["Anzahl"].content, {
      x: 366,
      y: 254,
      size: 6,
    });
    pages5[1].drawText(
      String(Modul["Anzahl"].content * Modul["Leistung[kW]"].content),
      {
        x: 478,
        y: 254,
        size: 6,
      }
    );
    pages5[1].drawText(
      Inverter["Marke"].content + ", " + Inverter["Modell"].content,
      {
        x: 58,
        y: 135,
        size: 6,
      }
    );
    pages5[1].drawText(
      PVData["Nennleistung der gesamten Inverter[kW]"].content,
      {
        x: 357,
        y: 135,
        size: 5,
      }
    );

    filesToDelete = filesToDelete.concat([filename4, filename5]);
    pdfsToSend = pdfsToSend.concat([pdfDoc4, pdfDoc5]);
    pathsAndFilenames = pathsAndFilenames.concat([
      {
        filename: filename4,
        path: path4,
        contentType: "application/pdf",
      },
      {
        filename: filename5,
        path: path5,
        contentType: "application/pdf",
      },
    ]);
  }
  attachmentSize = attachmentSize + 500000;
  let pdfDoc,
    pdfDoc2,
    filename =
      "parte_uno_" +
      PersonalData["Nachname"].content +
      "_" +
      PersonalData["Vorname"].content +
      ".pdf",
    filename2 =
      "parte_due_" +
      PersonalData["Nachname"].content +
      "_" +
      PersonalData["Vorname"].content +
      ".pdf",
    path =
      "./parte_uno_" +
      PersonalData["Nachname"].content +
      "_" +
      PersonalData["Vorname"].content +
      ".pdf",
    path2 =
      "./parte_due_" +
      PersonalData["Nachname"].content +
      "_" +
      PersonalData["Vorname"].content +
      ".pdf";
  pdfDoc = await PDFDocument.load(
    readFileSync("./Backend/Documents/Modello unico parte 1.pdf")
  );
  pdfDoc2 = await PDFDocument.load(
    readFileSync("./Backend/Documents/Modello unico parte 2.pdf")
  );

  const pages = pdfDoc.getPages();
  const pages2 = pdfDoc2.getPages();
  pdfsToSend = pdfsToSend.concat([pdfDoc]);
  pdfsToSend = pdfsToSend.concat([pdfDoc2]);
  pathsAndFilenames = pathsAndFilenames.concat([
    {
      filename: filename,
      path: path,
      contentType: "application/pdf",
    },
    {
      filename: filename2,
      path: path2,
      contentType: "application/pdf",
    },
  ]);
  filesToDelete = filesToDelete.concat([filename]);
  filesToDelete = filesToDelete.concat([filename2]);
  pages[0].drawText(
    PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
    {
      x: 114,
      y: 665,
      size: 8,
    }
  );
  pages[0].drawText(PersonalData["Geburtsort"].content, {
    x: 316,
    y: 665,
    size: 8,
  });
  pages[0].drawText(Geburtsdatum, {
    x: 388,
    y: 665,
    size: 8,
  });
  pages[0].drawText(PersonalData["Wohnhaft in der Gemeinde"].content, {
    x: 68,
    y: 652,
    size: 8,
  });
  pages[0].drawText(
    PersonalData["Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"]
      .content,
    {
      x: 325,
      y: 653,
      size: 8,
    }
  );
  pages[0].drawText(
    PersonalData["Straße"].content + " " + PersonalData["Hausnummer"].content,
    {
      x: 364,
      y: 652,
      size: 6,
    }
  );
  pages[0].drawText(PersonalData["Postleitzahl"].content, {
    x: 60,
    y: 643,
    size: 8,
  });
  pages[0].drawText(
    PersonalData["Steuernummer"].content +
      "  " +
      PersonalData["Partita Iva"].content,
    {
      x: 163,
      y: 643,
      size: 6,
    }
  );
  pages[0].drawText(PersonalData["Telefonnummer"].content, {
    x: 114,
    y: 630,
    size: 6,
  });
  pages[0].drawText(PersonalData["Telefonnummer"].content, {
    x: 181,
    y: 630,
    size: 6,
  });
  pages[0].drawText(PersonalData["Email"].content, {
    x: 258,
    y: 630,
    size: 8,
  });
  if (PersonalData["Privatperson"].selectedValue === "Ja") {
    pages[0].drawLine({
      start: { x: 75, y: 585 },
      end: { x: 81, y: 579 },
    });
    pages[0].drawLine({
      start: { x: 75, y: 579 },
      end: { x: 81, y: 585 },
    });
  } else {
    pages[0].drawLine({
      start: { x: 75, y: 544 },
      end: { x: 81, y: 537 },
    });
    pages[0].drawLine({
      start: { x: 75, y: 537 },
      end: { x: 81, y: 544 },
    });
    pages[0].drawText(
      "Legale rappresentante della ditta " +
        PersonalData["Privatperson"].content,
      {
        x: 168,
        y: 537,
        size: 8,
      }
    );
  }
  pages[0].drawText(Baubeginn, {
    x: 107,
    y: 410,
    size: 7,
  });
  pages[0].drawText(PVData["Name PV-Anlage"].content, {
    x: 474,
    y: 416,
    size: 6,
  });
  pages[0].drawText(PVData["Spitzenleistung[kW]"].content, {
    x: 150,
    y: 398,
    size: 6,
  });
  pages[0].drawText(PVData["Nennleistung der gesamten Inverter[kW]"].content, {
    x: 425,
    y: 398,
    size: 6,
  });
  pages[0].drawText(PVData["POD"].content, {
    x: 178,
    y: 385,
    size: 8,
  });
  pages[0].drawText(PVAdress["Fraktion"].content, {
    x: 85,
    y: 329,
    size: 8,
  });
  pages[0].drawText(
    PVAdress["Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"]
      .content,
    {
      x: 102,
      y: 320,
      size: 8,
    }
  );
  
      pages[0].drawText(PVAdress["Postleitzahl"].content, {
        x: 170,
        y: 329,
        size: 8,
      });
  pages[0].drawText(PVAdress["Straße"].content, {
    x: 359,
    y: 329,
    size: 6,
  });
  pages[0].drawText(PVAdress["Nummer"].content, {
    x: 437,
    y: 329,
    size: 8,
  });
  pages[0].drawText(PVAdress["Gemeinde"].content, {
    x: 493,
    y: 329,
    size: 8,
  });
  pages[0].drawText(PVAdress["Kataster-Blatt"].content, {
    x: 120,
    y: 292,
    size: 8,
  });

  pages[0].drawText(PVAdress["Kataster-Parzelle"].content, {
    x: 160,
    y: 292,
    size: 8,
  });
  pages[0].drawText(PVAdress["Kataster-Sub."].content, {
    x: 207,
    y: 292,
    size: 8,
  });

  if (PVData["Speicher"].selectedValue === "Ja") {
    pages[0].drawText(PVData["Speicher"].content, {
      x: 414,
      y: 196,
      size: 6,
    });
    pages[0].drawLine({
      start: { x: 75, y: 200 },
      end: { x: 80, y: 194 },
    });

    pages[0].drawLine({
      start: { x: 75, y: 194 },
      end: { x: 80, y: 200 },
    });

    pages[0].drawLine({
      start: { x: 93, y: 159 },
      end: { x: 97, y: 154 },
    });
    pages[0].drawLine({
      start: { x: 93, y: 154 },
      end: { x: 97, y: 159 },
    });
    pages[0].drawText(PVData["Speicher"].leistung, {
      x: 408,
      y: 113,
      size: 6,
    });
  }
  if (
    Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <
    Number(PVData["Spitzenleistung[kW]"].content)
  ) {
    pages[0].drawText(
      PVData["Nennleistung der gesamten Inverter[kW]"].content,
      {
        x: 434,
        y: 59,
        size: 8,
      }
    );
  } else {
    pages[0].drawText(PVData["Spitzenleistung[kW]"].content, {
      x: 434,
      y: 59,
      size: 8,
    });
  }
  pages[1].drawText(PersonalData["IBAN laufend auf"].content, {
    x: 62,
    y: 715,
    size: 6,
  });
  pages[1].drawText(PersonalData["IBAN"].content, {
    x: 227,
    y: 714,
    size: 7,
  });
  pages[1].drawText(PVAdress["Fraktion"].content + "    " + date, {
    x: 137,
    y: 239,
    size: 8,
  });

  pages2[0].drawText(
    PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
    {
      x: 109,
      y: 725,
      size: 6,
    }
  );
  pages2[0].drawText(PVData["Spitzenleistung[kW]"].content, {
    x: 80,
    y: 621,
    size: 6,
  });
  pages2[0].drawText(PVData["Nennleistung der gesamten Inverter[kW]"].content, {
    x: 396,
    y: 621,
    size: 6,
  });
  if (
    Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <
    Number(PVData["Spitzenleistung[kW]"].content)
  ) {
    pages2[0].drawText(
      PVData["Nennleistung der gesamten Inverter[kW]"].content,
      {
        x: 134,
        y: 609,
        size: 8,
      }
    );
  } else {
    pages2[0].drawText(PVData["Spitzenleistung[kW]"].content, {
      x: 134,
      y: 609,
      size: 8,
    });
  }
  if (PVData["Speicher"].selectedValue === "Ja") {
    pages2[0].drawText(PVData["Speicher"].content, {
      x: 282,
      y: 576,
      size: 6,
    });
    pages2[0].drawLine({
      start: { x: 70, y: 550 },
      end: { x: 74, y: 546 },
    });
    pages2[0].drawLine({
      start: { x: 70, y: 546 },
      end: { x: 74, y: 550 },
    });
    pages2[0].drawText(PVData["Speicher"].leistung, {
      x: 412,
      y: 519,
      size: 6,
    });
  }
  pages2[0].drawText(SPI["Marke"].content, {
    x: 185,
    y: 469,
    size: 6,
  });
  if (
    Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) > 11.08
  ) {
    pages2[0].drawText(SPI["Modell"].content, {
      x: 268,
      y: 469,
      size: 6,
    });
  } else if (
    Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <= 11.08
  ) {
    pages2[0].drawText(
      SPI["Modell"].content + " integrato nell' inverter secondo CEI 0-21",
      {
        x: 268,
        y: 469,
        size: 6,
      }
    );
  }
  pages2[0].drawText(Inverter["Marke"].content, {
    x: 119,
    y: 448,
    size: 6,
  });
  pages2[0].drawText(Inverter["Modell"].content, {
    x: 194,
    y: 455,
    size: 6,
  });
  pages2[0].drawText(PVData["Nennleistung der gesamten Inverter[kW]"].content, {
    x: 256,
    y: 448,
    size: 6,
  });
  pages2[0].drawText(Speicher["Marke"].content, {
    x: 168,
    y: 427,
    size: 6,
  });
  pages2[0].drawText(Speicher["Modell"].content, {
    x: 250,
    y: 435,
    size: 6,
  });
  pages2[0].drawText(PVData["Speicher"].leistung, {
    x: 315,
    y: 427,
    size: 5,
  });
  pages2[0].drawText(PersonalData["IBAN laufend auf"].content, {
    x: 279,
    y: 359,
    size: 6,
  });
  pages2[0].drawText(PersonalData["IBAN"].content, {
    x: 483,
    y: 359,
    size: 6,
  });
  pages2[1].drawText(PVAdress["Fraktion"].content, {
    x: 110,
    y: 604,
    size: 8,
  });

  if (
    PVData["POD"].content.split("")[2] === "0" &&
    PVData["POD"].content.split("")[3] === "3" && //Wenn Anlage in Bruneck
    PVData["POD"].content.split("")[4] === "9" &&
    PVData["POD"].content.split("")[5] === "E"
  ) {
    attachmentSize = attachmentSize + 1500000;
    let pdfDoc,
      pdfDoc2,
      pdfDoc3,
      filename3 =
        "Regolamento_" +
        PersonalData["Nachname"].content +
        "_" +
        PersonalData["Vorname"].content +
        ".pdf",
      path3 =
        "Regolamento_" +
        PersonalData["Nachname"].content +
        "_" +
        PersonalData["Vorname"].content +
        ".pdf";
    pdfDoc3 = await PDFDocument.load(
      readFileSync("./Backend/Documents/Regolamento_Bruneck.pdf")
    );
    const pages3 = pdfDoc3.getPages();
    pdfsToSend = pdfsToSend.concat([pdfDoc3]);
    pathsAndFilenames = pathsAndFilenames.concat([
      {
        filename: filename3,
        path: path3,
        contentType: "application/pdf",
      },
    ]);
    filesToDelete = filesToDelete.concat([filename3]);

    pages3[0].drawText(PVAdress["Fraktion"].content + ", " + date, {
      x: 63,
      y: 102,
      size: 8,
    });

    pages3[1].drawText(
      PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
      {
        x: 227,
        y: 638,
        size: 8,
      }
    );
    pages3[1].drawText(PersonalData["Geburtsort"].content, {
      x: 227,
      y: 619,
      size: 8,
    });
    pages3[1].drawText(Geburtsdatum, {
      x: 227,
      y: 601,
      size: 8,
    });
    pages3[1].drawText(PersonalData["Fraktion"].content, {
      x: 227,
      y: 583,
      size: 8,
    });
    pages3[1].drawText(
      PersonalData["Straße"].content + " " + PersonalData["Hausnummer"].content,
      {
        x: 227,
        y: 566,
        size: 8,
      }
    );
    if (PersonalData["Privatperson"].selectedValue === "Ja") {
      pages3[1].drawLine({
        start: { x: 65, y: 523 },
        end: { x: 75, y: 513 },
      });
      pages3[1].drawLine({
        start: { x: 65, y: 513 },
        end: { x: 75, y: 523 },
      });
    } else {
      pages3[1].drawLine({
        start: { x: 65, y: 493 },
        end: { x: 75, y: 483 },
      });
      pages3[1].drawLine({
        start: { x: 65, y: 483 },
        end: { x: 75, y: 493 },
      });
      pages3[1].drawText("legale rappresentante", {
        x: 144,
        y: 484,
        size: 8,
      });
      pages3[1].drawText(PersonalData["Privatperson"].content, {
        x: 227,
        y: 449,
        size: 8,
      });
      pages3[1].drawText(PersonalData["Partita Iva"].content, {
        x: 227,
        y: 397,
        size: 8,
      });
    }
    pages3[1].drawText(
      PVAdress["Straße"].content + " " + PVAdress["Nummer"].content,
      {
        x: 226,
        y: 151,
        size: 8,
      }
    );

    pages3[1].drawText(PVAdress["Gemeinde"].content, {
      x: 226,
      y: 133,
      size: 8,
    });
    pages3[1].drawText(PVData["POD"].content, {
      x: 226,
      y: 115,
      size: 8,
    });
    pages3[2].drawText(PVData["Name PV-Anlage"].content, {
      x: 63,
      y: 670,
      size: 8,
    });
    pages3[2].drawText(
      PVData["Nennleistung der gesamten Inverter[kW]"].content,
      {
        x: 401,
        y: 670,
        size: 8,
      }
    );
    pages3[7].drawText(
      PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
      {
        x: 60,
        y: 498,
        size: 8,
      }
    );
    pages3[7].drawText(PersonalData["Telefonnummer"].content, {
      x: 358,
      y: 501,
      size: 8,
    });
    pages3[7].drawText(PersonalData["Email"].content, {
      x: 455,
      y: 501,
      size: 8,
    });
    pages3[7].drawText(
      PersonalDataEl["Vorname"].content +
        " " +
        PersonalDataEl["Nachname"].content,
      {
        x: 60,
        y: 446,
        size: 8,
      }
    );
    pages3[7].drawText(PersonalDataEl["Telefonnummer"].content, {
      x: 257,
      y: 446,
      size: 8,
    });
    pages3[7].drawText(PersonalDataEl["Email"].content, {
      x: 455,
      y: 446,
      size: 8,
    });
    pages3[9].drawText(
      PVData["Nennleistung der gesamten Inverter[kW]"].content,
      {
        x: 407,
        y: 411,
        size: 8,
      }
    );

    if (PVData["Speicher"].selectedValue === "Ja") {
      pages3[9].drawText(PVData["Speicher"].leistung, {
        x: 405,
        y: 391,
        size: 8,
      });
    } else {
      pages3[9].drawText("/", {
        x: 405,
        y: 391,
        size: 8,
      });
    }
    if (
      Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <
      Number(PVData["Spitzenleistung[kW]"].content)
    ) {
      pages3[9].drawText(
        PVData["Nennleistung der gesamten Inverter[kW]"].content,
        {
          x: 451,
          y: 364,
          size: 8,
        }
      );
    } else if (
      Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) >=
      Number(PVData["Spitzenleistung[kW]"].content)
    ) {
      pages3[9].drawText(PVData["Spitzenleistung[kW]"].content, {
        x: 451,
        y: 364,
        size: 8,
      });
    }
    pages3[10].drawText(PVData["POD"].content, {
      x: 123,
      y: 250,
      size: 8,
    });
    pages3[12].drawText(PVAdress["Fraktion"].content + ", " + date, {
      x: 60,
      y: 605,
      size: 8,
    });
    if (PVData["Spannung der Anlage"].selectedValue === "Monofase") {
      pages3[14].drawLine({
        start: { x: 390, y: 705 },
        end: { x: 400, y: 695 },
      });
      pages3[14].drawLine({
        start: { x: 390, y: 695 },
        end: { x: 400, y: 705 },
      });
    } else if (PVData["Spannung der Anlage"].selectedValue === "Trifase") {
      pages3[14].drawLine({
        start: { x: 476, y: 705 },
        end: { x: 486, y: 695 },
      });
      pages3[14].drawLine({
        start: { x: 476, y: 695 },
        end: { x: 486, y: 705 },
      });
    }
    pages3[14].drawText(
      PVData["Nennleistung der gesamten Inverter[kW]"].content,
      {
        x: 390,
        y: 676,
        size: 8,
      }
    );
    pages3[14].drawText(Inverter["Marke"].content, {
      x: 141,
      y: 134,
      size: 8,
    });
    if (
      Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <= 11.08
    ) {
      pages3[15].drawLine({
        start: { x: 65, y: 579 },
        end: { x: 75, y: 569 },
      });
      pages3[15].drawLine({
        start: { x: 65, y: 569 },
        end: { x: 75, y: 579 },
      });
      pages3[16].drawLine({
        start: { x: 65, y: 96 },
        end: { x: 75, y: 86 },
      });
      pages3[16].drawLine({
        start: { x: 65, y: 86 },
        end: { x: 75, y: 96 },
      });
      pages3[17].drawLine({
        start: { x: 450, y: 628 },
        end: { x: 460, y: 618 },
      });
      pages3[17].drawLine({
        start: { x: 450, y: 618 },
        end: { x: 460, y: 628 },
      });
    } else {
      pages3[16].drawLine({
        start: { x: 306, y: 96 },
        end: { x: 316, y: 86 },
      });
      pages3[16].drawLine({
        start: { x: 306, y: 86 },
        end: { x: 316, y: 96 },
      });
      pages3[17].drawLine({
        start: { x: 508, y: 628 },
        end: { x: 518, y: 618 },
      });
      pages3[17].drawLine({
        start: { x: 508, y: 618 },
        end: { x: 518, y: 628 },
      });
    }
    if (PVData["Speicher"].selectedValue === "Ja") {
      pages3[15].drawText(Speicher["Marke"].content, {
        x: 142,
        y: 87,
        size: 8,
      });
    }

    pages3[17].drawText(SPI["Marke"].content, {
      x: 104,
      y: 608,
      size: 8,
    });
    pages3[17].drawText(SPI["Modell"].content, {
      x: 196,
      y: 608,
      size: 8,
    });
    pages3[17].drawText(PVAdress["Fraktion"].content + ", " + date, {
      x: 65,
      y: 150,
      size: 8,
    });

    await saveFiles(pdfsToSend, pathsAndFilenames).then(
      sendMailflexible(
        pathsAndFilenames,
        UploadedFilesToSend,
        UploadedFileSizes,
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
        PersonalData["Steuer"].selectedValue,
        Modul,
        filesToDelete,
        attachmentSize
      ).then(() => {
        res.send(
          "Vielen Dank, Ihre Daten wurden erfolgreich übermittelt! Sie können das Portal jetzt verlassen!"
        );
      })
    );
  } else if (
    PVData["POD"].content.split("")[2] === "0" &&
    PVData["POD"].content.split("")[3] === "8" && //Wenn Anlage in Lüsen
    PVData["POD"].content.split("")[4] === "1"
  ) {
    if (
      Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) > 11.08
    ) {
      attachmentSize = attachmentSize + 7500000;
      let pdfDoc3,
        filename3 =
          "Bozza Regolamento_" +
          PersonalData["Nachname"].content +
          "_" +
          PersonalData["Vorname"].content +
          ".pdf",
        path3 =
          "./Bozza Regolamento_" +
          PersonalData["Nachname"].content +
          "_" +
          PersonalData["Vorname"].content +
          ".pdf";
      pdfDoc3 = await PDFDocument.load(
        readFileSync("./Backend/Documents/Bozza Regolamento_BT_LUSON_2024.pdf")
      );
      const pages3 = pdfDoc3.getPages();
      pdfsToSend = pdfsToSend.concat([pdfDoc3]);
      pathsAndFilenames = pathsAndFilenames.concat([
        {
          filename: filename3,
          path: path3,
          contentType: "application/pdf",
        },
      ]);
      filesToDelete = filesToDelete.concat([filename3]);
      pages3[0].drawText(
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
        {
          x: 176,
          y: 550,
          size: 8,
        }
      );
      pages3[0].drawText(
        PersonalData["Geburtsort"].content + " " + Geburtsdatum,
        {
          x: 200,
          y: 531,
          size: 8,
        }
      );
      pages3[0].drawText(PersonalData["Steuernummer"].content, {
        x: 215,
        y: 513,
        size: 8,
      });
      pages3[0].drawText(PersonalData["Partita Iva"].content, {
        x: 388,
        y: 513,
        size: 8,
      });
      pages3[0].drawText(
        PersonalData["Straße"].content +
          " " +
          PersonalData["Hausnummer"].content,
        {
          x: 127,
          y: 495,
          size: 8,
        }
      );
      pages3[0].drawText(PersonalData["Fraktion"].content, {
        x: 453,
        y: 495,
        size: 8,
      });
      pages3[0].drawText(PersonalData["Wohnhaft in der Gemeinde"].content, {
        x: 125,
        y: 477,
        size: 8,
      });
      pages3[0].drawText(PersonalData["Postleitzahl"].content, {
        x: 408,
        y: 477,
        size: 8,
      });
      if (PersonalData["Privatperson"].selectedValue === "Ja") {
        pages3[0].drawLine({
          start: { x: 72, y: 419 },
          end: { x: 85, y: 430 },
        });
        pages3[0].drawLine({
          start: { x: 72, y: 430 },
          end: { x: 85, y: 419 },
        });
      } else {
        pages3[0].drawText("legale rappresentante", {
          x: 141,
          y: 381,
          size: 8,
        });
        pages3[0].drawText(PersonalData["Privatperson"].content, {
          x: 404,
          y: 364,
          size: 8,
        });
      }

      pages3[1].drawText(PVAdress["Straße"].content, {
        x: 78,
        y: 555,
        size: 8,
      });
      pages3[1].drawText(PVAdress["Nummer"].content, {
        x: 461,
        y: 555,
        size: 8,
      });
      pages3[1].drawText(PVAdress["Gemeinde"].content, {
        x: 78,
        y: 536,
        size: 8,
      });
      pages3[1].drawText(PVAdress["Postleitzahl"].content, {
        x: 386,
        y: 536,
        size: 8,
      });
      pages3[1].drawText(PVData["POD"].content, {
        x: 397,
        y: 500,
        size: 8,
      });
      pages3[1].drawText(
        PVData["Nennleistung der gesamten Inverter[kW]"].content,
        {
          x: 315,
          y: 418,
          size: 8,
        }
      );

      pages3[8].drawText(
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
        {
          x: 73,
          y: 414,
          size: 8,
        }
      );
      pages3[8].drawText(PersonalData["Telefonnummer"].content, {
        x: 369,
        y: 414,
        size: 8,
      });
      pages3[8].drawText(PersonalData["Email"].content, {
        x: 453,
        y: 414,
        size: 8,
      });

      if (PVData["Spannung der Anlage"].selectedValue === "Monofase") {
        pages3[11].drawText("230", {
          x: 323,
          y: 621,
          size: 8,
        });
        pages3[13].drawLine({
          start: { x: 301, y: 220 },
          end: { x: 314, y: 232 },
        });
        pages3[13].drawLine({
          start: { x: 301, y: 232 },
          end: { x: 314, y: 220 },
        });
      } else if (PVData["Spannung der Anlage"].selectedValue === "Trifase") {
        pages3[11].drawText("400", {
          x: 323,
          y: 621,
          size: 8,
        });
        pages3[13].drawLine({
          start: { x: 389, y: 220 },
          end: { x: 402, y: 232 },
        });
        pages3[13].drawLine({
          start: { x: 389, y: 232 },
          end: { x: 402, y: 220 },
        });
      }
      if (
        Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <
        Number(PVData["Spitzenleistung[kW]"].content)
      ) {
        pages3[11].drawText(
          PVData["Nennleistung der gesamten Inverter[kW]"].content,
          {
            x: 185,
            y: 560,
            size: 8,
          }
        );
      } else if (
        Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) >=
        Number(PVData["Spitzenleistung[kW]"].content)
      ) {
        pages3[11].drawText(PVData["Spitzenleistung[kW]"].content, {
          x: 185,
          y: 560,
          size: 8,
        });
      }
      pages3[12].drawText("Luson il " + date, {
        x: 140,
        y: 487,
        size: 8,
      });

      pages3[13].drawText(
        PVData["Nennleistung der gesamten Inverter[kW]"].content,
        {
          x: 97,
          y: 184,
          size: 8,
        }
      );

      pages3[16].drawText(SPI["Marke"].content, {
        x: 197,
        y: 626,
        size: 8,
      });
      pages3[16].drawText(SPI["Modell"].content, {
        x: 142,
        y: 608,
        size: 8,
      });

      if (
        Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) > 11.08
      ) {
        pages3[16].drawLine({
          start: { x: 302, y: 567 },
          end: { x: 315, y: 580 },
        });
        pages3[16].drawLine({
          start: { x: 302, y: 580 },
          end: { x: 315, y: 567 },
        });
      } else if (
        Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <=
        11.08
      ) {
        pages3[16].drawLine({
          start: { x: 231, y: 567 },
          end: { x: 244, y: 580 },
        });
        pages3[16].drawLine({
          start: { x: 231, y: 580 },
          end: { x: 244, y: 567 },
        });
      }
      pages3[18].drawText(date, {
        x: 460,
        y: 346,
        size: 8,
      });

      pages3[19].drawText(Speicher["Marke"].content, {
        x: 85,
        y: 556,
        size: 8,
      });
      pages3[19].drawText(Speicher["Modell"].content, {
        x: 211,
        y: 556,
        size: 8,
      });
      pages3[19].drawText(PVData["Speicher"].leistung, {
        x: 325,
        y: 556,
        size: 8,
      });
      pages3[21].drawText(date, {
        x: 100,
        y: 393,
        size: 8,
      });
      pages3[22].drawText(date, {
        x: 374,
        y: 140,
        size: 8,
      });

      pages3[22].drawText(
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
        {
          x: 107,
          y: 510,
          size: 8,
        }
      );
      pages3[22].drawText(PersonalData["Telefonnummer"].content, {
        x: 429,
        y: 510,
        size: 8,
      });

      await saveFiles(pdfsToSend, pathsAndFilenames).then(
        sendMailflexible(
          pathsAndFilenames,
          UploadedFilesToSend,
          UploadedFileSizes,
          PersonalData["Vorname"].content +
            " " +
            PersonalData["Nachname"].content,
          PersonalData["Steuer"].selectedValue,
          Modul,
          filesToDelete,
          attachmentSize
        ).then(() => {
          res.send(
            "Vielen Dank, Ihre Daten wurden erfolgreich übermittelt! Sie können das Portal jetzt verlassen!"
          );
        })
      );
    } else {
      attachmentSize = attachmentSize + 7500000;
      let pdfDoc3,
        filename3 =
          "Bozza Regolamento_" +
          PersonalData["Nachname"].content +
          "_" +
          PersonalData["Vorname"].content +
          ".pdf",
        path3 =
          "./Bozza Regolamento_" +
          PersonalData["Nachname"].content +
          "_" +
          PersonalData["Vorname"].content +
          ".pdf";
      pdfDoc3 = await PDFDocument.load(
        readFileSync(
          "./Backend/Documents/Bozza Regolamento_BT_LUSON_2024 sotto 11.pdf"
        )
      );
      const pages3 = pdfDoc3.getPages();
      pdfsToSend = pdfsToSend.concat([pdfDoc3]);
      pathsAndFilenames = pathsAndFilenames.concat([
        {
          filename: filename3,
          path: path3,
          contentType: "application/pdf",
        },
      ]);
      filesToDelete = filesToDelete.concat([filename3]);
      pages3[0].drawText(
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
        {
          x: 176,
          y: 550,
          size: 8,
        }
      );
      pages3[0].drawText(
        PersonalData["Geburtsort"].content + " " + Geburtsdatum,
        {
          x: 200,
          y: 531,
          size: 8,
        }
      );
      pages3[0].drawText(PersonalData["Steuernummer"].content, {
        x: 215,
        y: 513,
        size: 8,
      });
      pages3[0].drawText(PersonalData["Partita Iva"].content, {
        x: 388,
        y: 513,
        size: 8,
      });
      pages3[0].drawText(
        PersonalData["Straße"].content +
          " " +
          PersonalData["Hausnummer"].content,
        {
          x: 127,
          y: 495,
          size: 8,
        }
      );
      pages3[0].drawText(PersonalData["Fraktion"].content, {
        x: 453,
        y: 495,
        size: 8,
      });
      pages3[0].drawText(PersonalData["Wohnhaft in der Gemeinde"].content, {
        x: 125,
        y: 477,
        size: 8,
      });
      pages3[0].drawText(PersonalData["Postleitzahl"].content, {
        x: 408,
        y: 477,
        size: 8,
      });
      if (PersonalData["Privatperson"].selectedValue === "Ja") {
        pages3[0].drawLine({
          start: { x: 72, y: 419 },
          end: { x: 85, y: 430 },
        });
        pages3[0].drawLine({
          start: { x: 72, y: 430 },
          end: { x: 85, y: 419 },
        });
      } else {
        pages3[0].drawText("legale rappresentante", {
          x: 141,
          y: 381,
          size: 8,
        });
        pages3[0].drawText(PersonalData["Privatperson"].content, {
          x: 404,
          y: 364,
          size: 8,
        });
      }

      pages3[1].drawText(PVAdress["Straße"].content, {
        x: 78,
        y: 555,
        size: 8,
      });
      pages3[1].drawText(PVAdress["Nummer"].content, {
        x: 461,
        y: 555,
        size: 8,
      });
      pages3[1].drawText(PVAdress["Gemeinde"].content, {
        x: 78,
        y: 536,
        size: 8,
      });
      pages3[1].drawText(PVAdress["Postleitzahl"].content, {
        x: 386,
        y: 536,
        size: 8,
      });
      pages3[1].drawText(PVData["POD"].content, {
        x: 397,
        y: 500,
        size: 8,
      });
      pages3[1].drawText(
        PVData["Nennleistung der gesamten Inverter[kW]"].content,
        {
          x: 315,
          y: 418,
          size: 8,
        }
      );

      pages3[8].drawText(
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
        {
          x: 73,
          y: 414,
          size: 8,
        }
      );
      pages3[8].drawText(PersonalData["Telefonnummer"].content, {
        x: 369,
        y: 414,
        size: 8,
      });
      pages3[8].drawText(PersonalData["Email"].content, {
        x: 453,
        y: 414,
        size: 8,
      });

      if (PVData["Spannung der Anlage"].selectedValue === "Monofase") {
        pages3[11].drawText("230", {
          x: 323,
          y: 621,
          size: 8,
        });
      } else if (PVData["Spannung der Anlage"].selectedValue === "Trifase") {
        pages3[11].drawText("400", {
          x: 323,
          y: 621,
          size: 8,
        });
      }
      if (
        Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <
        Number(PVData["Spitzenleistung[kW]"].content)
      ) {
        pages3[11].drawText(
          PVData["Nennleistung der gesamten Inverter[kW]"].content,
          {
            x: 185,
            y: 560,
            size: 8,
          }
        );
      } else if (
        Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) >=
        Number(PVData["Spitzenleistung[kW]"].content)
      ) {
        pages3[11].drawText(PVData["Spitzenleistung[kW]"].content, {
          x: 185,
          y: 560,
          size: 8,
        });
      }

      pages3[12].drawText("Luson il " + date, {
        x: 140,
        y: 487,
        size: 8,
      });

      await saveFiles(pdfsToSend, pathsAndFilenames).then(
        sendMailflexible(
          pathsAndFilenames,
          UploadedFilesToSend,
          UploadedFileSizes,
          PersonalData["Vorname"].content +
            " " +
            PersonalData["Nachname"].content,
          PersonalData["Steuer"].selectedValue,
          Modul,
          filesToDelete,
          attachmentSize
        ).then(() => {
          res.send(
            "Vielen Dank, Ihre Daten wurden erfolgreich übermittelt! Sie können das Portal jetzt verlassen!"
          );
        })
      );
    }
  } else if (
    PVData["POD"].content.split("")[2] === "1" &&
    PVData["POD"].content.split("")[3] === "5" && //wenn Anlage in Vierschach
    PVData["POD"].content.split("")[4] === "9"
  ) {
    attachmentSize = attachmentSize + 2000000;
    let filename3 =
        "Domanda di Connessione Vierschach_" +
        PersonalData["Nachname"].content +
        "_" +
        PersonalData["Vorname"].content +
        ".pdf",
      path3 =
        "./Domanda di Connessione Vierschach_" +
        PersonalData["Nachname"].content +
        "_" +
        PersonalData["Vorname"].content +
        ".pdf";

    let pdfDoc3 = await PDFDocument.load(
      readFileSync("./Backend/Documents/Domanda di Connessione Vierschach.pdf")
    );
    const pages3 = pdfDoc3.getPages();
    filesToDelete = filesToDelete.concat([filename3]);

    pages3[1].drawText(
      PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
      {
        x: 95,
        y: 583,
        size: 8,
      }
    );
    pages3[1].drawText(PersonalData["Geburtsort"].content, {
      x: 144,
      y: 565,
      size: 8,
    });

    pages3[1].drawText(Geburtsdatum, {
      x: 415,
      y: 565,
      size: 8,
    });
    pages3[1].drawText(PersonalData["Steuernummer"].content, {
      x: 162,
      y: 548,
      size: 8,
    });
    pages3[1].drawText(
      PersonalData["Straße"].content + " " + PersonalData["Hausnummer"].content,
      {
        x: 183,
        y: 531,
        size: 8,
      }
    );
    pages3[1].drawText(PersonalData["Wohnhaft in der Gemeinde"].content, {
      x: 195,
      y: 515,
      size: 8,
    });
    if (PersonalData["Privatperson"].selectedValue !== "Ja") {
      pages3[1].drawText("legale rappresentante", {
        x: 156,
        y: 446,
        size: 8,
      });
      pages3[1].drawText(PersonalData["Privatperson"].content, {
        x: 292,
        y: 429,
        size: 8,
      });

      pages3[1].drawText(PersonalData["Partita Iva"].content, {
        x: 372,
        y: 394,
        size: 8,
      });
    }

    //pages3[2].drawText(date, {
    //  x: 95,
    //  y: 235,
    //  size: 8,
    //});

    pdfsToSend = pdfsToSend.concat([pdfDoc3]);
    pathsAndFilenames = pathsAndFilenames.concat([
      {
        filename: filename3,
        path: path3,
        contentType: "application/pdf",
      },
    ]);

    if (
      Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) > 11.08
    ) {
      attachmentSize = attachmentSize + 8000000;
      let filename2 =
          "Bozza Regolamento_BT_Vierschach_2024_" +
          PersonalData["Nachname"].content +
          "_" +
          PersonalData["Vorname"].content +
          ".pdf",
        path2 =
          "./Bozza Regolamento_BT_Vierschach_2024_" +
          PersonalData["Nachname"].content +
          "_" +
          PersonalData["Vorname"].content +
          ".pdf";

      let pdfDoc2 = await PDFDocument.load(
        readFileSync(
          "./Backend/Documents/Bozza Regolamento_BT_Vierschach_2024.pdf"
        )
      );
      const pages2 = pdfDoc2.getPages();
      filesToDelete = filesToDelete.concat([filename2]);
      pages2[0].drawText(
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
        {
          x: 176,
          y: 550,
          size: 8,
        }
      );
      pages2[0].drawText(
        PersonalData["Geburtsort"].content + " " + Geburtsdatum,
        {
          x: 200,
          y: 531,
          size: 8,
        }
      );
      pages2[0].drawText(PersonalData["Steuernummer"].content, {
        x: 215,
        y: 513,
        size: 8,
      });
      pages2[0].drawText(PersonalData["Partita Iva"].content, {
        x: 388,
        y: 513,
        size: 8,
      });
      pages2[0].drawText(
        PersonalData["Straße"].content +
          " " +
          PersonalData["Hausnummer"].content,
        {
          x: 127,
          y: 495,
          size: 8,
        }
      );
      pages2[0].drawText(PersonalData["Fraktion"].content, {
        x: 453,
        y: 495,
        size: 8,
      });
      pages2[0].drawText(PersonalData["Wohnhaft in der Gemeinde"].content, {
        x: 125,
        y: 477,
        size: 8,
      });
      pages2[0].drawText(PersonalData["Postleitzahl"].content, {
        x: 408,
        y: 477,
        size: 8,
      });
      if (PersonalData["Privatperson"].selectedValue === "Ja") {
        pages2[0].drawLine({
          start: { x: 72, y: 419 },
          end: { x: 85, y: 430 },
        });
        pages2[0].drawLine({
          start: { x: 72, y: 430 },
          end: { x: 85, y: 419 },
        });
      } else {
        pages2[0].drawText("legale rappresentante", {
          x: 141,
          y: 381,
          size: 8,
        });
        pages2[0].drawText(PersonalData["Privatperson"].content, {
          x: 404,
          y: 364,
          size: 8,
        });
      }

      pages2[1].drawText(PVAdress["Straße"].content, {
        x: 78,
        y: 555,
        size: 8,
      });
      pages2[1].drawText(PVAdress["Nummer"].content, {
        x: 461,
        y: 555,
        size: 8,
      });
      pages2[1].drawText(PVAdress["Gemeinde"].content, {
        x: 78,
        y: 536,
        size: 8,
      });
      pages2[1].drawText(PVAdress["Postleitzahl"].content, {
        x: 386,
        y: 536,
        size: 8,
      });
      pages2[1].drawText(PVData["POD"].content, {
        x: 397,
        y: 500,
        size: 8,
      });
      pages2[1].drawText(
        PVData["Nennleistung der gesamten Inverter[kW]"].content,
        {
          x: 315,
          y: 418,
          size: 8,
        }
      );

      pages2[8].drawText(
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
        {
          x: 73,
          y: 414,
          size: 8,
        }
      );
      pages2[8].drawText(PersonalData["Telefonnummer"].content, {
        x: 369,
        y: 414,
        size: 8,
      });
      pages2[8].drawText(PersonalData["Email"].content, {
        x: 453,
        y: 414,
        size: 8,
      });

      if (PVData["Spannung der Anlage"].selectedValue === "Monofase") {
        pages2[11].drawText("230", {
          x: 323,
          y: 621,
          size: 8,
        });
        pages2[13].drawLine({
          start: { x: 301, y: 220 },
          end: { x: 314, y: 232 },
        });
        pages2[13].drawLine({
          start: { x: 301, y: 232 },
          end: { x: 314, y: 220 },
        });
      } else if (PVData["Spannung der Anlage"].selectedValue === "Trifase") {
        pages2[11].drawText("400", {
          x: 323,
          y: 621,
          size: 8,
        });
        pages2[13].drawLine({
          start: { x: 386, y: 198 },
          end: { x: 398, y: 186 },
        });
        pages2[13].drawLine({
          start: { x: 386, y: 186 },
          end: { x: 398, y: 198 },
        });
      }
      if (
        Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <
        Number(PVData["Spitzenleistung[kW]"].content)
      ) {
        pages2[11].drawText(
          PVData["Nennleistung der gesamten Inverter[kW]"].content,
          {
            x: 298,
            y: 560,
            size: 8,
          }
        );
      } else if (
        Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) >=
        Number(PVData["Spitzenleistung[kW]"].content)
      ) {
        pages2[11].drawText(PVData["Spitzenleistung[kW]"].content, {
          x: 298,
          y: 560,
          size: 8,
        });
      }
      pages2[12].drawText("Versciaco il " + date, {
        x: 140,
        y: 474,
        size: 8,
      });

      pages2[13].drawText(
        PVData["Nennleistung der gesamten Inverter[kW]"].content,
        {
          x: 97,
          y: 149,
          size: 8,
        }
      );

      pages2[16].drawText(SPI["Marke"].content, {
        x: 197,
        y: 626,
        size: 8,
      });
      pages2[16].drawText(SPI["Modell"].content, {
        x: 142,
        y: 608,
        size: 8,
      });

      if (
        Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) > 11.08
      ) {
        pages2[16].drawLine({
          start: { x: 302, y: 567 },
          end: { x: 315, y: 580 },
        });
        pages2[16].drawLine({
          start: { x: 302, y: 580 },
          end: { x: 315, y: 567 },
        });
      } else if (
        Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <=
        11.08
      ) {
        pages2[16].drawLine({
          start: { x: 231, y: 567 },
          end: { x: 244, y: 580 },
        });
        pages2[16].drawLine({
          start: { x: 231, y: 580 },
          end: { x: 244, y: 567 },
        });
      }
      pages2[18].drawText(date, {
        x: 460,
        y: 346,
        size: 8,
      });

      pages2[19].drawText(Speicher["Marke"].content, {
        x: 85,
        y: 556,
        size: 8,
      });
      pages2[19].drawText(Speicher["Modell"].content, {
        x: 211,
        y: 556,
        size: 8,
      });
      pages2[19].drawText(PVData["Speicher"].leistung, {
        x: 325,
        y: 556,
        size: 8,
      });
      pages2[21].drawText(date, {
        x: 100,
        y: 393,
        size: 8,
      });
      pages2[22].drawText(date, {
        x: 374,
        y: 140,
        size: 8,
      });

      pages2[22].drawText(
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
        {
          x: 107,
          y: 510,
          size: 8,
        }
      );
      pages2[22].drawText(PersonalData["Telefonnummer"].content, {
        x: 429,
        y: 510,
        size: 8,
      });

      pdfsToSend = pdfsToSend.concat([pdfDoc2]);
      pathsAndFilenames = pathsAndFilenames.concat([
        {
          filename: filename2,
          path: path2,
          contentType: "application/pdf",
        },
      ]);
      await saveFiles(pdfsToSend, pathsAndFilenames).then(
        sendMailflexible(
          pathsAndFilenames,
          UploadedFilesToSend,
          UploadedFileSizes,
          PersonalData["Vorname"].content +
            " " +
            PersonalData["Nachname"].content,
          PersonalData["Steuer"].selectedValue,
          Modul,
          filesToDelete,
          attachmentSize
        ).then(() => {
          res.send(
            "Vielen Dank, Ihre Daten wurden erfolgreich übermittelt! Sie können das Portal jetzt verlassen!"
          );
        })
      );
    } else {
      attachmentSize = attachmentSize + 8000000;
      let filename2 =
          "Bozza Regolamento_BT_Vierschach_2024 sotto 11,08kW_" +
          PersonalData["Nachname"].content +
          "_" +
          PersonalData["Vorname"].content +
          ".pdf",
        path2 =
          "./Bozza Regolamento_BT_Vierschach_2024 sotto 11,08kW_" +
          PersonalData["Nachname"].content +
          "_" +
          PersonalData["Vorname"].content +
          ".pdf";

      let pdfDoc2 = await PDFDocument.load(
        readFileSync(
          "./Backend/Documents/Bozza Regolamento_BT_Vierschach_2024 sotto 11,08kW.pdf"
        )
      );
      const pages2 = pdfDoc2.getPages();
      filesToDelete = filesToDelete.concat([filename2]);

      pages2[0].drawText(
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
        {
          x: 176,
          y: 550,
          size: 8,
        }
      );
      pages2[0].drawText(
        PersonalData["Geburtsort"].content + " " + Geburtsdatum,
        {
          x: 200,
          y: 531,
          size: 8,
        }
      );
      pages2[0].drawText(PersonalData["Steuernummer"].content, {
        x: 215,
        y: 513,
        size: 8,
      });
      pages2[0].drawText(PersonalData["Partita Iva"].content, {
        x: 388,
        y: 513,
        size: 8,
      });
      pages2[0].drawText(
        PersonalData["Straße"].content +
          " " +
          PersonalData["Hausnummer"].content,
        {
          x: 127,
          y: 495,
          size: 8,
        }
      );
      pages2[0].drawText(PersonalData["Fraktion"].content, {
        x: 453,
        y: 495,
        size: 8,
      });
      pages2[0].drawText(PersonalData["Wohnhaft in der Gemeinde"].content, {
        x: 125,
        y: 477,
        size: 8,
      });
      pages2[0].drawText(PersonalData["Postleitzahl"].content, {
        x: 408,
        y: 477,
        size: 8,
      });
      if (PersonalData["Privatperson"].selectedValue === "Ja") {
        pages2[0].drawLine({
          start: { x: 72, y: 419 },
          end: { x: 85, y: 430 },
        });
        pages2[0].drawLine({
          start: { x: 72, y: 430 },
          end: { x: 85, y: 419 },
        });
      } else {
        pages2[0].drawText("legale rappresentante", {
          x: 141,
          y: 381,
          size: 8,
        });
        pages2[0].drawText(PersonalData["Privatperson"].content, {
          x: 404,
          y: 364,
          size: 8,
        });
      }

      pages2[1].drawText(PVAdress["Straße"].content, {
        x: 78,
        y: 538,
        size: 8,
      });
      pages2[1].drawText(PVAdress["Nummer"].content, {
        x: 460,
        y: 538,
        size: 8,
      });
      pages2[1].drawText(PVAdress["Gemeinde"].content, {
        x: 78,
        y: 519,
        size: 8,
      });
      pages2[1].drawText(PVAdress["Postleitzahl"].content, {
        x: 383,
        y: 519,
        size: 8,
      });
      pages2[1].drawText(PVData["POD"].content, {
        x: 397,
        y: 484,
        size: 8,
      });
      pages2[1].drawText(
        PVData["Nennleistung der gesamten Inverter[kW]"].content,
        {
          x: 315,
          y: 404,
          size: 8,
        }
      );

      pages2[8].drawText(
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
        {
          x: 73,
          y: 414,
          size: 8,
        }
      );
      pages2[8].drawText(PersonalData["Telefonnummer"].content, {
        x: 369,
        y: 414,
        size: 8,
      });
      pages2[8].drawText(PersonalData["Email"].content, {
        x: 453,
        y: 414,
        size: 8,
      });

      if (PVData["Spannung der Anlage"].selectedValue === "Monofase") {
        pages2[11].drawText("230", {
          x: 323,
          y: 621,
          size: 8,
        });
      } else if (PVData["Spannung der Anlage"].selectedValue === "Trifase") {
        pages2[11].drawText("400", {
          x: 323,
          y: 621,
          size: 8,
        });
      }
      if (
        Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <
        Number(PVData["Spitzenleistung[kW]"].content)
      ) {
        pages2[11].drawText(
          PVData["Nennleistung der gesamten Inverter[kW]"].content,
          {
            x: 319,
            y: 560,
            size: 8,
          }
        );
      } else if (
        Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) >=
        Number(PVData["Spitzenleistung[kW]"].content)
      ) {
        pages2[11].drawText(PVData["Spitzenleistung[kW]"].content, {
          x: 319,
          y: 560,
          size: 8,
        });
      }

      pages2[12].drawText("Versciaco il " + date, {
        x: 140,
        y: 477,
        size: 8,
      });

      pdfsToSend = pdfsToSend.concat([pdfDoc2]);
      pathsAndFilenames = pathsAndFilenames.concat([
        {
          filename: filename2,
          path: path2,
          contentType: "application/pdf",
        },
      ]);
      await saveFiles(pdfsToSend, pathsAndFilenames).then(
        sendMailflexible(
          pathsAndFilenames,
          UploadedFilesToSend,
          UploadedFileSizes,
          PersonalData["Vorname"].content +
            " " +
            PersonalData["Nachname"].content,
          PersonalData["Steuer"].selectedValue,
          Modul,
          filesToDelete,
          attachmentSize
        ).then(() => {
          res.send(
            "Vielen Dank, Ihre Daten wurden erfolgreich übermittelt! Sie können das Portal jetzt verlassen!"
          );
        })
      );
    }
  } else if (
    PVData["POD"].content.split("")[2] === "0" &&
    PVData["POD"].content.split("")[3] === "4" && //wenn Anlage in Gsies
    PVData["POD"].content.split("")[4] === "5"
  ) {
    attachmentSize = attachmentSize + 400000;
    let filename2 =
        "Regolamento_BT_AE Casies_2024 RDE_Formular_" +
        PersonalData["Nachname"].content +
        "_" +
        PersonalData["Vorname"].content +
        ".pdf",
      path2 =
        "./Regolamento_BT_AE Casies_2024 RDE_Formular_" +
        PersonalData["Nachname"].content +
        "_" +
        PersonalData["Vorname"].content +
        ".pdf";

    let pdfDoc2 = await PDFDocument.load(
      readFileSync(
        "./Backend/Documents/Regolamento_BT_AE Casies_2024 RDE_Formular.pdf"
      )
    );
    const pages2 = pdfDoc2.getPages();
    filesToDelete = filesToDelete.concat([filename2]);

    pages2[0].drawText(
      PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
      {
        x: 152,
        y: 592,
        size: 8,
      }
    );
    pages2[0].drawText(
      PersonalData["Geburtsort"].content + " " + Geburtsdatum,
      {
        x: 180,
        y: 574,
        size: 8,
      }
    );
    pages2[0].drawText(PersonalData["Steuernummer"].content, {
      x: 194,
      y: 557,
      size: 8,
    });
    pages2[0].drawText(
      PersonalData["Straße"].content + " " + PersonalData["Hausnummer"].content,
      {
        x: 109,
        y: 538,
        size: 8,
      }
    );
    pages2[0].drawText(PersonalData["Fraktion"].content, {
      x: 403,
      y: 538,
      size: 8,
    });
    pages2[0].drawText(PersonalData["Wohnhaft in der Gemeinde"].content, {
      x: 106,
      y: 519,
      size: 8,
    });
    pages2[0].drawText(PersonalData["Postleitzahl"].content, {
      x: 403,
      y: 519,
      size: 8,
    });
    if (PersonalData["Privatperson"].selectedValue === "Ja") {
      pages2[0].drawLine({
        start: { x: 57, y: 473 },
        end: { x: 68, y: 464 },
      });
      pages2[0].drawLine({
        start: { x: 57, y: 464 },
        end: { x: 68, y: 473 },
      });
    } else {
      pages2[0].drawText("legale rappresentante", {
        x: 120,
        y: 428,
        size: 8,
      });
      pages2[0].drawText(PersonalData["Privatperson"].content, {
        x: 380,
        y: 410,
        size: 8,
      });
    }

    pages2[0].drawText(PVAdress["Straße"].content, {
      x: 317,
      y: 231,
      size: 8,
    });
    pages2[0].drawText(PVAdress["Nummer"].content, {
      x: 57,
      y: 213,
      size: 8,
    });
    pages2[0].drawText(PVAdress["Gemeinde"].content, {
      x: 147,
      y: 213,
      size: 8,
    });
    pages2[0].drawText(PVAdress["Postleitzahl"].content, {
      x: 496,
      y: 213,
      size: 8,
    });
    pages2[0].drawText(PVData["POD"].content, {
      x: 382,
      y: 177,
      size: 8,
    });
    pages2[0].drawText(
      PVData["Nennleistung der gesamten Inverter[kW]"].content,
      {
        x: 298,
        y: 94,
        size: 8,
      }
    );

    pages2[6].drawText(
      PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
      {
        x: 65,
        y: 228,
        size: 8,
      }
    );
    pages2[6].drawText(PersonalData["Telefonnummer"].content, {
      x: 358,
      y: 228,
      size: 8,
    });
    pages2[6].drawText(PersonalData["Email"].content, {
      x: 442,
      y: 228,
      size: 8,
    });
    pages2[6].drawText(
      PersonalDataEl["Vorname"].content +
        " " +
        PersonalDataEl["Nachname"].content,
      {
        x: 65,
        y: 200,
        size: 8,
      }
    );
    pages2[6].drawText(PersonalDataEl["Telefonnummer"].content, {
      x: 358,
      y: 200,
      size: 8,
    });
    pages2[6].drawText(PersonalDataEl["Email"].content, {
      x: 442,
      y: 200,
      size: 8,
    });

    if (PVData["Spannung der Anlage"].selectedValue === "Monofase") {
      pages2[8].drawText("230", {
        x: 309,
        y: 139,
        size: 8,
      });
      pages2[10].drawLine({
        start: { x: 287, y: 293 },
        end: { x: 297, y: 283 },
      });
      pages2[10].drawLine({
        start: { x: 287, y: 283 },
        end: { x: 297, y: 293 },
      });
    } else if (PVData["Spannung der Anlage"].selectedValue === "Trifase") {
      pages2[8].drawText("400", {
        x: 309,
        y: 139,
        size: 8,
      });
      pages2[10].drawLine({
        start: { x: 380, y: 293 },
        end: { x: 390, y: 283 },
      });
      pages2[10].drawLine({
        start: { x: 380, y: 283 },
        end: { x: 390, y: 293 },
      });
    }
    if (
      Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <
      Number(PVData["Spitzenleistung[kW]"].content)
    ) {
      pages2[9].drawText(
        PVData["Nennleistung der gesamten Inverter[kW]"].content,
        {
          x: 136,
          y: 661,
          size: 8,
        }
      );
    } else if (
      Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) >=
      Number(PVData["Spitzenleistung[kW]"].content)
    ) {
      pages2[9].drawText(PVData["Spitzenleistung[kW]"].content, {
        x: 136,
        y: 661,
        size: 8,
      });
    }

    pages2[10].drawText(
      PVData["Nennleistung der gesamten Inverter[kW]"].content,
      {
        x: 76,
        y: 248,
        size: 8,
      }
    );

    pages2[13].drawText(SPI["Marke"].content, {
      x: 184,
      y: 398,
      size: 8,
    });
    pages2[13].drawText(SPI["Modell"].content, {
      x: 123,
      y: 379,
      size: 8,
    });

    if (
      Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) > 11.08
    ) {
      pages2[13].drawLine({
        start: { x: 296, y: 352 },
        end: { x: 308, y: 340 },
      });
      pages2[13].drawLine({
        start: { x: 296, y: 340 },
        end: { x: 308, y: 352 },
      });
    } else if (
      Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <= 11.08
    ) {
      pages2[13].drawLine({
        start: { x: 217, y: 352 },
        end: { x: 230, y: 340 },
      });
      pages2[13].drawLine({
        start: { x: 217, y: 340 },
        end: { x: 230, y: 352 },
      });
    }

    pages2[12].drawText(Speicher["Marke"].content, {
      x: 79,
      y: 350,
      size: 8,
    });
    pages2[12].drawText(Speicher["Modell"].content, {
      x: 169,
      y: 350,
      size: 6,
    });
    pages2[12].drawText(PVData["Speicher"].leistung, {
      x: 259,
      y: 350,
      size: 8,
    });
    pages2[12].drawText(PVData["Speicher"].leistung, {
      x: 340,
      y: 350,
      size: 8,
    });
    pages2[12].drawText(PVData["Speicher"].content, {
      x: 407,
      y: 350,
      size: 8,
    });

    pages2[18].drawText(
      PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
      {
        x: 94,
        y: 546,
        size: 8,
      }
    );
    pages2[18].drawText(PersonalData["Telefonnummer"].content, {
      x: 410,
      y: 546,
      size: 8,
    });

    pages2[18].drawText(
      PersonalDataEl["Vorname"].content +
        " " +
        PersonalDataEl["Nachname"].content,
      {
        x: 94,
        y: 582,
        size: 8,
      }
    );
    pages2[18].drawText(PersonalDataEl["Telefonnummer"].content, {
      x: 411,
      y: 582,
      size: 8,
    });

    pdfsToSend = pdfsToSend.concat([pdfDoc2]);
    pathsAndFilenames = pathsAndFilenames.concat([
      {
        filename: filename2,
        path: path2,
        contentType: "application/pdf",
      },
    ]);
    await saveFiles(pdfsToSend, pathsAndFilenames).then(
      sendMailflexible(
        pathsAndFilenames,
        UploadedFilesToSend,
        UploadedFileSizes,
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
        PersonalData["Steuer"].selectedValue,
        Modul,
        filesToDelete,
        attachmentSize
      ).then(() => {
        res.send(
          "Vielen Dank, Ihre Daten wurden erfolgreich übermittelt! Sie können das Portal jetzt verlassen!"
        );
      })
    );
  } else if (
    PVData["POD"].content.split("")[2] === "0" &&
    PVData["POD"].content.split("")[3] === "5" && //wenn Anlage in Kiens
    PVData["POD"].content.split("")[4] === "0"
  ) {
    attachmentSize = attachmentSize + 600000;
    let filename2 =
        "Bozza Regolamento_Azienda Elettrica Chienes_2022_" +
        PersonalData["Nachname"].content +
        "_" +
        PersonalData["Vorname"].content +
        ".pdf",
      path2 =
        "./Bozza Regolamento_Azienda Elettrica Chienes_2022_" +
        PersonalData["Nachname"].content +
        "_" +
        PersonalData["Vorname"].content +
        ".pdf";

    let pdfDoc2 = await PDFDocument.load(
      readFileSync(
        "./Backend/Documents/Bozza Regolamento_Azienda Elettrica Chienes_2022.pdf"
      )
    );
    const pages2 = pdfDoc2.getPages();
    filesToDelete = filesToDelete.concat([filename2]);

    pages2[0].drawText(
      PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
      {
        x: 173,
        y: 584,
        size: 8,
      }
    );
    pages2[0].drawText(
      PersonalData["Geburtsort"].content + " " + Geburtsdatum,
      {
        x: 198,
        y: 566,
        size: 8,
      }
    );
    pages2[0].drawText(PersonalData["Steuernummer"].content, {
      x: 212,
      y: 548,
      size: 8,
    });
    pages2[0].drawText(PersonalData["Partita Iva"].content, {
      x: 398,
      y: 548,
      size: 8,
    });
    pages2[0].drawText(
      PersonalData["Straße"].content + " " + PersonalData["Hausnummer"].content,
      {
        x: 125,
        y: 530,
        size: 8,
      }
    );
    pages2[0].drawText(PersonalData["Fraktion"].content, {
      x: 452,
      y: 530,
      size: 8,
    });
    pages2[0].drawText(PersonalData["Wohnhaft in der Gemeinde"].content, {
      x: 122,
      y: 511,
      size: 8,
    });
    pages2[0].drawText(PersonalData["Postleitzahl"].content, {
      x: 408,
      y: 511,
      size: 8,
    });
    if (PersonalData["Privatperson"].selectedValue === "Ja") {
      pages2[0].drawLine({
        start: { x: 72, y: 465 },
        end: { x: 85, y: 453 },
      });
      pages2[0].drawLine({
        start: { x: 72, y: 453 },
        end: { x: 85, y: 465 },
      });
    } else {
      pages2[0].drawText("legale rappresentante", {
        x: 141,
        y: 417,
        size: 8,
      });
      pages2[0].drawText(PersonalData["Privatperson"].content, {
        x: 397,
        y: 398,
        size: 8,
      });
    }

    pages2[1].drawText(PVAdress["Straße"].content, {
      x: 73,
      y: 573,
      size: 8,
    });
    pages2[1].drawText(PVAdress["Nummer"].content, {
      x: 458,
      y: 573,
      size: 8,
    });
    pages2[1].drawText(PVAdress["Gemeinde"].content, {
      x: 72,
      y: 554,
      size: 8,
    });
    pages2[1].drawText(PVAdress["Postleitzahl"].content, {
      x: 383,
      y: 555,
      size: 8,
    });
    pages2[1].drawText(PVData["POD"].content, {
      x: 396,
      y: 518,
      size: 8,
    });
    pages2[1].drawText(
      PVData["Nennleistung der gesamten Inverter[kW]"].content,
      {
        x: 312,
        y: 436,
        size: 8,
      }
    );

    pages2[7].drawText(
      PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
      {
        x: 71,
        y: 403,
        size: 8,
      }
    );
    pages2[7].drawText(PersonalData["Telefonnummer"].content, {
      x: 364,
      y: 403,
      size: 8,
    });
    pages2[7].drawText(PersonalData["Email"].content, {
      x: 448,
      y: 403,
      size: 8,
    });
    pages2[7].drawText(
      PersonalDataEl["Vorname"].content +
        " " +
        PersonalDataEl["Nachname"].content,
      {
        x: 71,
        y: 375,
        size: 8,
      }
    );
    pages2[7].drawText(PersonalDataEl["Telefonnummer"].content, {
      x: 364,
      y: 375,
      size: 8,
    });
    pages2[7].drawText(PersonalDataEl["Email"].content, {
      x: 448,
      y: 375,
      size: 8,
    });

    if (PVData["Spannung der Anlage"].selectedValue === "Monofase") {
      pages2[10].drawText("230", {
        x: 323,
        y: 582,
        size: 8,
      });
      pages2[13].drawLine({
        start: { x: 301, y: 651 },
        end: { x: 314, y: 638 },
      });
      pages2[13].drawLine({
        start: { x: 301, y: 638 },
        end: { x: 314, y: 651 },
      });
    } else if (PVData["Spannung der Anlage"].selectedValue === "Trifase") {
      pages2[10].drawText("400", {
        x: 323,
        y: 582,
        size: 8,
      });
      pages2[13].drawLine({
        start: { x: 389, y: 651 },
        end: { x: 402, y: 638 },
      });
      pages2[13].drawLine({
        start: { x: 389, y: 638 },
        end: { x: 402, y: 651 },
      });
    }
    if (
      Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <
      Number(PVData["Spitzenleistung[kW]"].content)
    ) {
      pages2[10].drawText(
        PVData["Nennleistung der gesamten Inverter[kW]"].content,
        {
          x: 118,
          y: 521,
          size: 8,
        }
      );
    } else if (
      Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) >=
      Number(PVData["Spitzenleistung[kW]"].content)
    ) {
      pages2[10].drawText(PVData["Spitzenleistung[kW]"].content, {
        x: 118,
        y: 521,
        size: 8,
      });
    }

    pages2[13].drawText(
      PVData["Nennleistung der gesamten Inverter[kW]"].content,
      {
        x: 90,
        y: 602,
        size: 8,
      }
    );

    pages2[15].drawText(SPI["Marke"].content, {
      x: 200,
      y: 327,
      size: 8,
    });
    pages2[15].drawText(SPI["Modell"].content, {
      x: 141,
      y: 308,
      size: 8,
    });

    if (
      Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) > 11.08
    ) {
      pages2[15].drawLine({
        start: { x: 303, y: 280 },
        end: { x: 315, y: 268 },
      });
      pages2[15].drawLine({
        start: { x: 303, y: 268 },
        end: { x: 315, y: 280 },
      });
    } else if (
      Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <= 11.08
    ) {
      pages2[15].drawLine({
        start: { x: 231, y: 280 },
        end: { x: 244, y: 268 },
      });
      pages2[15].drawLine({
        start: { x: 231, y: 268 },
        end: { x: 244, y: 280 },
      });
    }

    pages2[18].drawText(Speicher["Marke"].content, {
      x: 79,
      y: 591,
      size: 8,
    });
    pages2[18].drawText(Speicher["Modell"].content, {
      x: 207,
      y: 591,
      size: 8,
    });
    pages2[18].drawText(PVData["Speicher"].leistung, {
      x: 322,
      y: 591,
      size: 8,
    });

    pages2[21].drawText(
      PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
      {
        x: 109,
        y: 545,
        size: 8,
      }
    );
    pages2[21].drawText(PersonalData["Telefonnummer"].content, {
      x: 428,
      y: 545,
      size: 8,
    });

    pages2[21].drawText(
      PersonalDataEl["Vorname"].content +
        " " +
        PersonalDataEl["Nachname"].content,
      {
        x: 109,
        y: 580,
        size: 8,
      }
    );
    pages2[21].drawText(PersonalDataEl["Telefonnummer"].content, {
      x: 428,
      y: 580,
      size: 8,
    });

    pdfsToSend = pdfsToSend.concat([pdfDoc2]);
    pathsAndFilenames = pathsAndFilenames.concat([
      {
        filename: filename2,
        path: path2,
        contentType: "application/pdf",
      },
    ]);
    await saveFiles(pdfsToSend, pathsAndFilenames).then(
      sendMailflexible(
        pathsAndFilenames,
        UploadedFilesToSend,
        UploadedFileSizes,
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
        PersonalData["Steuer"].selectedValue,
        Modul,
        filesToDelete,
        attachmentSize
      ).then(() => {
        res.send(
          "Vielen Dank, Ihre Daten wurden erfolgreich übermittelt! Sie können das Portal jetzt verlassen!"
        );
      })
    );
  } else if (
    PVData["POD"].content.split("")[2] === "0" &&
    PVData["POD"].content.split("")[3] === "5" && //wenn Anlage in Toblach
    PVData["POD"].content.split("")[4] === "5"
  ) {
    attachmentSize = attachmentSize + 600000;
    let filename2 =
        "Bozza Regolamento_BT_Toblach_2022-1_" +
        PersonalData["Nachname"].content +
        "_" +
        PersonalData["Vorname"].content +
        ".pdf",
      path2 =
        "./Bozza Regolamento_BT_Toblach_2022-1_" +
        PersonalData["Nachname"].content +
        "_" +
        PersonalData["Vorname"].content +
        ".pdf";

    let pdfDoc2 = await PDFDocument.load(
      readFileSync(
        "./Backend/Documents/Bozza Regolamento_BT_Toblach_2022-1.pdf"
      )
    );
    const pages2 = pdfDoc2.getPages();
    filesToDelete = filesToDelete.concat([filename2]);

    pages2[0].drawText(
      PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
      {
        x: 177,
        y: 556,
        size: 8,
      }
    );
    pages2[0].drawText(
      PersonalData["Geburtsort"].content + " " + Geburtsdatum,
      {
        x: 200,
        y: 539,
        size: 8,
      }
    );
    pages2[0].drawText(PersonalData["Steuernummer"].content, {
      x: 214,
      y: 521,
      size: 8,
    });
    pages2[0].drawText(PersonalData["Partita Iva"].content, {
      x: 404,
      y: 521,
      size: 8,
    });
    pages2[0].drawText(
      PersonalData["Straße"].content + " " + PersonalData["Hausnummer"].content,
      {
        x: 136,
        y: 502,
        size: 8,
      }
    );
    pages2[0].drawText(PersonalData["Fraktion"].content, {
      x: 455,
      y: 502,
      size: 8,
    });
    pages2[0].drawText(PersonalData["Wohnhaft in der Gemeinde"].content, {
      x: 135,
      y: 483,
      size: 8,
    });
    pages2[0].drawText(PersonalData["Postleitzahl"].content, {
      x: 410,
      y: 483,
      size: 8,
    });
    pages2[0].drawText(
      PersonalData["Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"]
        .content,
      {
        x: 523,
        y: 483,
        size: 8,
      }
    );
    if (PersonalData["Privatperson"].selectedValue === "Ja") {
      pages2[0].drawLine({
        start: { x: 72, y: 424 },
        end: { x: 85, y: 437 },
      });
      pages2[0].drawLine({
        start: { x: 72, y: 437 },
        end: { x: 85, y: 424 },
      });
    } else {
      pages2[0].drawText("legale rappresentante", {
        x: 152,
        y: 388,
        size: 8,
      });
      pages2[0].drawText(PersonalData["Privatperson"].content, {
        x: 402,
        y: 370,
        size: 8,
      });
    }

    pages2[1].drawText(PVAdress["Straße"].content, {
      x: 77,
      y: 546,
      size: 8,
    });
    pages2[1].drawText(PVAdress["Nummer"].content, {
      x: 459,
      y: 545,
      size: 8,
    });
    pages2[1].drawText(PVAdress["Gemeinde"].content, {
      x: 77,
      y: 527,
      size: 8,
    });
    pages2[1].drawText(PVAdress["Postleitzahl"].content, {
      x: 388,
      y: 527,
      size: 8,
    });
    pages2[1].drawText(PVData["POD"].content, {
      x: 408,
      y: 492,
      size: 8,
    });
    pages2[1].drawText(
      PVData["Nennleistung der gesamten Inverter[kW]"].content,
      {
        x: 317,
        y: 413,
        size: 8,
      }
    );

    pages2[7].drawText(
      PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
      {
        x: 75,
        y: 190,
        size: 8,
      }
    );
    pages2[7].drawText(PersonalData["Telefonnummer"].content, {
      x: 365,
      y: 190,
      size: 8,
    });
    pages2[7].drawText(PersonalData["Email"].content, {
      x: 450,
      y: 190,
      size: 8,
    });

    if (PVData["Spannung der Anlage"].selectedValue === "Monofase") {
      pages2[10].drawText("230", {
        x: 325,
        y: 469,
        size: 8,
      });
      pages2[12].drawLine({
        start: { x: 301, y: 235 },
        end: { x: 314, y: 248 },
      });
      pages2[12].drawLine({
        start: { x: 301, y: 248 },
        end: { x: 314, y: 235 },
      });
    } else if (PVData["Spannung der Anlage"].selectedValue === "Trifase") {
      pages2[10].drawText("400", {
        x: 325,
        y: 469,
        size: 8,
      });
      pages2[12].drawLine({
        start: { x: 389, y: 235 },
        end: { x: 402, y: 248 },
      });
      pages2[12].drawLine({
        start: { x: 389, y: 248 },
        end: { x: 402, y: 235 },
      });
    }
    if (
      Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <
      Number(PVData["Spitzenleistung[kW]"].content)
    ) {
      pages2[10].drawText(
        PVData["Nennleistung der gesamten Inverter[kW]"].content,
        {
          x: 215,
          y: 409,
          size: 8,
        }
      );
    } else if (
      Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) >=
      Number(PVData["Spitzenleistung[kW]"].content)
    ) {
      pages2[10].drawText(PVData["Spitzenleistung[kW]"].content, {
        x: 215,
        y: 409,
        size: 8,
      });
    }

    pages2[12].drawText(
      PVData["Nennleistung der gesamten Inverter[kW]"].content,
      {
        x: 94,
        y: 200,
        size: 8,
      }
    );

    pages2[15].drawText(SPI["Marke"].content, {
      x: 207,
      y: 633,
      size: 6,
    });
    pages2[15].drawText(SPI["Modell"].content, {
      x: 150,
      y: 615,
      size: 6,
    });

    if (
      Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) > 11.08
    ) {
      pages2[15].drawLine({
        start: { x: 303, y: 574 },
        end: { x: 316, y: 587 },
      });
      pages2[15].drawLine({
        start: { x: 303, y: 587 },
        end: { x: 316, y: 574 },
      });
    } else if (
      Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <= 11.08
    ) {
      pages2[15].drawLine({
        start: { x: 231, y: 574 },
        end: { x: 244, y: 587 },
      });
      pages2[15].drawLine({
        start: { x: 231, y: 587 },
        end: { x: 244, y: 574 },
      });
    }

    pages2[18].drawText(Speicher["Marke"].content, {
      x: 80,
      y: 563,
      size: 6,
    });
    pages2[18].drawText(Speicher["Modell"].content, {
      x: 208,
      y: 563,
      size: 6,
    });
    pages2[18].drawText(PVData["Speicher"].leistung, {
      x: 325,
      y: 563,
      size: 6,
    });

    pages2[21].drawText(
      PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
      {
        x: 112,
        y: 518,
        size: 8,
      }
    );
    pages2[21].drawText(PersonalData["Telefonnummer"].content, {
      x: 429,
      y: 518,
      size: 8,
    });

    pdfsToSend = pdfsToSend.concat([pdfDoc2]);
    pathsAndFilenames = pathsAndFilenames.concat([
      {
        filename: filename2,
        path: path2,
        contentType: "application/pdf",
      },
    ]);
    await saveFiles(pdfsToSend, pathsAndFilenames).then(
      sendMailflexible(
        pathsAndFilenames,
        UploadedFilesToSend,
        UploadedFileSizes,
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
        PersonalData["Steuer"].selectedValue,
        Modul,
        filesToDelete,
        attachmentSize
      ).then(() => {
        res.send(
          "Vielen Dank, Ihre Daten wurden erfolgreich übermittelt! Sie können das Portal jetzt verlassen!"
        );
      })
    );
  } else {
    //wenn Anlage von EDYNA
    if (
      Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) > 11.08
    ) {
      attachmentSize = attachmentSize + 350000 + 3000000;
      let filename2 =
          "Delega_mandato_di_rappresentanza_Unificato_TICA_" +
          PersonalData["Nachname"].content +
          "_" +
          PersonalData["Vorname"].content +
          ".pdf",
        path2 =
          "./Delega_mandato_di_rappresentanza_Unificato_TICA_" +
          PersonalData["Nachname"].content +
          "_" +
          PersonalData["Vorname"].content +
          ".pdf";
      let filename3 =
          "Regolamento_di_Esercizio_BT_ab-11,08_" +
          PersonalData["Nachname"].content +
          "_" +
          PersonalData["Vorname"].content +
          ".pdf",
        path3 =
          "./Regolamento_di_Esercizio_BT_ab-11,08_" +
          PersonalData["Nachname"].content +
          "_" +
          PersonalData["Vorname"].content +
          ".pdf";

      let pdfDoc2 = await PDFDocument.load(
        readFileSync(
          "./Backend/Documents/Delega_mandato_di_rappresentanza_Unificato_TICA.pdf"
        )
      );
      const pages2 = pdfDoc2.getPages();

      let pdfDoc3 = await PDFDocument.load(
        readFileSync(
          "./Backend/Documents/Regolamento_di_Esercizio_BT_ab-11,08.pdf"
        )
      );
      const pages3 = pdfDoc3.getPages();
      filesToDelete = filesToDelete.concat([filename2, filename3]);

      pages2[0].drawText(PersonalData["Vorname"].content, {
        x: 90,
        y: 644,
        size: 9,
      });
      pages2[0].drawText(PersonalData["Nachname"].content, {
        x: 300,
        y: 644,
        size: 9,
      });
      pages2[0].drawText(PersonalData["Geburtsort"].content, {
        x: 90,
        y: 625,
        size: 9,
      });
      pages2[0].drawText(Geburtsdatum, {
        x: 201,
        y: 625,
        size: 9,
      });
      pages2[0].drawText(PersonalData["Steuernummer"].content, {
        x: 120,
        y: 605,
        size: 9,
      });
      pages2[0].drawText(PersonalData["Straße"].content, {
        x: 350,
        y: 605,
        size: 9,
      });
      pages2[0].drawText(PersonalData["Wohnhaft in der Gemeinde"].content, {
        x: 95,
        y: 585,
        size: 9,
      });
      pages2[0].drawText(PersonalData["Postleitzahl"].content, {
        x: 280,
        y: 585,
        size: 9,
      });
      pages2[0].drawText(
        PersonalData[
          "Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"
        ].content,
        {
          x: 379,
          y: 585,
          size: 9,
        }
      );
      if (PersonalData["Privatperson"].selectedValue !== "Ja") {
        pages2[0].drawText(PersonalData["Privatperson"].content, {
          x: 150,
          y: 471,
          size: 9,
        });
        pages2[0].drawText(PersonalData["Partita Iva"].content, {
          x: 379,
          y: 471,
          size: 9,
        });
      }
      pages2[2].drawText(date, {
        x: 80,
        y: 207,
        size: 9,
      });
      pages3[0].drawText(
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
        {
          x: 131,
          y: 656,
          size: 8,
        }
      );

      pages3[0].drawText(
        PersonalData["Geburtsort"].content + "    " + Geburtsdatum,
        {
          x: 171,
          y: 620,
          size: 8,
        }
      );
      pages3[0].drawText(
        PersonalData["Steuernummer"].content +
          "       " +
          PersonalData["Partita Iva"].content,
        {
          x: 171,
          y: 590,
          size: 8,
        }
      );
      pages3[0].drawText(
        PersonalData["Straße"].content +
          " " +
          PersonalData["Hausnummer"].content,
        {
          x: 99,
          y: 550,
          size: 8,
        }
      );
      pages3[0].drawText(PersonalData["Fraktion"].content, {
        x: 337,
        y: 549,
        size: 8,
      });
      pages3[0].drawText(PersonalData["Wohnhaft in der Gemeinde"].content, {
        x: 74,
        y: 517,
        size: 8,
      });
      pages3[0].drawText(
        PersonalData[
          "Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"
        ].content,
        {
          x: 321,
          y: 517,
          size: 8,
        }
      );
      pages3[0].drawText(PersonalData["Postleitzahl"].content, {
        x: 406,
        y: 517,
        size: 8,
      });

      pages3[2].drawText(PVData["Name PV-Anlage"].content, {
        x: 156,
        y: 746,
        size: 8,
      });
      pages3[2].drawText(
        PVAdress["Straße"].content + " " + PVAdress["Nummer"].content,
        {
          x: 96,
          y: 724,
          size: 8,
        }
      );
      pages3[2].drawText(PVAdress["Gemeinde"].content, {
        x: 92,
        y: 703,
        size: 8,
      });
      pages3[2].drawText(PVAdress["Postleitzahl"].content, {
        x: 436,
        y: 703,
        size: 8,
      });
      pages3[2].drawText(PVData["POD"].content, {
        x: 343,
        y: 682,
        size: 8,
      });
      if (PVData["Spannung der Anlage"].selectedValue === "Monofase") {
        pages3[2].drawLine({
          start: { x: 289, y: 664 },
          end: { x: 297, y: 673 },
        });
        pages3[2].drawLine({
          start: { x: 289, y: 673 },
          end: { x: 297, y: 664 },
        });
      } else if (PVData["Spannung der Anlage"].selectedValue === "Trifase") {
        pages3[2].drawLine({
          start: { x: 426, y: 664 },
          end: { x: 434, y: 673 },
        });
        pages3[2].drawLine({
          start: { x: 426, y: 673 },
          end: { x: 434, y: 664 },
        });
      }

      pages3[2].drawText(
        PVData["Nennleistung der gesamten Inverter[kW]"].content,
        {
          x: 388,
          y: 622,
          size: 8,
        }
      );
      pages3[5].drawText(PersonalData["Vorname"].content, {
        x: 67,
        y: 689,
        size: 8,
      });
      pages3[5].drawText(PersonalData["Nachname"].content, {
        x: 284,
        y: 689,
        size: 8,
      });
      pages3[5].drawText(PersonalData["Geburtsort"].content, {
        x: 71,
        y: 670,
        size: 8,
      });
      pages3[5].drawText(Geburtsdatum, {
        x: 438,
        y: 670,
        size: 8,
      });
      pages3[5].drawText(PersonalData["Steuernummer"].content, {
        x: 113,
        y: 652,
        size: 8,
      });
      pages3[5].drawText(
        PersonalData["Straße"].content +
          " " +
          PersonalData["Hausnummer"].content,
        {
          x: 114,
          y: 634,
          size: 8,
        }
      );
      pages3[5].drawText(PersonalData["Wohnhaft in der Gemeinde"].content, {
        x: 85,
        y: 616,
        size: 8,
      });
      pages3[5].drawText(
        PersonalData[
          "Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"
        ].content,
        {
          x: 305,
          y: 616,
          size: 8,
        }
      );
      pages3[5].drawText(PersonalData["Postleitzahl"].content, {
        x: 445,
        y: 616,
        size: 8,
      });
      pages3[5].drawText(PVAdress["Straße"].content, {
        x: 89,
        y: 568,
        size: 8,
      });
      pages3[5].drawText(PVAdress["Nummer"].content, {
        x: 471,
        y: 568,
        size: 8,
      });
      pages3[5].drawText(PVAdress["Gemeinde"].content, {
        x: 82,
        y: 550,
        size: 8,
      });
      pages3[5].drawText(
        PVAdress["Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"]
          .content,
        {
          x: 305,
          y: 550,
          size: 8,
        }
      );
      pages3[5].drawText(PVAdress["Postleitzahl"].content, {
        x: 447,
        y: 550,
        size: 8,
      });
      pages3[5].drawText(PVData["POD"].content, {
        x: 346,
        y: 533,
        size: 8,
      });
      pages3[5].drawText(
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
        {
          x: 141,
          y: 482,
          size: 8,
        }
      );
      pages3[5].drawText(
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
        {
          x: 141,
          y: 375,
          size: 8,
        }
      );
      pages3[5].drawText(
        PersonalDataEl["Vorname"].content +
          " " +
          PersonalDataEl["Nachname"].content,
        {
          x: 141,
          y: 428,
          size: 8,
        }
      );
      pages3[5].drawText(
        PersonalDataEl["Vorname"].content +
          " " +
          PersonalDataEl["Nachname"].content,
        {
          x: 141,
          y: 319,
          size: 8,
        }
      );
      pages3[5].drawText(PersonalData["Telefonnummer"].content, {
        x: 383,
        y: 482,
        size: 8,
      });
      pages3[5].drawText(PersonalData["Telefonnummer"].content, {
        x: 383,
        y: 375,
        size: 8,
      });
      pages3[5].drawText(PersonalDataEl["Telefonnummer"].content, {
        x: 383,
        y: 430,
        size: 8,
      });
      pages3[5].drawText(PersonalDataEl["Telefonnummer"].content, {
        x: 383,
        y: 325,
        size: 8,
      });
      pages3[5].drawText(PersonalData["Email"].content, {
        x: 313,
        y: 464,
        size: 8,
      });
      pages3[5].drawText(PersonalData["Email"].content, {
        x: 313,
        y: 357,
        size: 8,
      });
      pages3[5].drawText(PersonalDataEl["Email"].content, {
        x: 313,
        y: 411,
        size: 8,
      });
      pages3[5].drawText(PersonalDataEl["Email"].content, {
        x: 313,
        y: 302,
        size: 8,
      });
      pages3[5].drawText(date, {
        x: 67,
        y: 129,
        size: 8,
      });
      pages3[9].drawText(date, {
        x: 423,
        y: 82,
        size: 8,
      });
      pages3[11].drawText(date, {
        x: 66,
        y: 149,
        size: 8,
      });
      pages3[12].drawText(
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
        {
          x: 140,
          y: 683,
          size: 8,
        }
      );
      pages3[12].drawText(
        PersonalData["Geburtsort"].content + "     " + Geburtsdatum,
        {
          x: 178,
          y: 662,
          size: 8,
        }
      );
      pages3[12].drawText(
        PersonalData["Steuernummer"].content +
          "     " +
          PersonalData["Partita Iva"].content,
        {
          x: 177,
          y: 639,
          size: 8,
        }
      );
      pages3[12].drawText(
        PersonalData["Straße"].content +
          "     " +
          PersonalData["Hausnummer"].content,
        {
          x: 109,
          y: 609,
          size: 8,
        }
      );

      pages3[12].drawText(PersonalData["Fraktion"].content, {
        x: 341,
        y: 608,
        size: 8,
      });
      pages3[12].drawText(PersonalData["Postleitzahl"].content, {
        x: 407,
        y: 586,
        size: 8,
      });
      pages3[12].drawText(PersonalData["Wohnhaft in der Gemeinde"].content, {
        x: 87,
        y: 586,
        size: 8,
      });
      pages3[12].drawText(
        PersonalData[
          "Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"
        ].content,
        {
          x: 324,
          y: 586,
          size: 8,
        }
      );
      pages3[12].drawText(PVData["POD"].content, {
        x: 349,
        y: 480,
        size: 8,
      });
      pages3[12].drawText(
        PVAdress["Straße"].content + " " + PVAdress["Nummer"].content,
        {
          x: 115,
          y: 520,
          size: 8,
        }
      );
      pages3[12].drawText(PVAdress["Postleitzahl"].content, {
        x: 450,
        y: 500,
        size: 8,
      });
      pages3[12].drawText(PVAdress["Gemeinde"].content, {
        x: 114,
        y: 500,
        size: 8,
      });
      pages3[12].drawText(
        PVData["Nennleistung der gesamten Inverter[kW]"].content,
        {
          x: 400,
          y: 443,
          size: 8,
        }
      );

      if (
        Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <
        Number(PVData["Spitzenleistung[kW]"].content)
      ) {
        pages3[12].drawText(
          PVData["Nennleistung der gesamten Inverter[kW]"].content,
          {
            x: 232,
            y: 412,
            size: 8,
          }
        );
      } else if (
        Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) >=
        Number(PVData["Spitzenleistung[kW]"].content)
      ) {
        pages3[12].drawText(PVData["Spitzenleistung[kW]"].content, {
          x: 232,
          y: 412,
          size: 8,
        });
      }
      pages3[12].drawText(date, {
        x: 90,
        y: 152,
        size: 8,
      });
      pages3[14].drawText(date, {
        x: 63,
        y: 141,
        size: 8,
      });

      pages3[13].drawText(
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
        {
          x: 78,
          y: 591,
          size: 8,
        }
      );
      pages3[13].drawText(
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
        {
          x: 264,
          y: 531,
          size: 8,
        }
      );
      pages3[13].drawText(
        PVAdress["Straße"].content + " " + PVAdress["Nummer"].content,
        {
          x: 272,
          y: 592,
          size: 8,
        }
      );
      pages3[13].drawText(PVAdress["Gemeinde"].content, {
        x: 273,
        y: 571,
        size: 8,
      });

      if (
        Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <
        Number(PVData["Spitzenleistung[kW]"].content)
      ) {
        pages3[2].drawText(
          PVData["Nennleistung der gesamten Inverter[kW]"].content,
          {
            x: 324,
            y: 601,
            size: 8,
          }
        );

        pages3[11].drawText(
          PVData["Nennleistung der gesamten Inverter[kW]"].content,
          {
            x: 37,
            y: 605,
            size: 8,
          }
        );
      } else if (
        Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) >=
        Number(PVData["Spitzenleistung[kW]"].content)
      ) {
        pages3[2].drawText(PVData["Spitzenleistung[kW]"].content, {
          x: 324,
          y: 601,
          size: 8,
        });

        pages3[11].drawText(PVData["Spitzenleistung[kW]"].content, {
          x: 37,
          y: 605,
          size: 8,
        });
      }
      pages3[14].drawText(
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
        {
          x: 84,
          y: 253,
          size: 8,
        }
      );

      pdfsToSend = pdfsToSend.concat([pdfDoc2, pdfDoc3]);

      pathsAndFilenames = pathsAndFilenames.concat([
        {
          filename: filename2,
          path: path2,
          contentType: "application/pdf",
        },
        {
          filename: filename3,
          path: path3,
          contentType: "application/pdf",
        },
      ]);
      await saveFiles(pdfsToSend, pathsAndFilenames).then(
        sendMailflexible(
          pathsAndFilenames,
          UploadedFilesToSend,
          UploadedFileSizes,
          PersonalData["Vorname"].content +
            " " +
            PersonalData["Nachname"].content,
          PersonalData["Steuer"].selectedValue,
          Modul,
          filesToDelete,
          attachmentSize
        ).then(() => {
          res.send(
            "Vielen Dank, Ihre Daten wurden erfolgreich übermittelt! Sie können das Portal jetzt verlassen!"
          );
        })
      );
    } else {
      attachmentSize = attachmentSize + 350000 + 1500000;
      let filename2 =
          "Delega_mandato_di_rappresentanza_Unificato_TICA_" +
          PersonalData["Nachname"].content +
          "_" +
          PersonalData["Vorname"].content +
          ".pdf",
        path2 =
          "./Delega_mandato_di_rappresentanza_Unificato_TICA_" +
          PersonalData["Nachname"].content +
          "_" +
          PersonalData["Vorname"].content +
          ".pdf";
      let filename3 =
          "Regolamento_di_Esercizio_BT_bis-11,08_" +
          PersonalData["Nachname"].content +
          "_" +
          PersonalData["Vorname"].content +
          ".pdf",
        path3 =
          "./Regolamento_di_Esercizio_BT_bis-11,08_" +
          PersonalData["Nachname"].content +
          "_" +
          PersonalData["Vorname"].content +
          ".pdf";

      let pdfDoc2 = await PDFDocument.load(
        readFileSync(
          "./Backend/Documents/Delega_mandato_di_rappresentanza_Unificato_TICA.pdf"
        )
      );
      const pages2 = pdfDoc2.getPages();

      let pdfDoc3 = await PDFDocument.load(
        readFileSync(
          "./Backend/Documents/Regolamento_di_Esercizio_BT_bis-11,08.pdf"
        )
      );
      const pages3 = pdfDoc3.getPages();
      filesToDelete = filesToDelete.concat([filename2, filename3]);

      pages2[0].drawText(PersonalData["Vorname"].content, {
        x: 90,
        y: 644,
        size: 9,
      });
      pages2[0].drawText(PersonalData["Nachname"].content, {
        x: 300,
        y: 644,
        size: 9,
      });
      pages2[0].drawText(PersonalData["Geburtsort"].content, {
        x: 90,
        y: 625,
        size: 9,
      });
      pages2[0].drawText(Geburtsdatum, {
        x: 201,
        y: 625,
        size: 9,
      });
      pages2[0].drawText(PersonalData["Steuernummer"].content, {
        x: 120,
        y: 605,
        size: 9,
      });
      pages2[0].drawText(PersonalData["Straße"].content, {
        x: 350,
        y: 605,
        size: 9,
      });
      pages2[0].drawText(PersonalData["Wohnhaft in der Gemeinde"].content, {
        x: 95,
        y: 585,
        size: 9,
      });
      pages2[0].drawText(PersonalData["Postleitzahl"].content, {
        x: 280,
        y: 585,
        size: 9,
      });
      pages2[0].drawText(
        PersonalData[
          "Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"
        ].content,
        {
          x: 379,
          y: 585,
          size: 9,
        }
      );
      if (PersonalData["Privatperson"].selectedValue !== "Ja") {
        pages2[0].drawText(PersonalData["Privatperson"].content, {
          x: 150,
          y: 471,
          size: 9,
        });
        pages2[0].drawText(PersonalData["Partita Iva"].content, {
          x: 379,
          y: 471,
          size: 9,
        });
      }
      pages2[2].drawText(date, {
        x: 80,
        y: 207,
        size: 9,
      });

      pages3[0].drawText(
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
        {
          x: 131,
          y: 656,
          size: 8,
        }
      );
      pages3[0].drawText(
        PersonalData["Geburtsort"].content + "    " + Geburtsdatum,
        {
          x: 171,
          y: 620,
          size: 8,
        }
      );
      pages3[0].drawText(
        PersonalData["Steuernummer"].content +
          "       " +
          PersonalData["Partita Iva"].content,
        {
          x: 171,
          y: 590,
          size: 8,
        }
      );
      pages3[0].drawText(
        PersonalData["Straße"].content +
          " " +
          PersonalData["Hausnummer"].content,
        {
          x: 99,
          y: 530,
          size: 8,
        }
      );
      pages3[0].drawText(PersonalData["Fraktion"].content, {
        x: 339,
        y: 530,
        size: 8,
      });
      pages3[0].drawText(PersonalData["Wohnhaft in der Gemeinde"].content, {
        x: 79,
        y: 501,
        size: 8,
      });

      pages3[0].drawText(PVData["POD"].content, {
        x: 318,
        y: 475,
        size: 8,
      });
      pages3[0].drawText(
        PVData["Nennleistung der gesamten Inverter[kW]"].content,
        {
          x: 201,
          y: 418,
          size: 8,
        }
      );
      if (
        Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <
        Number(PVData["Spitzenleistung[kW]"].content)
      ) {
        pages3[0].drawText(
          PVData["Nennleistung der gesamten Inverter[kW]"].content,
          {
            x: 235,
            y: 390,
            size: 8,
          }
        );
      } else {
        pages3[0].drawText(PVData["Spitzenleistung[kW]"].content, {
          x: 235,
          y: 390,
          size: 8,
        });
      }

      pages3[2].drawText(
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
        {
          x: 55,
          y: 333,
          size: 8,
        }
      );
      pages3[2].drawText(PersonalDataEl["Telefonnummer"].content, {
        x: 205,
        y: 344,
        size: 6,
      });
      pages3[2].drawText(PersonalData["Email"].content, {
        x: 205,
        y: 332,
        size: 6,
      });
      pages3[2].drawText(date, {
        x: 62,
        y: 105,
        size: 8,
      });

      pages3[3].drawText(
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
        {
          x: 253,
          y: 526,
          size: 8,
        }
      );
      pages3[3].drawText(PVAdress["Straße"].content, {
        x: 149,
        y: 479,
        size: 8,
      });

      pages3[3].drawText(PVAdress["Nummer"].content, {
        x: 469,
        y: 479,
        size: 8,
      });
      pages3[3].drawText(PVAdress["Gemeinde"].content, {
        x: 82,
        y: 459,
        size: 8,
      });

      pages3[3].drawText("BZ", {
        x: 304,
        y: 459,
        size: 8,
      });
      pages3[3].drawText(PVAdress["Postleitzahl"].content, {
        x: 446,
        y: 459,
        size: 8,
      });
      pages3[3].drawText(PVData["POD"].content, {
        x: 343,
        y: 439,
        size: 8,
      });

      pages3[3].drawText(
        PVAdress["Straße"].content + " " + PVAdress["Nummer"].content,
        {
          x: 54,
          y: 315,
          size: 8,
        }
      );
      pages3[3].drawText(PVData["POD"].content, {
        x: 450,
        y: 315,
        size: 8,
      });
      pages3[3].drawText(PVData["POD"].content, {
        x: 86,
        y: 185,
        size: 8,
      });

      pages3[4].drawText(String(Modul["Anzahl"].content), {
        x: 28,
        y: 204,
        size: 8,
      });
      pages3[4].drawText(String(Modul["Leistung[kW]"].content), {
        x: 67,
        y: 204,
        size: 8,
      });
      pages3[4].drawText(
        String(
          Number(Modul["Anzahl"].content) *
            Number(Modul["Leistung[kW]"].content)
        ),
        {
          x: 139,
          y: 204,
          size: 8,
        }
      );

      pages3[5].drawText(date, {
        x: 78,
        y: 154,
        size: 8,
      });

      pages3[6].drawText(
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
        {
          x: 140,
          y: 683,
          size: 8,
        }
      );
      pages3[6].drawText(
        PersonalData["Geburtsort"].content + "     " + Geburtsdatum,
        {
          x: 178,
          y: 662,
          size: 8,
        }
      );
      pages3[6].drawText(
        PersonalData["Steuernummer"].content +
          "     " +
          PersonalData["Partita Iva"].content,
        {
          x: 177,
          y: 639,
          size: 8,
        }
      );
      pages3[6].drawText(
        PersonalData["Straße"].content +
          "     " +
          PersonalData["Hausnummer"].content,
        {
          x: 109,
          y: 609,
          size: 8,
        }
      );

      pages3[6].drawText(PersonalData["Fraktion"].content, {
        x: 341,
        y: 608,
        size: 8,
      });
      pages3[6].drawText(PersonalData["Postleitzahl"].content, {
        x: 407,
        y: 586,
        size: 8,
      });
      pages3[6].drawText(PersonalData["Wohnhaft in der Gemeinde"].content, {
        x: 87,
        y: 586,
        size: 8,
      });
      pages3[6].drawText(
        PersonalData[
          "Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"
        ].content,
        {
          x: 324,
          y: 586,
          size: 8,
        }
      );
      pages3[6].drawText(PVData["POD"].content, {
        x: 349,
        y: 480,
        size: 8,
      });
      pages3[6].drawText(
        PVAdress["Straße"].content + " " + PVAdress["Nummer"].content,
        {
          x: 115,
          y: 520,
          size: 8,
        }
      );
      pages3[6].drawText(PVAdress["Postleitzahl"].content, {
        x: 450,
        y: 500,
        size: 8,
      });
      pages3[6].drawText(PVAdress["Gemeinde"].content, {
        x: 114,
        y: 500,
        size: 8,
      });
      pages3[6].drawText(
        PVData["Nennleistung der gesamten Inverter[kW]"].content,
        {
          x: 400,
          y: 443,
          size: 8,
        }
      );

      if (
        Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <
        Number(PVData["Spitzenleistung[kW]"].content)
      ) {
        pages3[6].drawText(
          PVData["Nennleistung der gesamten Inverter[kW]"].content,
          {
            x: 232,
            y: 412,
            size: 8,
          }
        );
      } else if (
        Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) >=
        Number(PVData["Spitzenleistung[kW]"].content)
      ) {
        pages3[6].drawText(PVData["Spitzenleistung[kW]"].content, {
          x: 232,
          y: 412,
          size: 8,
        });
      }
      pages3[6].drawText(date, {
        x: 90,
        y: 152,
        size: 8,
      });

      pages3[7].drawText(
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
        {
          x: 78,
          y: 591,
          size: 8,
        }
      );
      pages3[7].drawText(
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
        {
          x: 264,
          y: 531,
          size: 8,
        }
      );
      pages3[7].drawText(
        PVAdress["Straße"].content + " " + PVAdress["Nummer"].content,
        {
          x: 272,
          y: 592,
          size: 8,
        }
      );
      pages3[7].drawText(PVAdress["Gemeinde"].content, {
        x: 273,
        y: 571,
        size: 8,
      });

      pages3[8].drawText(
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
        {
          x: 88,
          y: 254,
          size: 8,
        }
      );

      pages3[8].drawText(date, {
        x: 58,
        y: 143,
        size: 8,
      });

      pdfsToSend = pdfsToSend.concat([pdfDoc2, pdfDoc3]);

      pathsAndFilenames = pathsAndFilenames.concat([
        {
          filename: filename2,
          path: path2,
          contentType: "application/pdf",
        },
        {
          filename: filename3,
          path: path3,
          contentType: "application/pdf",
        },
      ]);
      await saveFiles(pdfsToSend, pathsAndFilenames).then(
        sendMailflexible(
          pathsAndFilenames,
          UploadedFilesToSend,
          UploadedFileSizes,
          PersonalData["Vorname"].content +
            " " +
            PersonalData["Nachname"].content,
          PersonalData["Steuer"].selectedValue,
          Modul,
          filesToDelete,
          attachmentSize
        ).then(() => {
          res.send(
            "Vielen Dank, Ihre Daten wurden erfolgreich übermittelt! Sie können das Portal jetzt verlassen!"
          );
        })
      );
    }
  }
};
const changeDateFormat = (olddate) => {
  let help = olddate.split("-");
  return help[2] + "/" + help[1] + "/" + help[0];
};

const sendMailflexible = async (
  pathsAndFilenames,
  UploadedFilesToSend,
  UploadedFileSizes,
  FullName,
  Steuer,
  Modul,
  filesToDelete,
  attachmentSize
) => {
  //console.log(UploadedFileSizes);
  //console.log(attachmentSize);
  let filesToSend = [];
  filesToSend.push(pathsAndFilenames);
  for (let i = 0; i < UploadedFilesToSend.length; i++) {
    if (attachmentSize + UploadedFileSizes[i] < 25000000) {
      filesToSend[filesToSend.length - 1].push(UploadedFilesToSend[i]);
      attachmentSize = attachmentSize + UploadedFileSizes[i];
    } else {
      filesToSend.push([]);
      filesToSend[filesToSend.length - 1].push(UploadedFilesToSend[i]);
      attachmentSize = UploadedFileSizes[i];
    }
  }
  //console.log(filesToSend);
  await sendMultipleMails(filesToSend, FullName, Steuer, Modul).then(() => {
    filesToDelete.map((file) => {
      unlinkSync(file);
      return;
    });
    deleteFilesOlderThan("./Backend/Documents/Uploads", 7200000);
    console.log("Ihre Daten wurden erfolgreich gespeichert!");
  });
};
const sendMultipleMails = async (filesToSend, FullName, Steuer, Modul) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "messner92@gmail.com",
      pass: "htqwwndxfajnontj",
    },
  });

  await Promise.all(
    filesToSend.map(async (doc, index) => {
      ++index;
      await transporter.sendMail({
        from: "messner92@gmail.com",
        to: "formulare.automatisiert@gmail.com",
        subject:
          "Baubeginn von " +
          FullName +
          ", Email " +
          index +
          " von " +
          filesToSend.length,
        text:
          "Steuerrechtliche Angabe: " +
          Steuer +
          "\n\n" +
          "Daten Modul\nMarke:" +
          Modul["Marke"].content +
          "\nModell:" +
          Modul["Modell"].content +
          "\nAnzahl:" +
          Modul["Anzahl"].content +
          "\nLeistung[kW]:" +
          Modul["Leistung[kW]"].content,
        attachments: doc,
      });
    })
  );
};
const saveFiles = async (pdfsToSend, pathsAndFilenames) => {
  await Promise.all(
    pdfsToSend.map(async (doc, index) => {
      await doc.save().then((x) => {
        writeFileSync(pathsAndFilenames[index].filename, x);
      });
    })
  );
};
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

/*sendMailflexible = async (
  pathsAndFilenames,
  UploadedFilesToSend,
  FullName,
  Steuer,
  Modul,
  filesToDelete
) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "gabrielmaler789@gmail.com",
      pass: "owvmuijpjvbqrqpe",
    },
  });
  const info = await transporter
    .sendMail({
      from: "gabrielmaler789@gmail.com",
      to: "formulare.automatisiert@gmail.com",
      //to: "messner92@gmail.com",
      subject: "Parte 1 von " + FullName,
      text:
        "Steuerrechtliche Angabe: " +
        Steuer +
        "\n\n" +
        "Daten Modul\nMarke:" +
        Modul["Marke"].content +
        "\nModell:" +
        Modul["Modell"].content +
        "\nAnzahl:" +
        Modul["Anzahl"].content +
        "\nLeistung[kW]:" +
        Modul["Leistung[kW]"].content,
      attachments: pathsAndFilenames.concat(UploadedFilesToSend),
    })
    .then(() => {
      filesToDelete.map((file) => {
        unlinkSync(file);
        return;
      });
      deleteFilesOlderThan("./Backend/Documents/Uploads", 7200000);
      console.log("Ihre Daten wurden erfolgreich gespeichert!");
    });
};
*/
/*writeFileSync(
      filename,
      await pdfDoc.save().then(
        writeFileSync(
          filename2,
          await pdfDoc2.save().then(
            sendMailVierschach(
              filename,
              path,
              PersonalData["Vorname"].content +
                " " +
                PersonalData["Nachname"].content,
              filename2,
              path2,
              SignatureFilename,
              AusweisFilename,
              StromrechnungFilename,
              KatasterFilename,
              PersonalData["Steuer"].selectedValue,
              Modul
            ).then(() => {
              res.send(
                "Vielen Dank, Ihre Daten wurden erfolgreich übermittelt! Sie können das Portal jetzt verlassen!"
              );
            })
          )
        )
      )
    );*/
/*writeFileSync(
      filename,
      await pdfDoc.save().then(
        writeFileSync(
          filename2,
          await pdfDoc2.save().then(
            writeFileSync(
              filename3,
              await pdfDoc3.save().then(
                sendMail(
                  filename,
                  path,
                  PersonalData["Vorname"].content +
                    " " +
                    PersonalData["Nachname"].content,
                  filename2,
                  path2,
                  filename3,
                  path3,
                  SignatureFilename,
                  AusweisFilename,
                  StromrechnungFilename,
                  KatasterFilename,
                  PersonalData["Steuer"].selectedValue,
                  Modul
                ).then(() => {
                  res.send(
                    "Vielen Dank, Ihre Daten wurden erfolgreich übermittelt! Sie können das Portal jetzt verlassen!"
                  );
                })
              )
            )
          )
        )
      )
    );*/
/*
sendMailVierschach = async (
  filename,
  path,
  FullName,
  filename2,
  path2,
  SignatureFilename,
  AusweisFilename,
  StromrechnungFilename,
  KatasterFilename,
  Steuer,
  Modul
) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "gabrielmaler789@gmail.com",
      pass: "owvmuijpjvbqrqpe",
    },
  });
  const info = await transporter
    .sendMail({
      from: "gabrielmaler789@gmail.com",
      to: "formulare.automatisiert@gmail.com",
      //to: "messner92@gmail.com",
      subject: "Formular Parte 1 von " + FullName,
      text:
        "Steuerrechtliche Angabe: " +
        Steuer +
        "\n\n" +
        "Daten Modul\nMarke:" +
        Modul["Marke"].content +
        "\nModell:" +
        Modul["Modell"].content +
        "\nAnzahl:" +
        Modul["Anzahl"].content +
        "\nLeistung[kW]:" +
        Modul["Leistung[kW]"].content,
      attachments: [
        {
          filename: filename,
          path: path,
          contentType: "application/pdf",
        },
        {
          filename: filename2,
          path: path2,
          contentType: "application/pdf",
        },
        {
          filename: SignatureFilename[SignatureFilename.length - 1],
          path:
            "./Backend/Documents/Uploads/" +
            SignatureFilename[SignatureFilename.length - 1],
        },
        {
          filename: AusweisFilename[AusweisFilename.length - 1],
          path:
            "./Backend/Documents/Uploads/" +
            AusweisFilename[AusweisFilename.length - 1],
        },
        {
          filename: StromrechnungFilename[StromrechnungFilename.length - 1],
          path:
            "./Backend/Documents/Uploads/" +
            StromrechnungFilename[StromrechnungFilename.length - 1],
        },
        {
          filename: KatasterFilename[KatasterFilename.length - 1],
          path:
            "./Backend/Documents/Uploads/" +
            KatasterFilename[KatasterFilename.length - 1],
        },
      ],
    })
    .then(() => {
      console.log("Ihre Daten wurden erfolgreich gespeichert!");
      unlinkSync(filename);
      unlinkSync(filename2);
      for (let i = SignatureFilename.length - 1; i > -1; i--) {
        unlinkSync("./Backend/Documents/Uploads/" + SignatureFilename[i]);
        SignatureFilename.pop();
      }
      for (i = AusweisFilename.length - 1; i > -1; i--) {
        unlinkSync("./Backend/Documents/Uploads/" + AusweisFilename[i]);
        AusweisFilename.pop();
      }
      for (i = StromrechnungFilename.length - 1; i > -1; i--) {
        unlinkSync("./Backend/Documents/Uploads/" + StromrechnungFilename[i]);
        StromrechnungFilename.pop();
      }
      for (i = KatasterFilename.length - 1; i > -1; i--) {
        unlinkSync("./Backend/Documents/Uploads/" + KatasterFilename[i]);
        KatasterFilename.pop();
      }
    });
};
*/
/*
sendMail = async (
  filename,
  path,
  FullName,
  filename2,
  path2,
  filename3,
  path3,
  SignatureFilename,
  AusweisFilename,
  StromrechnungFilename,
  KatasterFilename,
  Steuer,
  Modul
) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "gabrielmaler789@gmail.com",
      pass: "owvmuijpjvbqrqpe",
    },
  });
  const info = await transporter
    .sendMail({
      from: "gabrielmaler789@gmail.com",
      to: "formulare.automatisiert@gmail.com",
      //to: "messner92@gmail.com",
      subject: "Formular Parte 1 von " + FullName,
      text:
        "Steuerrechtliche Angabe: " +
        Steuer +
        "\n\n" +
        "Daten Modul\nMarke:" +
        Modul["Marke"].content +
        "\nModell:" +
        Modul["Modell"].content +
        "\nAnzahl:" +
        Modul["Anzahl"].content +
        "\nLeistung[kW]:" +
        Modul["Leistung[kW]"].content,
      attachments: [
        {
          filename: filename,
          path: path,
          contentType: "application/pdf",
        },
        {
          filename: filename2,
          path: path2,
          contentType: "application/pdf",
        },
        {
          filename: filename3,
          path: path3,
          contentType: "application/pdf",
        },
        {
          filename: SignatureFilename[SignatureFilename.length - 1],
          path:
            "./Backend/Documents/Uploads/" +
            SignatureFilename[SignatureFilename.length - 1],
        },
        {
          filename: AusweisFilename[AusweisFilename.length - 1],
          path:
            "./Backend/Documents/Uploads/" +
            AusweisFilename[AusweisFilename.length - 1],
        },
        {
          filename: StromrechnungFilename[StromrechnungFilename.length - 1],
          path:
            "./Backend/Documents/Uploads/" +
            StromrechnungFilename[StromrechnungFilename.length - 1],
        },
        {
          filename: KatasterFilename[KatasterFilename.length - 1],
          path:
            "./Backend/Documents/Uploads/" +
            KatasterFilename[KatasterFilename.length - 1],
        },
      ],
    })
    .then(() => {
      console.log("Ihre Daten wurden erfolgreich gespeichert!");
      unlinkSync(filename);
      unlinkSync(filename2);
      unlinkSync(filename3);
      for (let i = SignatureFilename.length - 1; i > -1; i--) {
        unlinkSync("./Backend/Documents/Uploads/" + SignatureFilename[i]);
        SignatureFilename.pop();
      }
      for (i = AusweisFilename.length - 1; i > -1; i--) {
        unlinkSync("./Backend/Documents/Uploads/" + AusweisFilename[i]);
        AusweisFilename.pop();
      }
      for (i = StromrechnungFilename.length - 1; i > -1; i--) {
        unlinkSync("./Backend/Documents/Uploads/" + StromrechnungFilename[i]);
        StromrechnungFilename.pop();
      }
      for (i = KatasterFilename.length - 1; i > -1; i--) {
        unlinkSync("./Backend/Documents/Uploads/" + KatasterFilename[i]);
        KatasterFilename.pop();
      }
    });
};
*/
