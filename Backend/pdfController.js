const { PDFDocument } = require("pdf-lib");
const { writeFileSync, readFileSync, unlinkSync } = require("fs");
const nodemailer = require("nodemailer");

exports.uploadFile = async (req, res) => {
  //console.log("req.body");
  //console.log(req.file.filename);
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
  const SignatureFilename = req.body.Unterschrift.filename;
  const AusweisFilename = req.body.Ausweis.filename;
  const StromrechnungFilename = req.body.Stromrechnung.filename;
  const KatasterFilename = req.body.Kataster.filename;
  const current = new Date();
  const date = `${current.getDate()}.${
    current.getMonth() + 1
  }.${current.getFullYear()}`;
  const Geburtsdatum = changeDateFormat(PersonalData["Geburtsdatum"].content);
  const Baubeginn = changeDateFormat(PVData["Baubeginn"].content);
  if (
    PVData["POD"].content.split("")[2] === "1" &&
    PVData["POD"].content.split("")[3] === "5" &&
    PVData["POD"].content.split("")[4] === "9"
  ) {
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
    let filename2 =
        "Bozza Regolamento_BT_Vierschach_2023_" +
        PersonalData["Nachname"].content +
        "_" +
        PersonalData["Vorname"].content +
        ".pdf",
      path2 =
        "./Bozza Regolamento_BT_Vierschach_2023_" +
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

    let pdfDoc2 = await PDFDocument.load(
      readFileSync(
        "./Backend/Documents/Bozza Regolamento_BT_Vierschach_2023.pdf"
      )
    );
    const pages2 = pdfDoc2.getPages();

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
    pages[0].drawText(PVData["Nennleistung[kW]"].content, {
      x: 420,
      y: 408,
      size: 6,
    });
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
      Number(PVData["Nennleistung[kW]"].content) <
      Number(PVData["Spitzenleistung[kW]"].content)
    ) {
      pages[0].drawText(PVData["Nennleistung[kW]"].content, {
        x: 432,
        y: 57,
        size: 8,
      });
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
    pages[2].drawText(PVData["Nennleistung[kW]"].content, {
      x: 397,
      y: 621,
      size: 6,
    });
    if (
      Number(PVData["Nennleistung[kW]"].content) <
      Number(PVData["Spitzenleistung[kW]"].content)
    ) {
      pages[2].drawText(PVData["Nennleistung[kW]"].content, {
        x: 133,
        y: 612,
        size: 5,
      });
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
    if (Number(PVData["Nennleistung[kW]"].content) > 11.04) {
      pages[2].drawText(SPI["Modell"].content, {
        x: 257,
        y: 470,
        size: 6,
      });
    } else if (Number(PVData["Nennleistung[kW]"].content) <= 11.04) {
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
    pages[2].drawText(PVData["Nennleistung[kW]"].content, {
      x: 246,
      y: 448,
      size: 5,
    });
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

    //let pdfDoc2 = await PDFDocument.load(
    //  readFileSync(
    //    "./Documents/Delega_mandato_di_rappresentanza_Unificato_TICA.pdf"
    //  )
    //);
    //const pages2 = pdfDoc2.getPages();

    pages2[0].drawText(
      PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
      {
        x: 186,
        y: 591,
        size: 8,
      }
    );
    pages2[0].drawText(
      PersonalData["Geburtsort"].content +
        " " +
        PersonalData["Geburtsdatum"].content,
      {
        x: 205,
        y: 572,
        size: 8,
      }
    );
    pages2[0].drawText(PersonalData["Steuernummer"].content, {
      x: 219,
      y: 554,
      size: 8,
    });
    pages2[0].drawText(PersonalData["Partita Iva"].content, {
      x: 405,
      y: 554,
      size: 8,
    });
    pages2[0].drawText(
      PersonalData["Straße"].content + " " + PersonalData["Hausnummer"].content,
      {
        x: 131,
        y: 536,
        size: 8,
      }
    );
    pages2[0].drawText(PersonalData["Fraktion"].content, {
      x: 450,
      y: 536,
      size: 8,
    });
    pages2[0].drawText(PersonalData["Wohnhaft in der Gemeinde"].content, {
      x: 131,
      y: 517,
      size: 8,
    });
    pages2[0].drawText(PersonalData["Postleitzahl"].content, {
      x: 408,
      y: 517,
      size: 8,
    });
    if (PersonalData["Privatperson"].selectedValue === "Ja") {
      pages2[0].drawLine({
        start: { x: 72, y: 472 },
        end: { x: 85, y: 458 },
      });
      pages2[0].drawLine({
        start: { x: 72, y: 458 },
        end: { x: 85, y: 472 },
      });
    } else {
      pages2[0].drawText("legale rappresentante", {
        x: 144,
        y: 422,
        size: 8,
      });
      pages2[0].drawText(PersonalData["Privatperson"].content, {
        x: 396,
        y: 404,
        size: 8,
      });
    }

    pages2[1].drawText(PVAdress["Straße"].content, {
      x: 78,
      y: 569,
      size: 8,
    });
    pages2[1].drawText(PVAdress["Nummer"].content, {
      x: 458,
      y: 569,
      size: 8,
    });
    pages2[1].drawText(PVAdress["Gemeinde"].content, {
      x: 74,
      y: 549,
      size: 8,
    });
    pages2[1].drawText(PVAdress["Postleitzahl"].content, {
      x: 386,
      y: 549,
      size: 8,
    });
    pages2[1].drawText(PVData["POD"].content, {
      x: 395,
      y: 513,
      size: 8,
    });
    pages2[1].drawText(PVData["Nennleistung[kW]"].content, {
      x: 320,
      y: 435,
      size: 8,
    });

    pages2[7].drawText(
      PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
      {
        x: 76,
        y: 255,
        size: 8,
      }
    );
    pages2[7].drawText(PersonalData["Telefonnummer"].content, {
      x: 369,
      y: 255,
      size: 8,
    });
    pages2[7].drawText(PersonalData["Email"].content, {
      x: 453,
      y: 255,
      size: 8,
    });

    if (PVData["Spannung der Anlage"].selectedValue === "Monofase") {
      pages2[10].drawText("230", {
        x: 323,
        y: 535,
        size: 8,
      });
      pages2[12].drawLine({
        start: { x: 301, y: 286 },
        end: { x: 314, y: 274 },
      });
      pages2[12].drawLine({
        start: { x: 301, y: 274 },
        end: { x: 314, y: 286 },
      });
    } else if (PVData["Spannung der Anlage"].selectedValue === "Trifase") {
      pages2[10].drawText("400", {
        x: 323,
        y: 535,
        size: 8,
      });
      pages2[12].drawLine({
        start: { x: 389, y: 286 },
        end: { x: 402, y: 274 },
      });
      pages2[12].drawLine({
        start: { x: 389, y: 274 },
        end: { x: 402, y: 286 },
      });
    }
    if (
      Number(PVData["Nennleistung[kW]"].content) <
      Number(PVData["Spitzenleistung[kW]"].content)
    ) {
      pages2[10].drawText(PVData["Nennleistung[kW]"].content, {
        x: 324,
        y: 474,
        size: 8,
      });
    } else if (
      Number(PVData["Nennleistung[kW]"].content) >=
      Number(PVData["Spitzenleistung[kW]"].content)
    ) {
      pages2[10].drawText(PVData["Spitzenleistung[kW]"].content, {
        x: 324,
        y: 474,
        size: 8,
      });
    }

    pages2[12].drawText(PVData["Nennleistung[kW]"].content, {
      x: 90,
      y: 237,
      size: 8,
    });

    pages2[15].drawText(SPI["Marke"].content, {
      x: 197,
      y: 691,
      size: 8,
    });
    pages2[15].drawText(SPI["Modell"].content, {
      x: 142,
      y: 674,
      size: 8,
    });

    if (Number(PVData["Nennleistung[kW]"].content) > 11.04) {
      pages2[15].drawLine({
        start: { x: 302, y: 640 },
        end: { x: 315, y: 627 },
      });
      pages2[15].drawLine({
        start: { x: 302, y: 627 },
        end: { x: 315, y: 640 },
      });
    } else if (Number(PVData["Nennleistung[kW]"].content) <= 11.04) {
      pages2[15].drawLine({
        start: { x: 231, y: 640 },
        end: { x: 244, y: 627 },
      });
      pages2[15].drawLine({
        start: { x: 231, y: 627 },
        end: { x: 244, y: 640 },
      });
    }

    pages2[18].drawText(Speicher["Marke"].content, {
      x: 88,
      y: 602,
      size: 8,
    });
    pages2[18].drawText(Speicher["Modell"].content, {
      x: 215,
      y: 602,
      size: 8,
    });
    pages2[18].drawText(PVData["Speicher"].leistung, {
      x: 325,
      y: 602,
      size: 8,
    });
    429;

    pages2[21].drawText(
      PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
      {
        x: 107,
        y: 550,
        size: 8,
      }
    );
    pages2[21].drawText(PersonalData["Telefonnummer"].content, {
      x: 429,
      y: 550,
      size: 8,
    });

    //let pdfDoc3 = await PDFDocument.load(
    //  readFileSync("./Documents/Regolamento di Esercizio BT.pdf")
    //);
    //const pages3 = pdfDoc3.getPages();

    writeFileSync(
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
    );
  } else {
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
        "Regolamento di Esercizio BT_" +
        PersonalData["Nachname"].content +
        "_" +
        PersonalData["Vorname"].content +
        ".pdf",
      path3 =
        "./Regolamento di Esercizio BT_" +
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

    let pdfDoc2 = await PDFDocument.load(
      readFileSync(
        "./Backend/Documents/Delega_mandato_di_rappresentanza_Unificato_TICA.pdf"
      )
    );
    const pages2 = pdfDoc2.getPages();

    let pdfDoc3 = await PDFDocument.load(
      readFileSync("./Backend/Documents/Regolamento di Esercizio BT.pdf")
    );
    const pages3 = pdfDoc3.getPages();

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
    pages[0].drawText(PVData["Nennleistung[kW]"].content, {
      x: 420,
      y: 408,
      size: 6,
    });
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
      Number(PVData["Nennleistung[kW]"].content) <
      Number(PVData["Spitzenleistung[kW]"].content)
    ) {
      pages[0].drawText(PVData["Nennleistung[kW]"].content, {
        x: 432,
        y: 57,
        size: 8,
      });
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
    pages[2].drawText(PVData["Nennleistung[kW]"].content, {
      x: 397,
      y: 621,
      size: 6,
    });
    if (
      Number(PVData["Nennleistung[kW]"].content) <
      Number(PVData["Spitzenleistung[kW]"].content)
    ) {
      pages[2].drawText(PVData["Nennleistung[kW]"].content, {
        x: 133,
        y: 612,
        size: 5,
      });
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
    if (Number(PVData["Nennleistung[kW]"].content) > 11.04) {
      pages[2].drawText(SPI["Modell"].content, {
        x: 257,
        y: 470,
        size: 6,
      });
    } else if (Number(PVData["Nennleistung[kW]"].content) <= 11.04) {
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
    pages[2].drawText(PVData["Nennleistung[kW]"].content, {
      x: 246,
      y: 448,
      size: 5,
    });
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

    //let pdfDoc2 = await PDFDocument.load(
    //  readFileSync(
    //    "./Documents/Delega_mandato_di_rappresentanza_Unificato_TICA.pdf"
    //  )
    //);
    //const pages2 = pdfDoc2.getPages();

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
      PersonalData["Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"]
        .content,
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

    //let pdfDoc3 = await PDFDocument.load(
    //  readFileSync("./Documents/Regolamento di Esercizio BT.pdf")
    //);
    //const pages3 = pdfDoc3.getPages();

    pages3[0].drawLine({
      start: { x: 50, y: 250 },
      end: { x: 250, y: 250 },
    });
    pages3[0].drawText(
      PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
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
      PersonalData["Straße"].content + " " + PersonalData["Hausnummer"].content,
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
      PersonalData["Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"]
        .content,
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

    pages3[2].drawText(PVData["Nennleistung[kW]"].content, {
      x: 388,
      y: 622,
      size: 8,
    });
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
      PersonalData["Straße"].content + " " + PersonalData["Hausnummer"].content,
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
      PersonalData["Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"]
        .content,
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
      PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
      {
        x: 141,
        y: 482,
        size: 8,
      }
    );
    pages3[5].drawText(
      PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
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

    pages3[12].drawText(
      PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
      {
        x: 78,
        y: 591,
        size: 8,
      }
    );
    pages3[12].drawText(
      PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
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

    pages3[14].drawText(
      PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
      {
        x: 108,
        y: 645,
        size: 8,
      }
    );
    pages3[14].drawText(PersonalData["Geburtsort"].content, {
      x: 287,
      y: 645,
      size: 8,
    });
    pages3[14].drawText(Geburtsdatum, {
      x: 58,
      y: 634,
      size: 8,
    });
    pages3[14].drawText(PersonalData["Steuernummer"].content, {
      x: 214,
      y: 634,
      size: 8,
    });
    pages3[14].drawText(PersonalData["Straße"].content, {
      x: 405,
      y: 634,
      size: 8,
    });
    pages3[14].drawText(PersonalData["Hausnummer"].content, {
      x: 499,
      y: 634,
      size: 8,
    });
    pages3[14].drawText(PersonalData["Postleitzahl"].content, {
      x: 58,
      y: 623,
      size: 8,
    });
    pages3[14].drawText(PersonalData["Wohnhaft in der Gemeinde"].content, {
      x: 154,
      y: 623,
      size: 8,
    });
    pages3[14].drawText(
      PersonalData["Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"]
        .content,
      {
        x: 266,
        y: 623,
        size: 8,
      }
    );
    pages3[14].drawText(PVData["POD"].content, {
      x: 92,
      y: 577,
      size: 8,
    });
    pages3[14].drawText(
      PVAdress["Straße"].content + " " + PVAdress["Nummer"].content,
      {
        x: 110,
        y: 565,
        size: 8,
      }
    );
    pages3[14].drawText(PVAdress["Postleitzahl"].content, {
      x: 223,
      y: 566,
      size: 8,
    });
    pages3[14].drawText(PVAdress["Gemeinde"].content, {
      x: 357,
      y: 566,
      size: 8,
    });
    pages3[14].drawText(PVData["Nennleistung[kW]"].content, {
      x: 195,
      y: 554,
      size: 8,
    });

    if (
      Number(PVData["Nennleistung[kW]"].content) <
      Number(PVData["Spitzenleistung[kW]"].content)
    ) {
      pages3[14].drawText(PVData["Nennleistung[kW]"].content, {
        x: 246,
        y: 541,
        size: 8,
      });
      pages3[2].drawText(PVData["Nennleistung[kW]"].content, {
        x: 216,
        y: 588,
        size: 8,
      });
    } else if (
      Number(PVData["Nennleistung[kW]"].content) >=
      Number(PVData["Spitzenleistung[kW]"].content)
    ) {
      pages3[14].drawText(PVData["Spitzenleistung[kW]"].content, {
        x: 246,
        y: 541,
        size: 8,
      });
      pages3[2].drawText(PVData["Spitzenleistung[kW]"].content, {
        x: 216,
        y: 588,
        size: 8,
      });
    }
    pages3[13].drawText(
      PersonalData["Vorname"].content + " " + PersonalData["Nachname"].content,
      {
        x: 84,
        y: 253,
        size: 8,
      }
    );

    /*
  writeFileSync(
    filename,
    await pdfDoc.save().then(
      writeFileSync(
        filename2,
        await pdfDoc2.save().then(
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
  );*/
    writeFileSync(
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
    );
  }
};
const changeDateFormat = (olddate) => {
  let help = olddate.split("-");
  return help[2] + "/" + help[1] + "/" + help[0];
};

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
