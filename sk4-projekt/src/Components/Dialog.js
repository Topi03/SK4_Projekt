import React from "react";
import { Container } from "./Container";

export const Dialog = (props) => {
  return (
    <div
      style={{
        backgroundColor: "rgba(100,100,100,0.4)",
        position: "fixed",
        left: "0px",
        top: "0px",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          top: "30%",
          height: "fit-content",
        }}
      >
        <Container title={props.title}>{props.children}</Container>
      </div>
    </div>
  );
};
