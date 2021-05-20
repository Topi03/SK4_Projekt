import { Container } from "./Container";
import React from "react";

export const Türlog = ({ doorlog }) => {
  const TimeToString = (time) => {
    const date = new Date(time);
    return date.toLocaleDateString() + " um " + date.toLocaleTimeString();
  };
  if (doorlog === undefined)
    return <Container title="Türlog">Loading</Container>;
  return (
    <Container title="TürLog">
      <div>zuletzt:{TimeToString(doorlog[0].date)}</div>
      <ul>
        {doorlog.map((dl) => {
          return <li key={dl.date}>geöffnet am :{TimeToString(dl.date)}</li>;
        })}
      </ul>
    </Container>
  );
};
