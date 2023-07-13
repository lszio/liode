import { useState, useEffect } from "react";
// import classNames from "classnames";
import { css } from "@emotion/css";
import styled from "@emotion/styled";

export default function SubmissionCheck() {
  const [promot, setPromot] = useState(
    localStorage.getItem("submission-check-promot") || ""
  );
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    setUsers(Array.from(new Set(promot.split(/[.,;\n]/).filter((n) => n))));
  }, [promot]);

  const [submission, setSubmission] = useState<Record<string, boolean>>({});

  const onChange = (name: string) => {
    setSubmission({ ...submission, [name]: !submission[name] });
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
        value={promot}
        onChange={(e) => {
          setPromot(e.target.value);
          localStorage.setItem("submission-check-promot", e.target.value);
        }}
      />

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          style={{ margin: "6px", padding: "3px" }}
          onClick={() =>
            setSubmission(
              users.reduce<Record<string, boolean>>((acc, name) => {
                acc[name] = true;
                return acc;
              }, {})
            )
          }
        >
          ALL
        </button>
        <button
          style={{ margin: "6px", padding: "3px" }}
          onClick={() => setSubmission({})}
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
        {users
          .filter((name) => submission[name])
          .map((name) => UserCheckbox({ name, submitted: true, onChange }))}
        <Banner>UNSUBMITTED</Banner>
        {users
          .filter((name) => !submission[name])
          .map((name) => UserCheckbox({ name, submitted: false, onChange }))}
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
