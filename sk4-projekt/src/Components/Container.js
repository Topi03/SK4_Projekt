import React from "react";

export const Container = (props) => {
  return (
    <div
      style={{
        border: "thin solid black",
        backgroundColor: "gray",
        margin: "10px",
        padding: "10px",
        borderRadius: "20px",
      }}
    >
      <div style={{ borderBottom: "thin solid black", padding: "0px" }}>
        {props.title}
      </div>
      <div style={{}} >{props.children}</div>
    </div>
  );
};
