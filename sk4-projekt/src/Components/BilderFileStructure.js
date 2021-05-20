import { Container } from "./Container";
import React, { useState } from "react";
import trashIcon from "./trashbin.png";
import downloadIcon from "./download.png";
import "./List.css";
import { Dialog } from "./Dialog";

const DialogYesNo = (props) => {
  return (
    <Dialog title={props.title}>
      <div>{props.children}</div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <button
          onClick={() => {
            props.yes && props.yes();
            props.close();
          }}
        >
          JA
        </button>
        <button
          onClick={() => {
            props.no && props.no();
            props.close();
          }}
        >
          NEIN
        </button>
      </div>
    </Dialog>
  );
};

const FilesList = (props) => {
  return (
    <ul className="listYear">
      {props.l.map((y) => (
        <Year key={y.year} y={y} {...props} />
      ))}
    </ul>
  );
};
const Year = (props) => {
  const [v, sv] = useState(true);
  return (
    <li key={props.y.year} className="listItem level1">
      <div onClick={() => sv(!v)}>{props.y.year}</div>
      {v ? (
        <ul>
          {props.y.months.map((m) => (
            <Month key={m.month} m={m} {...props} />
          ))}
        </ul>
      ) : null}
    </li>
  );
};
const Month = (props) => {
  const [v, sv] = useState(true);
  return (
    <li key={props.m.month} className="listItem level2">
      <div onClick={() => sv(!v)}>{props.m.month}</div>
      {v ? (
        <ul>
          {props.m.days.map((d) => (
            <Day key={d.day} d={d} {...props} />
          ))}
        </ul>
      ) : null}
    </li>
  );
};
const Day = (props) => {
  const [v, sv] = useState(true);
  const [o, sO] = useState(true);
  return (
    <li key={props.d.day} className="listItem level3">
      <div onClick={() => sv(!v)}>{props.d.day}</div>
      {v ? (
        <ul>
          {props.d.files.map((f) => {
            const picName =
              props.y.year + "/" + props.m.month + "/" + props.d.day + "/" + f;
            const picURL = props.IPS.picture + "/" + picName;
            return (
              <li key={f}>
                <button onClick={() => props.set(picURL)}>{f}</button>
                {o !== undefined ? o : null}
                <button
                  className="options"
                  onClick={() => {
                    sO(
                      <DialogYesNo
                        title="löschen"
                        close={() => sO(undefined)}
                        yes={() =>
                          props.send(
                            JSON.stringify({
                              type: "delete-picture",
                              data: { picName },
                            })
                          )
                        }
                      >
                        sind sie sicher ?
                      </DialogYesNo>
                    );
                  }}
                >
                  <img src={trashIcon} width={20} height={20} />
                </button>
                <button className="options">
                  <img src={downloadIcon} width={20} height={20} />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </li>
  );
};

export const BilderFileStructure = (props) => {
  if (props.PictureFileStructure === undefined)
    return <Container title="Bilder">Loading</Container>;
  return (
    <Container title="Bilder">
      <FilesList
        l={props.PictureFileStructure}
        send={props.send}
        set={props.setPictureUrl}
        IPS={props.IPS}
      />
    </Container>
  );
};
