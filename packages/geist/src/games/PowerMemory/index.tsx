import styled, { css, keyframes } from "styled-components";

enum State {
  Open,
  Close,
  Right,
  Wrong,
}

interface BoxData {
  key: number;
  x: number;
  y: number;
  value: string;
  state: State;
}

const flip = keyframes`
  from {
    transform: rotateY(0deg);
  }

  to {
    transform: rotateY(180deg);
  }
`;

const Box = styled.div`
  display: block;
  width: 100%;
  height: 100%;
  background-color: white;

  &:hover {
    background-color: green;
    animation: ${flip} 0.5s linear;
  }

  ${(props) =>
    props.open &&
    css`
      background: red;
    `}
`;

const Board = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  padding: 0.5rem;
  grid-row-gap: 0.5rem;
  grid-column-gap: 0.5rem;
  background-color: #efefef;
  grid-template-columns: repeat(${(props) => props.rows || 4}, 1fr);
`;

const generateBoxes = (rows, cols) => {
  const boxes = [];
  let id = 0;
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      boxes.push({ key: id++, x, y, state: State.Open });
    }
  }
  return boxes;
};

const Prompt = () => {
  return <div>Prompt</div>;
};

export function PowerMemory({
  rows = 4,
  cols = 4,
  level = 1,
  mode = "simple",
}) {
  const boxes = generateBoxes(rows, cols);
  const answers = [];

  const clickBox = (box) => {
    console.log("click box ", box);
  };

  return (
    <div>
      <Prompt />
      <Board rows={rows}>
        {boxes.map((box) => (
          <Box {...box} onClick={() => clickBox(box)} />
        ))}
      </Board>
    </div>
  );
}
