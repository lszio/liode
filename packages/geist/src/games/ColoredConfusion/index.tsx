import styled, { css, keyframes } from "styled-components";
import { useState } from "react";

enum Color {
  Red = "red",
  Blue = "blue",
  Green = "green",
  Yellow = "yellow",
  Orange = "orange",
  Pink = "pink",
  Purple = "purple",
}

interface Confusion {}

const Button = styled.button``;

const shuffle = (list: number[]) => {
  const length = list.length;
  for (let i = length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
};

const Promot = ({ answer }) => {
  return (
    <div>
      <Button onClick={() => answer(false)}>No</Button>
      <Button onClick={() => answer(true)}>Yes</Button>
    </div>
  );
};

const WithColor = styled.div`
  color: ${(props) => props.color};
`;

const Card = ({ data }) => {
  return <WithColor color={Color[data.actual]}>{data.show}</WithColor>;
};

const generateData = () => {
  const [actual] = shuffle(Object.keys(Color));
  const [show] = shuffle(Object.keys(Color));
  return {
    actual,
    show,
  };
};

export function ColoredConfusion({ mode = "simple" }) {
  const [data, setData] = useState(generateData());
  const answer = (matchp) => {
    if (matchp === (data.actual === data.show)) {
      console.log("Correct");
    } else {
      console.log("Wrong");
    }
    setData(generateData());
  };

  return (
    <div>
      <Card data={data} />
      <Promot answer={answer} />
    </div>
  );
}
