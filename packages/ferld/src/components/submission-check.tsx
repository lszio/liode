import { useState, useEffect } from "react";
import { css } from "@emotion/css";
import styled from "@emotion/styled";

interface StackItem {
  name: string;
  time: Date;
}

function defaultPromot() {
  return localStorage.getItem("submission-check-promot") || "";
}

export default function SubmissionCheck() {
  const [users, setUsers] = useState<string[]>([]);
  const [stack, setStack] = useState<StackItem[]>([]);
  const [todo,setTodo] = useState(defaultPromot());
  const [done, setDone] = useState("")
  const [current, setCurrent] = useState<number>(-1);
  const [submitted, setSubmitted] = useState<string[]>([]);

  const undo = () => {
    const action = stack[current];
    if (action) {
      setCurrent(current - 1);
      toggle(action.name, false);
    } else {
      console.warn("nothing to undo");
    }
  };
  const redo = () => {
    const action = stack[current + 1];
    if (action) {
      setCurrent(current + 1);
      toggle(action.name, false);
    } else {
      console.warn("nothing to redo");
    }
  };

  useEffect(() => {
    setStack([]);
    setCurrent(-1);
    setSubmitted(done.split("\n").filter(n => users.includes(n)));
    setUsers(Array.from(new Set(todo.split(/[.,;\n]/).filter((n) => n))));
  }, [todo, done]);

  const toggle = (name: string, record = true) => {
    if (submitted.includes(name)) {
      setSubmitted([...submitted.filter((n) => n !== name)]);
    } else {
      setSubmitted([...submitted, name]);
    }

    if (record) {
      setCurrent(current + 1);
      setStack([...stack.slice(0, current + 1), { name, time: new Date() }]);
    }
  };

  return (
    <>
      <Banner>PROMOT</Banner>
      <textarea
        style={{
          width: "100%",
          minHeight: "3rem",
          resize: "vertical",
        }}
        value={todo}
        onChange={(e) => {
          setTodo(e.target.value);
          localStorage.setItem("submission-check-promot", e.target.value);
        }}
      />
      <textarea
        style={{
          width: "100%",
          minHeight: "3rem",
          resize: "vertical"
        }}
        value={done}
        onChange={e => {
          setDone(e.target.value);
        }}
      />

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          style={{ margin: "6px", padding: "3px" }}
          onClick={() => setSubmitted([...users])}
        >
          ALL
        </button>
        <button
          style={{ margin: "6px", padding: "3px" }}
          onClick={() => undo()}
        >
          UNDO
        </button>
        <button
          style={{ margin: "6px", padding: "3px" }}
          onClick={() => redo()}
        >
          REDO
        </button>
        <button
          style={{ margin: "6px", padding: "3px" }}
          onClick={() => setSubmitted([])}
        >
          NONE
        </button>
      </div>

      <Banner>SUBMITTED</Banner>
      <form
        className={css`
          display: flex;
          flex-flow: row wrap;
        `}
      >
        {submitted.map((name) =>
          UserCheckbox({ name, submitted: true, onChange: toggle })
        )}
        <Banner>UNSUBMITTED</Banner>
        {users
          .filter((name) => !submitted.includes(name))
          .map((name) =>
            UserCheckbox({ name, submitted: false, onChange: toggle })
          )}
      </form>
    </>
  );
}
const Banner = styled.div`
  width: 100%;
  text-align: center;
  color: ${(props) => props.color ?? "black"};
`;

const UserCheckboxContainer = styled.div<{ theme: { primary: string } }>`
  border: 1px solid black;
  // border-color: ${(props) => props.theme.primary ?? "black"};
  border-radius: 3px;
  min-width: 5rem;
  padding: 3px;
  margin: 6px;
  &:hover {
    color: ${(props) => props.theme.primary ?? "transparent"};
  }
`;

function UserCheckbox(props: {
  name: string;
  submitted: boolean;
  onChange: (name: string) => void;
}) {
  const { name, submitted, onChange } = props;
  return (
    <UserCheckboxContainer
      key={name}
      theme={{ primary: submitted ? "turquoise" : "hotpink" }}
      onClick={(e) => {
        e.preventDefault();
        onChange(name);
      }}
    >
      <input
        id={name}
        value={name}
        type="checkbox"
        checked={submitted}
        style={{ cursor: "pointer" }}
        onChange={(e) => {
          e.preventDefault();
          onChange(name);
        }}
      />
      <label style={{ cursor: "pointer" }} htmlFor={name}>
        {name}
      </label>
    </UserCheckboxContainer>
  );
}
