import uniqid from "uniqid";

let PVData = [],
  PersonalData = [],
  PVLocation = [],
  PersonalDataEl = [],
  Mod = [],
  Uebergabe = [],
  Inv = [],
  Speiche = [];

PersonalData["Vorname"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};
PersonalData["Nachname"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};
PersonalData["Geburtsort"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};
PersonalData["Geburtsdatum"] = {
  type: "date",
  key: uniqid(),
  content: "",
  required: true,
};
PersonalData["Steuernummer"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};
PersonalData["Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
  maxlength: "2",
};
PersonalData["Wohnhaft in der Gemeinde"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};
PersonalData["Fraktion"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};
PersonalData["Straße"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};
PersonalData["Hausnummer"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};
PersonalData["Postleitzahl"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};
PersonalData["Steuernummer"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};
PersonalData["Partita Iva"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: false,
};
PersonalData["Telefonnummer"] = {
  type: "tel",
  key: uniqid(),
  content: "",
  required: true,
};
PersonalData["Email"] = {
  type: "mail",
  key: uniqid(),
  content: "",
  required: true,
};
PersonalData["IBAN"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};
PersonalData["IBAN laufend auf"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};
PersonalData["Privatperson"] = {
  type: "radio",
  key: uniqid(),
  content: "",
  required: true,
  selectedValue: "Ja",
};
PVData["Baubeginn"] = {
  type: "date",
  key: uniqid(),
  content: "",
  required: true,
};
PVData["Name PV-Anlage"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};
PVData["Spitzenleistung[kW]"] = {
  type: "number",
  key: uniqid(),
  content: "",
  required: true,
};
PVData["Nennleistung[kW]"] = {
  type: "number",
  key: uniqid(),
  content: "",
  required: true,
};
PVData["POD"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};
PVData["Speicher"] = {
  type: "radio",
  key: uniqid(),
  required: true,
  content: "",
  leistung: "",
  selectedValue: "Ja",
};
PVLocation["Provinz (Abkürzung, maximal 2 Zeichen ,z.B. BZ für Bozen)"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
  maxlength: "2",
};
PVLocation["Postleitzahl"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};
PVLocation["Gemeinde"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};
PVLocation["Fraktion"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};
PVLocation["Straße"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};
PVLocation["Nummer"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};
PVLocation["Kataster-Blatt"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};
PVLocation["Kataster-Parzelle"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};
PVLocation["Kataster-Sub."] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: false,
};
let Signature = {
  filename: [],
};
let id = {
  filename: [],
};
let bill = {
  filename: [],
};
let Cadastral = {
  filename: [],
};

PVData["Spannung der Anlage"] = {
  type: "radio",
  key: uniqid(),
  required: true,
  content: "",
  selectedValue: "Monofase",
};
PersonalData["Steuer"] = {
  type: "radio",
  key: uniqid(),
  required: true,
  content: "",
  selectedValue: "110% Steuerbonus",
};
PersonalDataEl["Vorname"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};
PersonalDataEl["Nachname"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};
PersonalDataEl["Telefonnummer"] = {
  type: "tel",
  key: uniqid(),
  content: "",
  required: true,
};
PersonalDataEl["Email"] = {
  type: "mail",
  key: uniqid(),
  content: "",
  required: true,
};

Mod["Marke"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};

Mod["Modell"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};
Mod["Anzahl"] = {
  type: "number",
  key: uniqid(),
  content: "",
  required: true,
};
Mod["Leistung[kW]"] = {
  type: "number",
  key: uniqid(),
  content: "",
  required: true,
};

Uebergabe["Marke"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};
Uebergabe["Modell"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};
Inv["Marke"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};
Inv["Modell"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};
Speiche["Marke"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};
Speiche["Modell"] = {
  type: "text",
  key: uniqid(),
  content: "",
  required: true,
};

export {
  PVData,
  PersonalData,
  PersonalDataEl,
  PVLocation,
  Signature,
  id,
  bill,
  Cadastral,
  Mod,
  Uebergabe,
  Inv,
  Speiche,
};
