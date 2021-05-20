import React, { useEffect, useRef, useState } from "react";
export const Headline = () => {
  return (
    <div
      style={{
        position: "relativ",
        display: "flex",
        flexDirection: "row",
        height: "130px",
      }}
    >
      <h2>SK4 KatzenWache</h2>
      <div style={{ position: "absolute", right: "20px" }}>
        <table>
          <tbody>
            <tr>
              <td>Auflösung</td>
              <td>
                <input placeholder={"1920x1080"}></input>
              </td>
            </tr>
            <tr>
              <td>Auslösezeit</td>

              <td>
                <input placeholder={"0s"}></input>
              </td>
            </tr>
            <tr>
              <td>Foto/Video</td>

              <td>
                <input type="checkbox"></input>
              </td>
            </tr>
            <tr>
              <td>Spamschutz</td>
              <td>
                <input placeholder="0s"></input>
              </td>
            </tr>
            <tr>
              <td>Speicherplatz</td>
              <td>
                <input placeholder="100mb"></input>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
