import React, { useEffect, useRef, useState } from "react";

import "./App.css";
import { BilderFileStructure } from "./Components/BilderFileStructure";
import { Container } from "./Components/Container";
import { Headline } from "./Components/Headline";
import { Türlog } from "./Components/TürLog";

const ServerIP = "192.168.178.157";
const IPS = {
  websocket: ServerIP + ":3001",
  picture: "http://" + ServerIP + ":3002",
};
const App = (props) => {
  const ws = useRef(new WebSocket("ws://" + IPS.websocket));
  const [doorlog, setDoorlog] = useState(undefined);
  const [PictureFileStructure, setPictureFileStructure] = useState(undefined);
  const [pictureUrl, setPictureUrl] = useState("");
  const [error, setError] = useState(undefined);
  useEffect(() => {
    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({ type: "request-doorlog" }));
      ws.current.send(
        JSON.stringify({ type: "request-picture-file-structure" })
      );
      ws.current.onmessage = (Pack) => {
        const pack = JSON.parse(Pack.data);
        if (pack.type === "doorlog") {
          setDoorlog(pack.data);
        } else if (pack.type === "picture-file-structure") {
          setPictureFileStructure(pack.data);
        }
      };
    };
    ws.current.onerror = () => {
      setError("no Connection to Websocket");
    };
  }, []);
  if (error !== undefined) return error;
  let P = null;

  if (pictureUrl === "") P = "Bild auswählen";
  else {
    P = <img src={pictureUrl} alt={pictureUrl} width={300} height={200} />;
  }

  return (
    <div className="App">
      <div className="headline">
        <Headline />
      </div>
      <div className="door">
        <Türlog doorlog={doorlog} />
      </div>
      <div className="picStruct">
        <BilderFileStructure
          PictureFileStructure={PictureFileStructure}
          setPictureUrl={setPictureUrl}
          IPS={IPS}
          send={ws.current.send}
        />
      </div>
      <div className="pic">
        <Container title="Bild">{P}</Container>
      </div>
    </div>
  );
};

export default App;
