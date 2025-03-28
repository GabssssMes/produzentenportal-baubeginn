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
  } else {
    attachmentSize = attachmentSize + 118000;
    let pdfDoc4,
      filename4 =
        "DICHIARAZIONE SOSTITUTIVA DI ATTO DI NOTORIETA ARERA 361_2023_" +
        PersonalData["Nachname"].content +
        "_" +
        PersonalData["Vorname"].content +
        ".pdf",
      path4 =
        "DICHIARAZIONE SOSTITUTIVA DI ATTO DI NOTORIETA ARERA 361_2023_" +
        PersonalData["Nachname"].content +
        "_" +
        PersonalData["Vorname"].content +
        ".pdf";
    pdfDoc4 = await PDFDocument.load(
      readFileSync(
        "./Backend/Documents/DICHIARAZIONE SOSTITUTIVA DI ATTO DI NOTORIETA ARERA 361_2023.pdf"
      )
    );
    const pages4 = pdfDoc4.getPages();

    pages4[0].drawText(
      PersonalData["Nachname"].content + " " + PersonalData["Vorname"].content,
      {
        x: 167,
        y: 688,
        size: 8,
      }
    );
    pages4[0].drawText(PersonalData["Geburtsort"].content, {
      x: 312,
      y: 688,
      size: 8,
    });
    pages4[0].drawText(Geburtsdatum, {
      x: 126,
      y: 674,
      size: 8,
    });
    pages4[0].drawText(PersonalData["Steuernummer"].content, {
      x: 250,
      y: 674,
      size: 8,
    });
    pages4[0].drawText(PersonalData["Straße"].content, {
      x: 398,
      y: 674,
      size: 6,
    });
    pages4[0].drawText(PersonalData["Hausnummer"].content, {
      x: 470,
      y: 674,
      size: 8,
    });
    pages4[0].drawText(PersonalData["Postleitzahl"].content, {
      x: 72,
      y: 659,
      size: 8,
    });
    pages4[0].drawText(PersonalData["Wohnhaft in der Gemeinde"].content, {
      x: 157,
      y: 659,
      size: 8,
    });
    pages4[0].drawText(
      PersonalData["Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"]
        .content,
      {
        x: 254,
        y: 659,
        size: 8,
      }
    );
    pages4[0].drawText(PVData["POD"].content, {
      x: 374,
      y: 617,
      size: 8,
    });
    pages4[0].drawText(
      PVAdress["Straße"].content + " " + PVAdress["Nummer"].content,
      {
        x: 71,
        y: 601,
        size: 6,
      }
    );
    pages4[0].drawText(PVAdress["Postleitzahl"].content, {
      x: 161,
      y: 601,
      size: 8,
    });
    pages4[0].drawText(PVAdress["Gemeinde"].content, {
      x: 281,
      y: 601,
      size: 8,
    });
    pages4[0].drawText(
      PVAdress["Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"]
        .content,
      {
        x: 386,
        y: 601,
        size: 8,
      }
    );
    pages4[0].drawText(
      PVData["Nennleistung der gesamten Inverter[kW]"].content,
      {
        x: 98,
        y: 587,
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
          x: 339,
          y: 587,
          size: 8,
        }
      );
    } else {
      pages4[0].drawText(PVData["Spitzenleistung[kW]"].content, {
        x: 339,
        y: 587,
        size: 8,
      });
    }
    pages4[0].drawText(date, {
      x: 101,
      y: 182,
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

  if (
    PVData["POD"].content.split("")[2] === "0" &&
    PVData["POD"].content.split("")[3] === "8" && //Wenn Anlage in Lüsen
    PVData["POD"].content.split("")[4] === "1"
  ) {
    attachmentSize = attachmentSize + 1000000;
    let pdfDoc,
      pdfDoc2,
      pdfDoc3,
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
      filename3 =
        "Bozza Regolamento_" +
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
        ".pdf",
      path3 =
        "./Bozza Regolamento_" +
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
    pdfDoc3 = await PDFDocument.load(
      readFileSync("./Backend/Documents/Bozza Regolamento_BT_LUSON_2022.pdf")
    );
    const pages = pdfDoc.getPages();
    const pages2 = pdfDoc2.getPages();
    const pages3 = pdfDoc3.getPages();
    pdfsToSend = pdfsToSend.concat([pdfDoc]);
    pdfsToSend = pdfsToSend.concat([pdfDoc2]);
    pdfsToSend = pdfsToSend.concat([pdfDoc3]);
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
      {
        filename: filename3,
        path: path3,
        contentType: "application/pdf",
      },
    ]);
    filesToDelete = filesToDelete.concat([filename]);
    filesToDelete = filesToDelete.concat([filename2]);
    filesToDelete = filesToDelete.concat([filename3]);
    pages[0].drawText(
      PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
      {
        x: 123,
        y: 689,
        size: 8,
      }
    );
    pages[0].drawText(PersonalData["Geburtsort"].content, {
      x: 332,
      y: 689,
      size: 8,
    });
    pages[0].drawText(Geburtsdatum, {
      x: 444,
      y: 689,
      size: 8,
    });
    pages[0].drawText(PersonalData["Wohnhaft in der Gemeinde"].content, {
      x: 176,
      y: 668,
      size: 7,
    });
    pages[0].drawText(
      PersonalData["Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"]
        .content,
      {
        x: 297,
        y: 668,
        size: 8,
      }
    );
    pages[0].drawText(PersonalData["Straße"].content, {
      x: 341,
      y: 668,
      size: 6,
    });
    pages[0].drawText(PersonalData["Hausnummer"].content, {
      x: 425,
      y: 668,
      size: 8,
    });
    pages[0].drawText(PersonalData["Postleitzahl"].content, {
      x: 473,
      y: 668,
      size: 8,
    });
    pages[0].drawText(PersonalData["Steuernummer"].content, {
      x: 101,
      y: 648,
      size: 8,
    });
    pages[0].drawText(PersonalData["Partita Iva"].content, {
      x: 101,
      y: 638,
      size: 8,
    });
    pages[0].drawText(PersonalData["Telefonnummer"].content, {
      x: 126,
      y: 628,
      size: 6,
    });
    pages[0].drawText(PersonalData["Telefonnummer"].content, {
      x: 242,
      y: 628,
      size: 6,
    });
    pages[0].drawText(PersonalData["Email"].content, {
      x: 380,
      y: 628,
      size: 7,
    });
    if (PersonalData["Privatperson"].selectedValue === "Ja") {
      pages[0].drawLine({
        start: { x: 93, y: 546 },
        end: { x: 103, y: 556 },
      });
      pages[0].drawLine({
        start: { x: 93, y: 556 },
        end: { x: 103, y: 546 },
      });
    } else {
      pages[0].drawLine({
        start: { x: 93, y: 478 },
        end: { x: 103, y: 488 },
      });
      pages[0].drawLine({
        start: { x: 93, y: 488 },
        end: { x: 103, y: 478 },
      });
      pages[0].drawText(
        "Legale rappresentante della ditta " +
          PersonalData["Privatperson"].content,
        {
          x: 211,
          y: 479,
          size: 8,
        }
      );
    }
    pages[0].drawText(Baubeginn, {
      x: 109,
      y: 344,
      size: 7,
    });
    pages[0].drawText(PVData["Name PV-Anlage"].content, {
      x: 57,
      y: 331,
      size: 6,
    });
    pages[0].drawText(PVData["Spitzenleistung[kW]"].content, {
      x: 291,
      y: 331,
      size: 6,
    });
    pages[0].drawText(
      PVData["Nennleistung der gesamten Inverter[kW]"].content,
      {
        x: 121,
        y: 315,
        size: 6,
      }
    );
    pages[0].drawText(PVData["POD"].content, {
      x: 388,
      y: 315,
      size: 8,
    });
    pages[0].drawText(PVAdress["Fraktion"].content, {
      x: 85,
      y: 248,
      size: 8,
    });
    pages[0].drawText(
      PVAdress["Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"]
        .content,
      {
        x: 161,
        y: 248,
        size: 8,
      }
    );
    pages[0].drawText(PVAdress["Straße"].content, {
      x: 231,
      y: 248,
      size: 8,
    });
    pages[0].drawText(PVAdress["Nummer"].content, {
      x: 360,
      y: 248,
      size: 8,
    });
    pages[0].drawText(PVAdress["Gemeinde"].content, {
      x: 428,
      y: 248,
      size: 8,
    });
    pages[0].drawText(PVAdress["Kataster-Blatt"].content, {
      x: 121,
      y: 203,
      size: 8,
    });

    pages[0].drawText(PVAdress["Kataster-Parzelle"].content, {
      x: 167,
      y: 203,
      size: 8,
    });
    pages[0].drawText(PVAdress["Kataster-Sub."].content, {
      x: 217,
      y: 203,
      size: 8,
    });

    if (PVData["Speicher"].selectedValue === "Ja") {
      pages[1].drawText(PVData["Speicher"].content, {
        x: 403,
        y: 775,
        size: 8,
      });
      pages[1].drawLine({
        start: { x: 57, y: 774 },
        end: { x: 68, y: 784 },
      });

      pages[1].drawLine({
        start: { x: 57, y: 784 },
        end: { x: 68, y: 774 },
      });

      pages[1].drawLine({
        start: { x: 93, y: 715 },
        end: { x: 103, y: 725 },
      });
      pages[1].drawLine({
        start: { x: 93, y: 725 },
        end: { x: 103, y: 715 },
      });
      pages[1].drawText(PVData["Speicher"].leistung, {
        x: 464,
        y: 670,
        size: 6,
      });
    }
    if (
      Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <
      Number(PVData["Spitzenleistung[kW]"].content)
    ) {
      pages[1].drawText(
        PVData["Nennleistung der gesamten Inverter[kW]"].content,
        {
          x: 493,
          y: 624,
          size: 8,
        }
      );
    } else {
      pages[1].drawText(PVData["Spitzenleistung[kW]"].content, {
        x: 493,
        y: 624,
        size: 8,
      });
    }
    pages[1].drawText(PersonalData["IBAN laufend auf"].content, {
      x: 151,
      y: 557,
      size: 6,
    });
    pages[1].drawText(PersonalData["IBAN"].content, {
      x: 297,
      y: 557,
      size: 7,
    });
    pages[1].drawText(PVAdress["Fraktion"].content + "    " + date, {
      x: 120,
      y: 85,
      size: 8,
    });

    pages2[0].drawText(
      PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
      {
        x: 120,
        y: 689,
        size: 6,
      }
    );
    pages2[0].drawText(PVData["Spitzenleistung[kW]"].content, {
      x: 57,
      y: 540,
      size: 6,
    });
    pages2[0].drawText(
      PVData["Nennleistung der gesamten Inverter[kW]"].content,
      {
        x: 416,
        y: 540,
        size: 6,
      }
    );
    if (PVData["Speicher"].selectedValue === "Ja") {
      pages2[0].drawText(PVData["Speicher"].content, {
        x: 307,
        y: 489,
        size: 6,
      });
      pages2[0].drawLine({
        start: { x: 93, y: 429 },
        end: { x: 103, y: 439 },
      });
      pages2[0].drawLine({
        start: { x: 93, y: 439 },
        end: { x: 103, y: 429 },
      });
      pages2[0].drawText(PVData["Speicher"].leistung, {
        x: 461,
        y: 385,
        size: 6,
      });
    }
    pages2[0].drawText(SPI["Marke"].content, {
      x: 200,
      y: 330,
      size: 6,
    });
    if (
      Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) > 11.08
    ) {
      pages2[0].drawText(SPI["Modell"].content, {
        x: 378,
        y: 330,
        size: 6,
      });
    } else if (
      Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <= 11.08
    ) {
      pages2[0].drawText(
        SPI["Modell"].content + " integrato nell' inverter secondo CEI 0-21",
        {
          x: 378,
          y: 330,
          size: 6,
        }
      );
    }
    pages2[0].drawText(Inverter["Marke"].content, {
      x: 131,
      y: 307,
      size: 6,
    });
    pages2[0].drawText(Inverter["Modell"].content, {
      x: 312,
      y: 307,
      size: 6,
    });
    pages2[0].drawText(
      PVData["Nennleistung der gesamten Inverter[kW]"].content,
      {
        x: 478,
        y: 307,
        size: 5,
      }
    );
    pages2[0].drawText(Speicher["Marke"].content, {
      x: 198,
      y: 284,
      size: 6,
    });
    pages2[0].drawText(Speicher["Modell"].content, {
      x: 338,
      y: 284,
      size: 6,
    });
    pages2[0].drawText(PVData["Speicher"].leistung, {
      x: 484,
      y: 284,
      size: 5,
    });
    pages2[0].drawText(PersonalData["IBAN laufend auf"].content, {
      x: 58,
      y: 192,
      size: 6,
    });
    pages2[0].drawText(PersonalData["IBAN"].content, {
      x: 343,
      y: 192,
      size: 6,
    });
    pages2[1].drawText(PVAdress["Fraktion"].content, {
      x: 121,
      y: 329,
      size: 8,
    });
    pages3[0].drawText(
      PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
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
      PersonalData["Straße"].content + " " + PersonalData["Hausnummer"].content,
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
      PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
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
      Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <= 11.08
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

    pages3[18].drawText(Speicher["Marke"].content, {
      x: 85,
      y: 556,
      size: 8,
    });
    pages3[18].drawText(Speicher["Modell"].content, {
      x: 211,
      y: 556,
      size: 8,
    });
    pages3[19].drawText(PVData["Speicher"].leistung, {
      x: 325,
      y: 556,
      size: 8,
    });

    pages3[22].drawText(
      PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
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
    attachmentSize = attachmentSize + 200000;
    let pdfDoc,
      filename =
        "parte_uno_" +
        PersonalData["Nachname"].content +
        "_" +
        PersonalData["Vorname"].content +
        ".pdf",
      path =
        "./parte_uno_" +
        PersonalData["Nachname"].content +
        "_" +
        PersonalData["Vorname"].content +
        ".pdf";
    pdfDoc = await PDFDocument.load(
      readFileSync(
        "./Backend/Documents/Allegato_A_-_MU_Parte_I_e_Parte_II__FTV_200kW_20_dic-3.pdf"
      )
    );
    const pages = pdfDoc.getPages();
    pdfsToSend = pdfsToSend.concat([pdfDoc]);
    pathsAndFilenames = pathsAndFilenames.concat([
      {
        filename: filename,
        path: path,
        contentType: "application/pdf",
      },
    ]);

    filesToDelete = filesToDelete.concat([filename]);

    pages[0].drawText(
      PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
      {
        x: 123,
        y: 665,
        size: 8,
      }
    );
    pages[0].drawText(PersonalData["Geburtsort"].content, {
      x: 314,
      y: 665,
      size: 8,
    });
    pages[0].drawText(Geburtsdatum, {
      x: 385,
      y: 665,
      size: 8,
    });
    pages[0].drawText(PersonalData["Wohnhaft in der Gemeinde"].content, {
      x: 66,
      y: 653,
      size: 7,
    });
    pages[0].drawText(
      PersonalData["Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"]
        .content,
      {
        x: 166,
        y: 653,
        size: 8,
      }
    );
    pages[0].drawText(PersonalData["Straße"].content, {
      x: 202,
      y: 653,
      size: 6,
    });
    pages[0].drawText(PersonalData["Hausnummer"].content, {
      x: 290,
      y: 652,
      size: 8,
    });
    pages[0].drawText(PersonalData["Postleitzahl"].content, {
      x: 330,
      y: 652,
      size: 8,
    });
    pages[0].drawText(PersonalData["Steuernummer"].content, {
      x: 418,
      y: 652,
      size: 8,
    });
    pages[0].drawText(PersonalData["Partita Iva"].content, {
      x: 418,
      y: 642,
      size: 8,
    });
    pages[0].drawText(PersonalData["Telefonnummer"].content, {
      x: 115,
      y: 640,
      size: 6,
    });
    pages[0].drawText(PersonalData["Telefonnummer"].content, {
      x: 179,
      y: 640,
      size: 6,
    });
    pages[0].drawText(PersonalData["Email"].content, {
      x: 248,
      y: 641,
      size: 7,
    });
    if (PersonalData["Privatperson"].selectedValue === "Ja") {
      pages[0].drawLine({
        start: { x: 74, y: 597 },
        end: { x: 83, y: 588 },
      });
      pages[0].drawLine({
        start: { x: 74, y: 588 },
        end: { x: 83, y: 597 },
      });
    } else {
      pages[0].drawLine({
        start: { x: 74, y: 555 },
        end: { x: 83, y: 546 },
      });
      pages[0].drawLine({
        start: { x: 74, y: 546 },
        end: { x: 83, y: 555 },
      });
      pages[0].drawText(
        "Legale rappresentante della ditta " +
          PersonalData["Privatperson"].content,
        {
          x: 170,
          y: 548,
          size: 8,
        }
      );
    }
    pages[0].drawText(Baubeginn, {
      x: 109,
      y: 420,
      size: 7,
    });
    pages[0].drawText(PVData["Name PV-Anlage"].content, {
      x: 472,
      y: 426,
      size: 6,
    });
    pages[0].drawText(PVData["Spitzenleistung[kW]"].content, {
      x: 150,
      y: 408,
      size: 6,
    });
    pages[0].drawText(
      PVData["Nennleistung der gesamten Inverter[kW]"].content,
      {
        x: 420,
        y: 408,
        size: 6,
      }
    );
    pages[0].drawText(PVData["POD"].content, {
      x: 177,
      y: 396,
      size: 8,
    });
    if (PVData["Speicher"].selectedValue === "Ja") {
      pages[0].drawLine({
        start: { x: 74, y: 200 },
        end: { x: 83, y: 191 },
      });
      pages[0].drawLine({
        start: { x: 74, y: 191 },
        end: { x: 83, y: 200 },
      });
      pages[0].drawText(PVData["Speicher"].content, {
        x: 415,
        y: 193,
        size: 8,
      });
      pages[0].drawLine({
        start: { x: 93, y: 152 },
        end: { x: 98, y: 157 },
      });

      pages[0].drawLine({
        start: { x: 93, y: 157 },
        end: { x: 98, y: 152 },
      });

      pages[0].drawLine({
        start: { x: 335, y: 156 },
        end: { x: 373, y: 156 },
      });
      pages[0].drawLine({
        start: { x: 335, y: 154 },
        end: { x: 373, y: 154 },
      });
      //pages[0].drawText("continua", {
      //  x: 267,
      //  y: 153,
      //  size: 7,
      pages[0].drawText(PVData["Speicher"].leistung, {
        x: 406,
        y: 112,
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
          x: 432,
          y: 57,
          size: 8,
        }
      );
    } else {
      pages[0].drawText(PVData["Spitzenleistung[kW]"].content, {
        x: 432,
        y: 57,
        size: 8,
      });
    }

    pages[0].drawLine({
      start: { x: 74, y: 376 },
      end: { x: 83, y: 367 },
    });
    pages[0].drawLine({
      start: { x: 74, y: 367 },
      end: { x: 83, y: 376 },
    });
    pages[0].drawText(PVAdress["Fraktion"].content, {
      x: 83,
      y: 333,
      size: 8,
    });
    pages[0].drawText(
      PVAdress["Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"]
        .content,
      {
        x: 150,
        y: 333,
        size: 8,
      }
    );
    pages[0].drawText(PVAdress["Straße"].content, {
      x: 207,
      y: 340,
      size: 8,
    });
    pages[0].drawText(PVAdress["Nummer"].content, {
      x: 275,
      y: 333,
      size: 8,
    });
    pages[0].drawText(PVAdress["Gemeinde"].content, {
      x: 343,
      y: 333,
      size: 8,
    });
    pages[0].drawText(PVAdress["Kataster-Blatt"].content, {
      x: 119,
      y: 290,
      size: 8,
    });

    pages[0].drawText(PVAdress["Kataster-Parzelle"].content, {
      x: 160,
      y: 290,
      size: 8,
    });
    pages[0].drawText(PVAdress["Kataster-Sub."].content, {
      x: 206,
      y: 290,
      size: 8,
    });
    pages[0].drawLine({
      start: { x: 74, y: 312 },
      end: { x: 83, y: 303 },
    });
    pages[0].drawLine({
      start: { x: 74, y: 303 },
      end: { x: 83, y: 312 },
    });
    pages[1].drawText(PersonalData["IBAN laufend auf"].content, {
      x: 60,
      y: 705,
      size: 6,
    });
    pages[1].drawText(PersonalData["IBAN"].content, {
      x: 148,
      y: 715,
      size: 7,
    });
    pages[1].drawLine({
      start: { x: 132, y: 582 },
      end: { x: 126, y: 576 },
    });
    pages[1].drawLine({
      start: { x: 132, y: 576 },
      end: { x: 126, y: 582 },
    });
    pages[1].drawLine({
      start: { x: 166, y: 572 },
      end: { x: 161, y: 566 },
    });
    pages[1].drawLine({
      start: { x: 166, y: 566 },
      end: { x: 161, y: 572 },
    });
    pages[1].drawText(PVAdress["Fraktion"].content + "    " + date, {
      x: 133,
      y: 154,
      size: 8,
    });
    pages[2].drawText(
      PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
      {
        x: 108,
        y: 726,
        size: 6,
      }
    );
    pages[2].drawLine({
      start: { x: 236, y: 648 },
      end: { x: 241, y: 643 },
    });

    pages[2].drawLine({
      start: { x: 236, y: 643 },
      end: { x: 241, y: 648 },
    });
    pages[2].drawText(PVData["Spitzenleistung[kW]"].content, {
      x: 79,
      y: 621,
      size: 6,
    });
    pages[2].drawText(
      PVData["Nennleistung der gesamten Inverter[kW]"].content,
      {
        x: 397,
        y: 621,
        size: 6,
      }
    );
    if (
      Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <
      Number(PVData["Spitzenleistung[kW]"].content)
    ) {
      pages[2].drawText(
        PVData["Nennleistung der gesamten Inverter[kW]"].content,
        {
          x: 133,
          y: 612,
          size: 5,
        }
      );
    } else {
      pages[2].drawText(PVData["Spitzenleistung[kW]"].content, {
        x: 133,
        y: 612,
        size: 5,
      });
    }
    if (PVData["Speicher"].selectedValue === "Ja") {
      pages[2].drawLine({
        start: { x: 70, y: 545 },
        end: { x: 75, y: 550 },
      });
      pages[2].drawLine({
        start: { x: 70, y: 550 },
        end: { x: 75, y: 545 },
      });
      pages[2].drawText(PVData["Speicher"].content, {
        x: 281,
        y: 576,
        size: 6,
      });
      pages[2].drawLine({
        start: { x: 335, y: 547 },
        end: { x: 373, y: 547 },
      });
      pages[2].drawLine({
        start: { x: 335, y: 549 },
        end: { x: 373, y: 549 },
      });
      pages[2].drawText(PVData["Speicher"].leistung, {
        x: 414,
        y: 518,
        size: 6,
      });
    }
    pages[2].drawLine({
      start: { x: 53, y: 370 },
      end: { x: 62, y: 377 },
    });
    pages[2].drawLine({
      start: { x: 53, y: 377 },
      end: { x: 62, y: 370 },
    });
    pages[2].drawLine({
      start: { x: 90, y: 349 },
      end: { x: 95, y: 354 },
    });
    pages[2].drawLine({
      start: { x: 90, y: 354 },
      end: { x: 95, y: 349 },
    });
    pages[2].drawText(PersonalData["IBAN laufend auf"].content, {
      x: 440,
      y: 351,
      size: 6,
    });
    pages[2].drawText(PersonalData["IBAN"].content, {
      x: 179,
      y: 339,
      size: 6,
    });
    pages[3].drawText(PVAdress["Fraktion"].content, {
      x: 109,
      y: 569,
      size: 8,
    });
    pages[2].drawText(SPI["Marke"].content, {
      x: 185,
      y: 470,
      size: 6,
    });
    if (
      Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) > 11.08
    ) {
      pages[2].drawText(SPI["Modell"].content, {
        x: 257,
        y: 470,
        size: 6,
      });
    } else if (
      Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <= 11.08
    ) {
      pages[2].drawText(
        SPI["Modell"].content + " integrato nell' inverter secondo CEI 0-21",
        {
          x: 257,
          y: 470,
          size: 6,
        }
      );
    }
    pages[2].drawText(Inverter["Marke"].content, {
      x: 119,
      y: 448,
      size: 6,
    });
    pages[2].drawText(Inverter["Modell"].content, {
      x: 185,
      y: 455,
      size: 6,
    });
    pages[2].drawText(
      PVData["Nennleistung der gesamten Inverter[kW]"].content,
      {
        x: 246,
        y: 448,
        size: 5,
      }
    );
    pages[2].drawText(Speicher["Marke"].content, {
      x: 167,
      y: 428,
      size: 6,
    });
    pages[2].drawText(Speicher["Modell"].content, {
      x: 235,
      y: 433,
      size: 6,
    });
    pages[2].drawText(PVData["Speicher"].leistung, {
      x: 302,
      y: 428,
      size: 5,
    });

    if (
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
        readFileSync(
          "./Backend/Documents/Domanda di Connessione Vierschach.pdf"
        )
      );
      const pages3 = pdfDoc3.getPages();
      filesToDelete = filesToDelete.concat([filename3]);

      pages3[1].drawText(
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
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
        y: 587,
        size: 8,
      });
      pages3[1].drawText(PersonalData["Steuernummer"].content, {
        x: 162,
        y: 548,
        size: 8,
      });
      pages3[1].drawText(
        PersonalData["Straße"].content +
          " " +
          PersonalData["Hausnummer"].content,
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
        attachmentSize = attachmentSize + 12000000;
        let filename2 =
            "Regolamento_di_Esercizio_BT_ab-11,08 Vierschach_" +
            PersonalData["Nachname"].content +
            "_" +
            PersonalData["Vorname"].content +
            ".pdf",
          path2 =
            "./Regolamento_di_Esercizio_BT_ab-11,08 Vierschach_" +
            PersonalData["Nachname"].content +
            "_" +
            PersonalData["Vorname"].content +
            ".pdf";

        let pdfDoc2 = await PDFDocument.load(
          readFileSync(
            "./Backend/Documents/Regolamento_di_Esercizio_BT_ab-11,08 Vierschach.pdf"
          )
        );
        const pages2 = pdfDoc2.getPages();
        filesToDelete = filesToDelete.concat([filename2]);
        pages2[0].drawText(
          PersonalData["Vorname"].content +
            " " +
            PersonalData["Nachname"].content,
          {
            x: 131,
            y: 656,
            size: 8,
          }
        );

        pages2[0].drawText(
          PersonalData["Geburtsort"].content + "    " + Geburtsdatum,
          {
            x: 171,
            y: 620,
            size: 8,
          }
        );
        pages2[0].drawText(
          PersonalData["Steuernummer"].content +
            "       " +
            PersonalData["Partita Iva"].content,
          {
            x: 171,
            y: 590,
            size: 8,
          }
        );
        pages2[0].drawText(
          PersonalData["Straße"].content +
            " " +
            PersonalData["Hausnummer"].content,
          {
            x: 99,
            y: 550,
            size: 8,
          }
        );
        pages2[0].drawText(PersonalData["Fraktion"].content, {
          x: 337,
          y: 549,
          size: 8,
        });
        pages2[0].drawText(PersonalData["Wohnhaft in der Gemeinde"].content, {
          x: 74,
          y: 517,
          size: 8,
        });
        pages2[0].drawText(
          PersonalData[
            "Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"
          ].content,
          {
            x: 321,
            y: 517,
            size: 8,
          }
        );
        pages2[0].drawText(PersonalData["Postleitzahl"].content, {
          x: 406,
          y: 517,
          size: 8,
        });

        pages2[2].drawText(PVData["Name PV-Anlage"].content, {
          x: 156,
          y: 746,
          size: 8,
        });
        pages2[2].drawText(
          PVAdress["Straße"].content + " " + PVAdress["Nummer"].content,
          {
            x: 96,
            y: 724,
            size: 8,
          }
        );
        pages2[2].drawText(PVAdress["Gemeinde"].content, {
          x: 92,
          y: 703,
          size: 8,
        });
        pages2[2].drawText(PVAdress["Postleitzahl"].content, {
          x: 436,
          y: 703,
          size: 8,
        });
        pages2[2].drawText(PVData["POD"].content, {
          x: 343,
          y: 682,
          size: 8,
        });
        if (PVData["Spannung der Anlage"].selectedValue === "Monofase") {
          pages2[2].drawLine({
            start: { x: 289, y: 664 },
            end: { x: 297, y: 673 },
          });
          pages2[2].drawLine({
            start: { x: 289, y: 673 },
            end: { x: 297, y: 664 },
          });
        } else if (PVData["Spannung der Anlage"].selectedValue === "Trifase") {
          pages2[2].drawLine({
            start: { x: 426, y: 664 },
            end: { x: 434, y: 673 },
          });
          pages2[2].drawLine({
            start: { x: 426, y: 673 },
            end: { x: 434, y: 664 },
          });
        }

        pages2[2].drawText(
          PVData["Nennleistung der gesamten Inverter[kW]"].content,
          {
            x: 388,
            y: 622,
            size: 8,
          }
        );
        pages2[5].drawText(PersonalData["Vorname"].content, {
          x: 67,
          y: 689,
          size: 8,
        });
        pages2[5].drawText(PersonalData["Nachname"].content, {
          x: 284,
          y: 689,
          size: 8,
        });
        pages2[5].drawText(PersonalData["Geburtsort"].content, {
          x: 71,
          y: 670,
          size: 8,
        });
        pages2[5].drawText(Geburtsdatum, {
          x: 438,
          y: 670,
          size: 8,
        });
        pages2[5].drawText(PersonalData["Steuernummer"].content, {
          x: 113,
          y: 652,
          size: 8,
        });
        pages2[5].drawText(
          PersonalData["Straße"].content +
            " " +
            PersonalData["Hausnummer"].content,
          {
            x: 114,
            y: 634,
            size: 8,
          }
        );
        pages2[5].drawText(PersonalData["Wohnhaft in der Gemeinde"].content, {
          x: 85,
          y: 616,
          size: 8,
        });
        pages2[5].drawText(
          PersonalData[
            "Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"
          ].content,
          {
            x: 305,
            y: 616,
            size: 8,
          }
        );
        pages2[5].drawText(PersonalData["Postleitzahl"].content, {
          x: 445,
          y: 616,
          size: 8,
        });
        pages2[5].drawText(PVAdress["Straße"].content, {
          x: 89,
          y: 568,
          size: 8,
        });
        pages2[5].drawText(PVAdress["Nummer"].content, {
          x: 471,
          y: 568,
          size: 8,
        });
        pages2[5].drawText(PVAdress["Gemeinde"].content, {
          x: 82,
          y: 550,
          size: 8,
        });
        pages2[5].drawText(
          PVAdress["Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"]
            .content,
          {
            x: 305,
            y: 550,
            size: 8,
          }
        );
        pages2[5].drawText(PVAdress["Postleitzahl"].content, {
          x: 447,
          y: 550,
          size: 8,
        });
        pages2[5].drawText(PVData["POD"].content, {
          x: 346,
          y: 533,
          size: 8,
        });
        pages2[5].drawText(
          PersonalData["Vorname"].content +
            " " +
            PersonalData["Nachname"].content,
          {
            x: 141,
            y: 482,
            size: 8,
          }
        );
        pages2[5].drawText(
          PersonalData["Vorname"].content +
            " " +
            PersonalData["Nachname"].content,
          {
            x: 141,
            y: 375,
            size: 8,
          }
        );
        pages2[5].drawText(
          PersonalDataEl["Vorname"].content +
            " " +
            PersonalDataEl["Nachname"].content,
          {
            x: 141,
            y: 428,
            size: 8,
          }
        );
        pages2[5].drawText(
          PersonalDataEl["Vorname"].content +
            " " +
            PersonalDataEl["Nachname"].content,
          {
            x: 141,
            y: 319,
            size: 8,
          }
        );
        pages2[5].drawText(PersonalData["Telefonnummer"].content, {
          x: 383,
          y: 482,
          size: 8,
        });
        pages2[5].drawText(PersonalData["Telefonnummer"].content, {
          x: 383,
          y: 375,
          size: 8,
        });
        pages2[5].drawText(PersonalDataEl["Telefonnummer"].content, {
          x: 383,
          y: 430,
          size: 8,
        });
        pages2[5].drawText(PersonalDataEl["Telefonnummer"].content, {
          x: 383,
          y: 325,
          size: 8,
        });
        pages2[5].drawText(PersonalData["Email"].content, {
          x: 313,
          y: 464,
          size: 8,
        });
        pages2[5].drawText(PersonalData["Email"].content, {
          x: 313,
          y: 357,
          size: 8,
        });
        pages2[5].drawText(PersonalDataEl["Email"].content, {
          x: 313,
          y: 411,
          size: 8,
        });
        pages2[5].drawText(PersonalDataEl["Email"].content, {
          x: 313,
          y: 302,
          size: 8,
        });
        pages2[5].drawText(date, {
          x: 67,
          y: 129,
          size: 8,
        });

        pages2[12].drawText(
          PersonalData["Vorname"].content +
            " " +
            PersonalData["Nachname"].content,
          {
            x: 78,
            y: 591,
            size: 8,
          }
        );
        pages2[12].drawText(
          PersonalData["Vorname"].content +
            " " +
            PersonalData["Nachname"].content,
          {
            x: 264,
            y: 531,
            size: 8,
          }
        );
        pages2[12].drawText(
          PVAdress["Straße"].content + " " + PVAdress["Nummer"].content,
          {
            x: 272,
            y: 592,
            size: 8,
          }
        );
        pages2[12].drawText(PVAdress["Gemeinde"].content, {
          x: 273,
          y: 571,
          size: 8,
        });

        if (
          Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <
          Number(PVData["Spitzenleistung[kW]"].content)
        ) {
          pages2[2].drawText(
            PVData["Nennleistung der gesamten Inverter[kW]"].content,
            {
              x: 324,
              y: 601,
              size: 8,
            }
          );

          pages2[11].drawText(
            PVData["Nennleistung der gesamten Inverter[kW]"].content,
            {
              x: 306,
              y: 626,
              size: 8,
            }
          );
        } else if (
          Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) >=
          Number(PVData["Spitzenleistung[kW]"].content)
        ) {
          pages2[2].drawText(PVData["Spitzenleistung[kW]"].content, {
            x: 324,
            y: 601,
            size: 8,
          });

          pages2[11].drawText(PVData["Spitzenleistung[kW]"].content, {
            x: 306,
            y: 626,
            size: 8,
          });
        }
        pages2[13].drawText(
          PersonalData["Vorname"].content +
            " " +
            PersonalData["Nachname"].content,
          {
            x: 84,
            y: 253,
            size: 8,
          }
        );

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
        attachmentSize = attachmentSize + 2000000;
        let filename2 =
            "Regolamento_di_Esercizio_BT_bis-11,08 Vierschach_" +
            PersonalData["Nachname"].content +
            "_" +
            PersonalData["Vorname"].content +
            ".pdf",
          path2 =
            "./Regolamento_di_Esercizio_BT_bis-11,08 Vierschach_" +
            PersonalData["Nachname"].content +
            "_" +
            PersonalData["Vorname"].content +
            ".pdf";

        let pdfDoc2 = await PDFDocument.load(
          readFileSync(
            "./Backend/Documents/Regolamento_di_Esercizio_BT_bis-11,08 Vierschach.pdf"
          )
        );
        const pages2 = pdfDoc2.getPages();
        filesToDelete = filesToDelete.concat([filename2]);

        pages2[0].drawText(
          PersonalData["Vorname"].content +
            " " +
            PersonalData["Nachname"].content,
          {
            x: 131,
            y: 656,
            size: 8,
          }
        );
        pages2[0].drawText(
          PersonalData["Geburtsort"].content + "    " + Geburtsdatum,
          {
            x: 171,
            y: 620,
            size: 8,
          }
        );
        pages2[0].drawText(
          PersonalData["Steuernummer"].content +
            "       " +
            PersonalData["Partita Iva"].content,
          {
            x: 171,
            y: 590,
            size: 8,
          }
        );
        pages2[0].drawText(
          PersonalData["Straße"].content +
            " " +
            PersonalData["Hausnummer"].content,
          {
            x: 99,
            y: 530,
            size: 8,
          }
        );
        pages2[0].drawText(PersonalData["Fraktion"].content, {
          x: 339,
          y: 530,
          size: 8,
        });
        pages2[0].drawText(PersonalData["Wohnhaft in der Gemeinde"].content, {
          x: 79,
          y: 501,
          size: 8,
        });

        pages2[0].drawText(PVData["POD"].content, {
          x: 318,
          y: 475,
          size: 8,
        });
        pages2[0].drawText(
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
          pages2[0].drawText(
            PVData["Nennleistung der gesamten Inverter[kW]"].content,
            {
              x: 235,
              y: 390,
              size: 8,
            }
          );
        } else {
          pages2[0].drawText(PVData["Spitzenleistung[kW]"].content, {
            x: 235,
            y: 390,
            size: 8,
          });
        }

        pages2[2].drawText(
          PersonalData["Vorname"].content +
            " " +
            PersonalData["Nachname"].content,
          {
            x: 55,
            y: 333,
            size: 8,
          }
        );
        pages2[2].drawText(PersonalDataEl["Telefonnummer"].content, {
          x: 205,
          y: 344,
          size: 6,
        });
        pages2[2].drawText(PersonalData["Email"].content, {
          x: 205,
          y: 332,
          size: 6,
        });
        pages2[2].drawText(date, {
          x: 62,
          y: 105,
          size: 8,
        });

        pages2[3].drawText(
          PersonalData["Vorname"].content +
            " " +
            PersonalData["Nachname"].content,
          {
            x: 253,
            y: 526,
            size: 8,
          }
        );
        pages2[3].drawText(PVAdress["Straße"].content, {
          x: 149,
          y: 479,
          size: 8,
        });

        pages2[3].drawText(PVAdress["Nummer"].content, {
          x: 469,
          y: 479,
          size: 8,
        });
        pages2[3].drawText(PVAdress["Gemeinde"].content, {
          x: 82,
          y: 459,
          size: 8,
        });

        pages2[3].drawText("BZ", {
          x: 304,
          y: 459,
          size: 8,
        });
        pages2[3].drawText(PVAdress["Postleitzahl"].content, {
          x: 446,
          y: 459,
          size: 8,
        });
        pages2[3].drawText(PVData["POD"].content, {
          x: 343,
          y: 439,
          size: 8,
        });

        pages2[3].drawText(
          PVAdress["Straße"].content + " " + PVAdress["Nummer"].content,
          {
            x: 54,
            y: 315,
            size: 8,
          }
        );
        pages2[3].drawText(PVData["POD"].content, {
          x: 450,
          y: 315,
          size: 8,
        });
        pages2[3].drawText(PVData["POD"].content, {
          x: 86,
          y: 185,
          size: 8,
        });

        pages2[4].drawText(String(Modul["Anzahl"].content), {
          x: 28,
          y: 204,
          size: 8,
        });
        pages2[4].drawText(String(Modul["Leistung[kW]"].content), {
          x: 67,
          y: 204,
          size: 8,
        });
        pages2[4].drawText(
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

        pages2[5].drawText(date, {
          x: 78,
          y: 154,
          size: 8,
        });

        pages2[6].drawText(
          PersonalData["Vorname"].content +
            " " +
            PersonalData["Nachname"].content,
          {
            x: 140,
            y: 683,
            size: 8,
          }
        );
        pages2[6].drawText(
          PersonalData["Geburtsort"].content + "     " + Geburtsdatum,
          {
            x: 178,
            y: 662,
            size: 8,
          }
        );
        pages2[6].drawText(
          PersonalData["Steuernummer"].content +
            "     " +
            PersonalData["Partita Iva"].content,
          {
            x: 177,
            y: 639,
            size: 8,
          }
        );
        pages2[6].drawText(
          PersonalData["Straße"].content +
            "     " +
            PersonalData["Hausnummer"].content,
          {
            x: 109,
            y: 609,
            size: 8,
          }
        );

        pages2[6].drawText(PersonalData["Fraktion"].content, {
          x: 341,
          y: 608,
          size: 8,
        });
        pages2[6].drawText(PersonalData["Postleitzahl"].content, {
          x: 407,
          y: 586,
          size: 8,
        });
        pages2[6].drawText(PersonalData["Wohnhaft in der Gemeinde"].content, {
          x: 87,
          y: 586,
          size: 8,
        });
        pages2[6].drawText(
          PersonalData[
            "Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"
          ].content,
          {
            x: 324,
            y: 586,
            size: 8,
          }
        );
        pages2[6].drawText(PVData["POD"].content, {
          x: 342,
          y: 472,
          size: 8,
        });
        pages2[6].drawText(
          PVAdress["Straße"].content + " " + PVAdress["Nummer"].content,
          {
            x: 109,
            y: 513,
            size: 8,
          }
        );
        pages2[6].drawText(PVAdress["Postleitzahl"].content, {
          x: 440,
          y: 493,
          size: 8,
        });
        pages2[6].drawText(PVAdress["Gemeinde"].content, {
          x: 107,
          y: 493,
          size: 8,
        });
        pages2[6].drawText(
          PVData["Nennleistung der gesamten Inverter[kW]"].content,
          {
            x: 385,
            y: 435,
            size: 8,
          }
        );

        if (
          Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <
          Number(PVData["Spitzenleistung[kW]"].content)
        ) {
          pages2[6].drawText(
            PVData["Nennleistung der gesamten Inverter[kW]"].content,
            {
              x: 467,
              y: 415,
              size: 8,
            }
          );
        } else if (
          Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) >=
          Number(PVData["Spitzenleistung[kW]"].content)
        ) {
          pages2[6].drawText(PVData["Spitzenleistung[kW]"].content, {
            x: 467,
            y: 415,
            size: 8,
          });
        }

        pages2[7].drawText(
          PersonalData["Vorname"].content +
            " " +
            PersonalData["Nachname"].content,
          {
            x: 78,
            y: 591,
            size: 8,
          }
        );
        pages2[7].drawText(
          PersonalData["Vorname"].content +
            " " +
            PersonalData["Nachname"].content,
          {
            x: 264,
            y: 531,
            size: 8,
          }
        );
        pages2[7].drawText(
          PVAdress["Straße"].content + " " + PVAdress["Nummer"].content,
          {
            x: 272,
            y: 592,
            size: 8,
          }
        );
        pages2[7].drawText(PVAdress["Gemeinde"].content, {
          x: 273,
          y: 571,
          size: 8,
        });

        pages2[8].drawText(
          PersonalData["Vorname"].content +
            " " +
            PersonalData["Nachname"].content,
          {
            x: 88,
            y: 254,
            size: 8,
          }
        );

        pages2[8].drawText(date, {
          x: 58,
          y: 143,
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
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
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
        PersonalData["Straße"].content +
          " " +
          PersonalData["Hausnummer"].content,
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
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
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
        Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <=
        11.08
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
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
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
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
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
        PersonalData["Straße"].content +
          " " +
          PersonalData["Hausnummer"].content,
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
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
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
        Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <=
        11.08
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
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
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
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
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
        PersonalData["Straße"].content +
          " " +
          PersonalData["Hausnummer"].content,
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
        PersonalData[
          "Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"
        ].content,
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
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
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
        Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) <=
        11.08
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
        PersonalData["Vorname"].content +
          " " +
          PersonalData["Nachname"].content,
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

        pages3[12].drawText(
          PersonalData["Vorname"].content +
            " " +
            PersonalData["Nachname"].content,
          {
            x: 78,
            y: 591,
            size: 8,
          }
        );
        pages3[12].drawText(
          PersonalData["Vorname"].content +
            " " +
            PersonalData["Nachname"].content,
          {
            x: 264,
            y: 531,
            size: 8,
          }
        );
        pages3[12].drawText(
          PVAdress["Straße"].content + " " + PVAdress["Nummer"].content,
          {
            x: 272,
            y: 592,
            size: 8,
          }
        );
        pages3[12].drawText(PVAdress["Gemeinde"].content, {
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
        pages3[13].drawText(
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
          x: 342,
          y: 472,
          size: 8,
        });
        pages3[6].drawText(
          PVAdress["Straße"].content + " " + PVAdress["Nummer"].content,
          {
            x: 109,
            y: 513,
            size: 8,
          }
        );
        pages3[6].drawText(PVAdress["Postleitzahl"].content, {
          x: 440,
          y: 493,
          size: 8,
        });
        pages3[6].drawText(PVAdress["Gemeinde"].content, {
          x: 107,
          y: 493,
          size: 8,
        });
        pages3[6].drawText(
          PVData["Nennleistung der gesamten Inverter[kW]"].content,
          {
            x: 385,
            y: 435,
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
              x: 467,
              y: 415,
              size: 8,
            }
          );
        } else if (
          Number(PVData["Nennleistung der gesamten Inverter[kW]"].content) >=
          Number(PVData["Spitzenleistung[kW]"].content)
        ) {
          pages3[6].drawText(PVData["Spitzenleistung[kW]"].content, {
            x: 467,
            y: 415,
            size: 8,
          });
        }

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
      user: "gabrielmaler789@gmail.com",
      pass: "owvmuijpjvbqrqpe",
    },
  });

  await Promise.all(
    filesToSend.map(async (doc, index) => {
      ++index;
      await transporter.sendMail({
        from: "gabrielmaler789@gmail.com",
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
