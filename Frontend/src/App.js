import style from "./styles/App.module.css";
import { DataField } from "./components/DataField";
import { TechnikField } from "./components/TechnikField";
import {
  PVData,
  PVLocation,
  PersonalData,
  PersonalDataEl,
  Signature,
  id,
  Cadastral,
  bill,
  Mod,
  Uebergabe,
  Inv,
  Speiche,
} from "./components/SetDataFields";
import { useState } from "react";
import axios from "axios";
import { useRef } from "react";
import { flushSync } from "react-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [Personendaten, setPersonendaten] = useState(PersonalData);
  const [PersonendatenEl, setPersonendatenEl] = useState(PersonalDataEl);
  const [PVDaten, setPVDaten] = useState(PVData);
  const [PVAdresse, setPVAdresse] = useState(PVLocation);
  const [Modul, setModul] = useState(Mod);
  const [Spi, setSpi] = useState(Uebergabe);
  const [Inverter, setInverter] = useState(Inv);
  const [Speicher, setSpeicher] = useState(Speiche);
  const [isButtonenabled, setButtonenabled] = useState(false);

  const [Unterschrift, setUnterschrift] = useState(Signature);
  const [Ausweis, setAusweis] = useState(id);
  const [Stromrechnung, setStromrechnung] = useState(bill);
  const [Kataster, setKataster] = useState(Cadastral);

  const [file, setFile] = useState();
  const [fileAusweis, setFileAusweis] = useState();
  const [fileStromrechnung, setFileStromrechnung] = useState();
  const [fileKataster, setFileKataster] = useState();
  const hiddenFileInput = useRef(null);
  const hiddenFileInputAusweis = useRef(null);
  const hiddenFileInputStromrechnung = useRef(null);
  const hiddenFileInputKataster = useRef(null);
  const [uploadedFileURL, setUploadedFileURL] = useState(
    "Es wurde noch keine Datei hochgeladen!"
  );
  const [uploadedFileURLAusweis, setUploadedFileURLAusweis] = useState(
    "Es wurde noch keine Datei hochgeladen!"
  );
  const [uploadedFileURLStromrechnung, setUploadedFileURLStromrechnung] =
    useState("Es wurde noch keine Datei hochgeladen!");
  const [uploadedFileURLKataster, setUploadedFileURLKataster] = useState(
    "Es wurde noch keine Datei hochgeladen!"
  );
  const handleChangeEl = () => (e) => {
    let copy = Object.assign({}, PersonendatenEl);
    copy[e.target.id].content = e.target.value;
    setPersonendatenEl(copy);
  };
  const handleChangeModul = () => (e) => {
    let copy = Object.assign({}, Modul);
    copy[e.target.id].content = e.target.value;
    setModul(copy);
  };
  const handleChangeSpi = () => (e) => {
    let copy = Object.assign({}, Spi);
    copy[e.target.id].content = e.target.value;
    setSpi(copy);
  };
  const handleChangeInverter = () => (e) => {
    let copy = Object.assign({}, Inverter);
    copy[e.target.id].content = e.target.value;
    setInverter(copy);
  };
  const handleChangeSpeicher = () => (e) => {
    let copy = Object.assign({}, Speicher);
    copy[e.target.id].content = e.target.value;
    setSpeicher(copy);
  };
  function handleUpload(event, fileToUse) {
    event.preventDefault();
    if (fileToUse === undefined) {
      toast.warning("Bitte wählen Sie eine Datei aus!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }
    let format = fileToUse.name.split(".");
    if (format[format.length - 1] === "js") {
      toast.error("Hochgeladener Filetyp wird nicht unterstützt!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      setFile("");
      return;
    }
    const PORT = process.env.PORT || 8001;
    const url = "http://localhost:" + PORT + "/uploadFile";
    //const url =
    //  "https://erstelledocsbackup-production.up.railway.app/uploadFile";
    const formData = new FormData();
    formData.append("file", fileToUse);
    formData.append("fileName", fileToUse.name);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios.post(url, formData, config).then((response) => {
      let stringURL = "";
      let splitedResponse = response.data.split("_");
      for (let i = 1; i < splitedResponse.length; i++) {
        stringURL = stringURL + splitedResponse[i];
      }
      setUploadedFileURL('"' + stringURL + '" wurde erfolgreich hochgeladen!');
      let copy = Object.assign({}, Unterschrift);
      copy.filename.push(response.data);
      setUnterschrift(copy);
      toast.success('"' + stringURL + '" wurde erfolgreich hochgeladen!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    });
  }
  function handleUploadAusweis(event, fileToUse) {
    event.preventDefault();
    if (fileToUse === undefined) {
      toast.warning("Bitte wählen Sie eine Datei aus!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }
    let format = fileToUse.name.split(".");
    if (format[format.length - 1] === "js") {
      toast.error("Hochgeladener Filetyp wird nicht unterstützt!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setFileAusweis("");
      return;
    }

    event.preventDefault();
    const PORT = process.env.PORT || 8001;
    const url = "http://localhost:" + PORT + "/uploadAusweis";
    //const url =
    //  "https://erstelledocsbackup-production.up.railway.app/uploadAusweis";
    const formData = new FormData();
    formData.append("file", fileToUse);
    formData.append("fileName", fileToUse.name);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios.post(url, formData, config).then((response) => {
      let stringURL = "";
      let splitedResponse = response.data.split("_");
      for (let i = 1; i < splitedResponse.length; i++) {
        stringURL = stringURL + splitedResponse[i];
      }
      setUploadedFileURLAusweis(
        '"' + stringURL + '" wurde erfolgreich hochgeladen!'
      );
      let copy = Object.assign({}, Ausweis);
      copy.filename.push(response.data);
      setAusweis(copy);
      toast.success('"' + stringURL + '" wurde erfolgreich hochgeladen!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    });
  }
  function handleUploadStromrechnung(event, fileToUse) {
    event.preventDefault();
    if (fileToUse === undefined) {
      toast.warning("Bitte wählen Sie eine Datei aus!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }
    let format = fileToUse.name.split(".");
    if (format[format.length - 1] === "js") {
      toast.error("Hochgeladener Filetyp wird nicht unterstützt!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setFileStromrechnung("");
      return;
    }
    event.preventDefault();
    const PORT = process.env.PORT || 8001;
    const url = "http://localhost:" + PORT + "/uploadStromrechnung";
    //const url =
    //  "https://erstelledocsbackup-production.up.railway.app/uploadStromrechnung";
    const formData = new FormData();
    formData.append("file", fileToUse);
    formData.append("fileName", fileToUse.name);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios.post(url, formData, config).then((response) => {
      let stringURL = "";
      let splitedResponse = response.data.split("_");
      for (let i = 1; i < splitedResponse.length; i++) {
        stringURL = stringURL + splitedResponse[i];
      }
      setUploadedFileURLStromrechnung(
        '"' + stringURL + '" wurde erfolgreich hochgeladen!'
      );
      let copy = Object.assign({}, Stromrechnung);
      copy.filename.push(response.data);
      setStromrechnung(copy);
      toast.success('"' + stringURL + '" wurde erfolgreich hochgeladen!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    });
  }
  function handleUploadKataster(event, fileToUse) {
    event.preventDefault();
    if (fileToUse === undefined) {
      toast.warning("Bitte wählen Sie eine Datei aus!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }
    let format = fileToUse.name.split(".");
    if (format[format.length - 1] === "js") {
      toast.error("Hochgeladener Filetyp wird nicht unterstützt!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setFileKataster("");
      return;
    }
    event.preventDefault();
    const PORT = process.env.PORT || 8001;
    const url = "http://localhost:" + PORT + "/uploadKataster";

    //const url =
    //  "https://erstelledocsbackup-production.up.railway.app/uploadKataster";
    const formData = new FormData();
    formData.append("file", fileToUse);
    formData.append("fileName", fileToUse.name);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios.post(url, formData, config).then((response) => {
      let stringURL = "";
      let splitedResponse = response.data.split("_");
      for (let i = 1; i < splitedResponse.length; i++) {
        stringURL = stringURL + splitedResponse[i];
      }
      setUploadedFileURLKataster(
        '"' + stringURL + '" wurde erfolgreich hochgeladen!'
      );
      let copy = Object.assign({}, Kataster);
      copy.filename.push(response.data);
      setKataster(copy);
      toast.success('"' + stringURL + '" wurde erfolgreich hochgeladen!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    });
  }

  const handleChangePerson = () => (e) => {
    let copy = Object.assign({}, Personendaten);
    copy[e.target.id].content = e.target.value;
    setPersonendaten(copy);
  };
  const handleChangePvData = () => (e) => {
    let copy = Object.assign({}, PVDaten);
    copy[e.target.id].content = e.target.value;
    setPVDaten(copy);
  };
  const handleChangePvAdress = () => (e) => {
    let copy = Object.assign({}, PVAdresse);
    copy[e.target.id].content = e.target.value;
    setPVAdresse(copy);
  };
  const handleChangePrivatpersonContent = () => (e) => {
    if (Personendaten["Privatperson"].selectedValue === "Ja") return;
    let copy = Object.assign({}, Personendaten);
    copy["Privatperson"].content = e.target.value;
    setPersonendaten(copy);
  };
  const handleChangePrivatpersonRadiobutton = (value) => {
    let copy = Object.assign({}, Personendaten);
    copy["Privatperson"].selectedValue = value;
    if (Personendaten["Privatperson"].selectedValue === "Ja") {
      copy["Privatperson"].content = "";
      copy["Partita Iva"].required = false;
    } else copy["Partita Iva"].required = true;
    setPersonendaten(copy);
  };
  const handleChangeSpeicherContent = () => (e) => {
    if (PVDaten["Speicher"].selectedValue === "Nein") return;
    let copy = Object.assign({}, PVDaten);
    copy["Speicher"].content = e.target.value;
    setPVDaten(copy);
  };
  const handleChangeSpeicherLeistung = () => (e) => {
    if (PVDaten["Speicher"].selectedValue === "Nein") return;
    let copy = Object.assign({}, PVDaten);
    copy["Speicher"].leistung = e.target.value;
    setPVDaten(copy);
  };
  const handleChangeSpeicherRadioButton = (value) => {
    let copy = Object.assign({}, PVDaten);
    copy["Speicher"].selectedValue = value;
    if (PVDaten["Speicher"].selectedValue === "Nein") {
      copy["Speicher"].content = "";
      copy["Speicher"].leistung = "";
    }
    setPVDaten(copy);
  };
  const handleChangeSteuer = (value) => {
    let copy = Object.assign({}, Personendaten);
    copy["Steuer"].selectedValue = value;
    setPersonendaten(copy);
  };

  const handleChangeSpannungRadioButton = (value) => {
    let copy = Object.assign({}, PVDaten);
    copy["Spannung der Anlage"].selectedValue = value;
    setPVDaten(copy);
  };
  const createPDF = async (e) => {
    e.preventDefault();
    if (file === undefined) {
      toast.warning(
        "Sie müssen noch ein Foto mit Ihrer Unterschrift hochladen.",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );
      return;
    }
    if (fileAusweis === undefined) {
      toast.warning("Sie müssen noch eine Kopie Ihres Ausweißes hochladen.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }
    if (fileStromrechnung === undefined) {
      toast.warning(
        "Sie müssen noch eine Kopie Ihrer Stromrechnung hochladen.",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );
      return;
    }
    if (fileKataster === undefined) {
      toast.warning(
        "Sie müssen noch eine Kopie Ihres Katasterauszuges hochladen.",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );
      return;
    }
    setButtonenabled(true);
    const data = {
      PVDaten,
      PVAdresse,
      Personendaten,
      PersonendatenEl,
      Unterschrift,
      Ausweis,
      Stromrechnung,
      Kataster,
      Modul,
      Inverter,
      Spi,
      Speicher,
    };
    const id = toast.loading("Bitte warten, ihre Daten werden übermittelt.", {
      autoClose: false,
    });
    const PORT = process.env.PORT || 8001;
    const url = "http://localhost:" + PORT + "/createPdf";

    //const url =
    //  "https://erstelledocsbackup-production.up.railway.app/createPdf";

    axios
      .post(url, data)
      .then((res) => {
        alert(res.data);
        window.location.reload(false);
      })
      .catch((err) => {
        toast.update(id, {
          render: "Etwas is schiefgelaufen, versuchen Sie es später nocheinmal",
          type: "error",
          isLoading: false,
          autoClose: false,
        });
        /*toast.error(err + "\nVersuchen Sie es später nocheinmal", {
          position: "top-center",
          autoClose: 100000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });*/
      });
  };

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  const handleChange = (event) => {
    flushSync(() => {
      setFile(event.target.files[0]);
    });
    handleUpload(event, event.target.files[0]);
  };

  const handleClickAusweis = (event) => {
    hiddenFileInputAusweis.current.click();
  };
  const handleChangeAusweis = (event) => {
    flushSync(() => {
      setFileAusweis(event.target.files[0]);
    });
    handleUploadAusweis(event, event.target.files[0]);
  };

  const handleClickStromrechnung = (event) => {
    hiddenFileInputStromrechnung.current.click();
  };
  const handleChangeStromrechnung = (event) => {
    flushSync(() => {
      setFileStromrechnung(event.target.files[0]);
    });
    handleUploadStromrechnung(event, event.target.files[0]);
  };

  const handleClickKataster = (event) => {
    hiddenFileInputKataster.current.click();
  };
  const handleChangeKataster = (event) => {
    flushSync(() => {
      setFileKataster(event.target.files[0]);
    });
    handleUploadKataster(event, event.target.files[0]);
  };
  return (
    <div className="App">
      <ToastContainer
        position="top-center"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <section className={style.container}>
        <div className={style.header}>
          <div className={style.image}></div>
          <h1>Produzentenportal für PV-Anlagen (Baubeginn)</h1>
        </div>
        <div className={style.section}>
          <h2>Unterschrift</h2>
          <div className={style.description}>
            Bitte laden Sie hier Ihre Unterschrift hoch.
          </div>
          <button className={style.buttonupload} onClick={handleClick}>
            Datei hochladen
          </button>
          <input
            type="file"
            onChange={handleChange}
            ref={hiddenFileInput}
            style={{ display: "none" }}
          />
          <div>{uploadedFileURL}</div>
        </div>
        <div className={style.section}>
          <h2>Ausweiß</h2>
          <div className={style.description}>
            Laden Sie hier bitte eine Kopie Ihres Ausweißes hoch.
          </div>
          <button className={style.buttonupload} onClick={handleClickAusweis}>
            Datei hochladen
          </button>
          <input
            type="file"
            onChange={handleChangeAusweis}
            ref={hiddenFileInputAusweis}
            style={{ display: "none" }}
          />
          <div>{uploadedFileURLAusweis}</div>
        </div>
        <div className={style.section}>
          <h2>Stromrechnung</h2>
          <div className={style.description}>
            Laden Sie hier bitte eine Kopie Ihrer aktuellen Stromrechnung hoch.
          </div>
          <button
            className={style.buttonupload}
            onClick={handleClickStromrechnung}
          >
            Datei hochladen
          </button>
          <input
            type="file"
            onChange={handleChangeStromrechnung}
            ref={hiddenFileInputStromrechnung}
            style={{ display: "none" }}
          />
          <div>{uploadedFileURLStromrechnung}</div>
        </div>
        <div className={style.section}>
          <h2>Katasterauszug</h2>
          <div className={style.description}>
            Laden Sie hier bitte eine Kopie Ihres Katasterauszuges hoch.
          </div>
          <button className={style.buttonupload} onClick={handleClickKataster}>
            Datei hochladen
          </button>
          <input
            type="file"
            onChange={handleChangeKataster}
            ref={hiddenFileInputKataster}
            style={{ display: "none" }}
          />
          <div>{uploadedFileURLKataster}</div>
        </div>
        <form onSubmit={createPDF}>
          <div className={style.section}>
            <h2>Persönliche Daten</h2>
            {Object.keys(Personendaten).map((key) => {
              return (
                <DataField
                  name={key}
                  type={Personendaten[key].type}
                  key={Personendaten[key].key}
                  value={Personendaten[key].content}
                  onChange={handleChangePerson()}
                  required={Personendaten[key].required}
                  maxlength={Personendaten[key].maxlength}
                ></DataField>
              );
            })}
            <div className={style.question}>
              Führen Sie die Arbeiten als Privatperson durch?
            </div>
            <div className={style.inputbox}>
              <div>
                <input
                  className={style.radiobutton}
                  type="radio"
                  id="Ja"
                  name="Privatperson"
                  value="Ja"
                  onChange={() => handleChangePrivatpersonRadiobutton("Ja")}
                  checked={Personendaten["Privatperson"].selectedValue === "Ja"}
                ></input>
                <label htmlFor="Ja">Ja</label>
              </div>
              <div>
                <input
                  className={style.radiobutton}
                  type="radio"
                  id="Nein"
                  name="Privatperson"
                  value="Nein"
                  onChange={() => handleChangePrivatpersonRadiobutton("Nein")}
                  checked={
                    Personendaten["Privatperson"].selectedValue === "Nein"
                  }
                ></input>
                <label htmlFor="nein">
                  Nein, ich führe die Arbeiten als gesetzlicher Vertreter
                  folgendes Unternehmens durch:
                </label>
                <input
                  type="text"
                  value={Personendaten["Privatperson"].content}
                  onChange={handleChangePrivatpersonContent()}
                  className={style.inputtextfield}
                ></input>
              </div>
            </div>
          </div>
          <div className={style.section}>
            <h2>Steuerrechtliche Angaben</h2>
            <div className={style.inputbox} id={style.spannung}>
              <div>
                <input
                  className={style.radiobutton}
                  type="radio"
                  id="110% Steuerbonus"
                  name="Steuer"
                  value="110% Steuerbonus"
                  onChange={() => handleChangeSteuer("110% Steuerbonus")}
                  checked={
                    Personendaten["Steuer"].selectedValue === "110% Steuerbonus"
                  }
                ></input>
                <label htmlFor="110% Steuerbonus">110% Steuerbonus</label>
              </div>
              <div>
                <input
                  className={style.radiobutton}
                  type="radio"
                  id="50% Steuerbonus"
                  name="Steuer"
                  value="50% Steuerbonus"
                  onChange={() => handleChangeSteuer("50% Steuerbonus")}
                  checked={
                    Personendaten["Steuer"].selectedValue === "50% Steuerbonus"
                  }
                ></input>
                <label htmlFor="50% Steuerbonus">50% Steuerbonus</label>
              </div>
              <div>
                <input
                  className={style.radiobutton}
                  type="radio"
                  id="Ansuchen für Landesbeitrag"
                  name="Steuer"
                  value="Ansuchen für Landesbeitrag"
                  onChange={() =>
                    handleChangeSteuer("Ansuchen für Landesbeitrag")
                  }
                  checked={
                    Personendaten["Steuer"].selectedValue ===
                    "Ansuchen für Landesbeitrag"
                  }
                ></input>
                <label htmlFor="Ansuchen für Landesbeitrag">
                  Ansuchen für Landesbeitrag
                </label>
              </div>
              <div>
                <input
                  className={style.radiobutton}
                  type="radio"
                  id="Keines davon"
                  name="Steuer"
                  value="Keines davon"
                  onChange={() => handleChangeSteuer("Keines davon")}
                  checked={
                    Personendaten["Steuer"].selectedValue === "Keines davon"
                  }
                ></input>
                <label htmlFor="Keines davon">Keines davon</label>
              </div>
            </div>
          </div>
          <div className={style.section}>
            <h2>Daten der PV-Anlage</h2>
            {Object.keys(PVDaten).map((key) => {
              return (
                <DataField
                  name={key}
                  type={PVDaten[key].type}
                  key={PVDaten[key].key}
                  value={PVDaten[key].content}
                  onChange={handleChangePvData()}
                  required={PVDaten[key].required}
                  maxlength={PVDaten[key].maxlength}
                ></DataField>
              );
            })}

            <div className={style.question}>Spannung der Anlage:</div>
            <div className={style.inputbox} id={style.spannung}>
              <div>
                <input
                  className={style.radiobutton}
                  type="radio"
                  id="Monofase"
                  name="Spannung"
                  value="Monofase"
                  onChange={() => handleChangeSpannungRadioButton("Monofase")}
                  checked={
                    PVDaten["Spannung der Anlage"].selectedValue === "Monofase"
                  }
                ></input>
                <label htmlFor="Monofase">Monofase 230 [V]</label>
              </div>
              <div>
                <input
                  className={style.radiobutton}
                  type="radio"
                  id="Trifase"
                  name="Spannung"
                  value="Trifase"
                  onChange={() => handleChangeSpannungRadioButton("Trifase")}
                  checked={
                    PVDaten["Spannung der Anlage"].selectedValue === "Trifase"
                  }
                ></input>
                <label htmlFor="Trifase">Trifase 400 [V]</label>
              </div>
            </div>

            <div className={style.question}>Wird ein Speicher installiert?</div>
            <div className={style.inputbox}>
              <input
                className={style.radiobutton}
                type="radio"
                id="Ja"
                name="Speicher"
                value="Ja"
                onChange={() => handleChangeSpeicherRadioButton("Ja")}
                checked={PVDaten["Speicher"].selectedValue === "Ja"}
              ></input>
              <label htmlFor="Ja">Ja, mit:</label>{" "}
              <div className={style.radiodescription}>
                • Speicherkapazität[kWh]{" "}
                <input
                  type="number"
                  value={PVDaten["Speicher"].content}
                  onChange={handleChangeSpeicherContent()}
                  className={style.inputfield}
                ></input>
              </div>
              <div className={style.radiodescription}>
                • Gesamtleistung[kW]{" "}
                <input
                  type="number"
                  value={PVDaten["Speicher"].leistung}
                  onChange={handleChangeSpeicherLeistung()}
                  className={style.inputfield}
                ></input>
              </div>
            </div>
            <div className={style.inputbox}>
              <input
                type="radio"
                id="Nein"
                name="Speicher"
                value="Nein"
                onChange={() => handleChangeSpeicherRadioButton("Nein")}
                checked={PVDaten["Speicher"].selectedValue === "Nein"}
                className={style.radiobutton}
              ></input>
              <label htmlFor="Nein">Nein</label>
            </div>
          </div>
          <div className={style.section}>
            <h2>Örtliche Angaben zur PV-Anlage</h2>
            {Object.keys(PVAdresse).map((key) => {
              return (
                <DataField
                  name={key}
                  type={PVAdresse[key].type}
                  key={PVAdresse[key].key}
                  value={PVAdresse[key].content}
                  onChange={handleChangePvAdress()}
                  required={PVAdresse[key].required}
                  maxlength={PVAdresse[key].maxlength}
                ></DataField>
              );
            })}
          </div>
          <div className={style.section}>
            <h2>Technische Angaben zur PV-Anlage</h2>
            <h3 id={style.exception}>Modul</h3>
            {Object.keys(Modul).map((key) => {
              return (
                <TechnikField
                  name={key}
                  type={Modul[key].type}
                  key={Modul[key].key}
                  value={Modul[key].content}
                  onChange={handleChangeModul()}
                  required={Modul[key].required}
                  maxlength={Modul[key].maxlength}
                ></TechnikField>
              );
            })}
            <h3>Übergabeschutzgerät (SPI)</h3>
            {Object.keys(Spi).map((key) => {
              return (
                <TechnikField
                  name={key}
                  type={Spi[key].type}
                  key={Spi[key].key}
                  value={Spi[key].content}
                  onChange={handleChangeSpi()}
                  required={Spi[key].required}
                  maxlength={Spi[key].maxlength}
                ></TechnikField>
              );
            })}
            <h3>Inverter</h3>
            {Object.keys(Inverter).map((key) => {
              return (
                <TechnikField
                  name={key}
                  type={Inverter[key].type}
                  key={Inverter[key].key}
                  value={Inverter[key].content}
                  onChange={handleChangeInverter()}
                  required={Inverter[key].required}
                  maxlength={Inverter[key].maxlength}
                ></TechnikField>
              );
            })}
            <h3>Speicher</h3>
            {Object.keys(Speicher).map((key) => {
              return (
                <TechnikField
                  name={key}
                  type={Speicher[key].type}
                  key={Speicher[key].key}
                  value={Speicher[key].content}
                  onChange={handleChangeSpeicher()}
                  required={Speicher[key].required}
                  maxlength={Speicher[key].maxlength}
                ></TechnikField>
              );
            })}
          </div>
          <div className={style.section}>
            <h2>Techniker der PV-Anlage (gesetzlicher Vertreter)</h2>
            {Object.keys(PersonendatenEl).map((key) => {
              return (
                <DataField
                  name={key}
                  type={PersonendatenEl[key].type}
                  key={PersonendatenEl[key].key}
                  value={PersonendatenEl[key].content}
                  onChange={handleChangeEl()}
                ></DataField>
              );
            })}
          </div>

          <div className={style.section}></div>
          <button
            className={style.submitbutton}
            type="submit"
            disabled={isButtonenabled}
          >
            {"Daten abschicken"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default App;
