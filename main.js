const Doorhandler = require("./DoorHandler");
const express = require("express");
const PiCamera = require("pi-camera");
const readline = require("readline");
const app = express();
const website = express();
const rd = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const months = [
  "Januar",
  "Februar",
  "Maerz",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];
app.use(express.static(__dirname + "/fotos"));
app.listen(3002);
app.use(express.static(__dirname + "/build"));
app.listen(3000);

function KatzenWache() {
  const fs = require("fs");

  //
  // Laden der Einstellungen
  //

  let optionen = {
    Kamera: {
      width: 640,
      height: 480,
    },
    Tür: {
      maxLog: 10,
    },
  };
  if (fs.existsSync(__dirname + "/optionen.txt")) {
    optionen = JSON.parse(fs.readFileSync(__dirname + "/optionen.txt"));
  }
  const DH = new Doorhandler(optionen.Tür.maxLog);

  //
  // websocket
  //

  console.log("Starting Websocket");

  let wss = new (require("ws").Server)({ ip: "192.168.68.129", port: 3001 });
  this.Connections = [];
  wss.on("connection", (ws) => {
    const index = this.Connections.length;
    this.Connections.push(ws);
    ws.on("close", () => {
      this.Connections.splice(index, 1);
    });
    ws.on("error", () => {
      this.Connections.splice(index, 1);
    });
    ws.on("message", (Package) => {
      const package = JSON.parse(Package);

      if (package.type === "request-doorlog") {
        ws.send(JSON.stringify({ type: "doorlog", data: DH.getLog() }));
      } else if (package.type === "request-picture-file-structure") {
        ws.send(
          JSON.stringify({
            type: "picture-file-structure",
            data: this.getPictureFilesStructure(),
          })
        );
      }
    });
  });

  console.log("Started Websocket");

  //
  // Doorhandler für die Tür
  //

  console.log("Starting Doorhandler");

  const Gpio = require("onoff").Gpio;
  /**
   * wenn 0 Offen
   * sonst Geschlossen
   */
  const d2 = new Gpio(14, "in", "rising");

  d2.watch((err, value) => {
    if (err) return;
    DH.addLog(value);
  });

  // Api für die anfrage der Tür öffnungen
  // website.get("/api/door=:page", (req, res) => {
  //   res.json({ open: DH.getLog()[0], log: DH.getLog(req.params.page) });
  // });

  console.log("Started Doorhandler");

  //
  // Kamera
  //

  console.log("Starting Camera");

  const myCamera = new PiCamera({
    mode: "photo",
    output: `${__dirname}/fotos/test.jpg`,
    width: optionen.Kamera.width,
    height: optionen.Kamera.height,
    nopreview: true,
    quality: 20,
  });

  // bei Tür öffnung ein Foto machen
  DH.doFoto(() => {
    const fotoPath = () => {
      const time = new Date();
      let path = __dirname + "/fotos/";
      if (!fs.existsSync(path + time.getFullYear())) {
        fs.mkdirSync(path + time.getFullYear());
      }
      path += time.getFullYear() + "/";
      if (!fs.existsSync(path + months[time.getMonth()])) {
        fs.mkdirSync(path + months[time.getMonth()]);
      }
      path += months[time.getMonth()] + "/";
      if (!fs.existsSync(path + time.getDate())) {
        fs.mkdirSync(path + time.getDate());
      }
      path += time.getDate() + "/";
      return (
        path +
        time.getHours() +
        "_" +
        time.getMinutes() +
        "_" +
        time.getSeconds() +
        ".jpg"
      );
    };

    myCamera.set("output", fotoPath());
    myCamera.snap().catch((error) => {
      console.error("Fehler beim Fotografieren " + error);
    });
  });

  console.log("Started Camera");

  //
  // API für die Fotos und Datei Struktur
  //
  this.getPictureFilesStructure = () => {
    const years = fs.readdirSync(__dirname + "/fotos/");
    const file = years.map((y) => {
      const months = fs.readdirSync(__dirname + "/fotos/" + y);
      return {
        year: y,
        months: months.map((m) => {
          const days = fs.readdirSync(__dirname + "/fotos/" + y + "/" + m);
          return {
            month: m,
            days: days.map((d) => {
              const files = fs.readdirSync(
                __dirname + "/fotos/" + y + "/" + m + "/" + d
              );
              return { day: d, files: files };
            }),
          };
        }),
      };
    });
    return file;
  };

  /** Die Auflösung der Kamera ändern */
  this.setRes = (xvalue, yvalue) => {
    myCamera.set("height", yvalue);
    optionen.Kamera.width = xvalue;
    myCamera.set("width", xvalue);
    optionen.Kamera.height = yvalue;
  };

  /** alles für ein beenden des Programmes vorbereiten */
  this.close = () => {
    fs.writeFileSync(
      __dirname + "/optionen.txt",
      JSON.stringify(optionen, null, "\t")
    );
    DH.save();
  };
}
const kW = new KatzenWache();

rd.on("line", (line) => {
  let cmd = line.split(" ");
  if (cmd[0] === "setRes") {
    if (cmd[1] === "high") kW.setRes(1920, 1080);
    else if (cmd[1] === "mid") kW.setRes(640, 480);
    else if (cmd[1] === "low") kW.setRes(160, 90);
  } else if (cmd[0] === "close") {
    kW.close();
    process.exit(0);
  }
});
