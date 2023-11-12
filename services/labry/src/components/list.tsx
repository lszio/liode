import { type Action } from "../pages/apis/tools/list/action";
import { useMemo, useEffect, useState } from "react";
import { css } from "@emotion/css";
import styled from "@emotion/styled";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";

const url = "/apis/tools/list";

export interface SourceItemProps {
  name: string;
}

export function SourceItem(props: SourceItemProps) {
  return <div>Source: {props.name}</div>;
}

export interface SourceListProps {
  source: string[];
}

const StyledSourceItem = styled("div")`
  &.toggled {
    color: red;
  }
`;

export function SourceList(props: SourceListProps) {
  const { source } = props;
  const [sources, setSources] = useState<string[]>([]);

  useMemo(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setSources(Object.keys(data));
      });
  }, [source]);

  return (
    <div>
      Source
      {sources.map((s) => {
        return (
          <StyledSourceItem
            className={source.includes(s) ? "toggled" : ""}
            key={s}
            onClick={() => {
              console.log(source, s);
              const url = new URL(window.location.href);
              if (source.includes(s)) {
                url.searchParams.delete("source");
                source
                  .filter((n) => n !== s)
                  .forEach((n) => {
                    url.searchParams.append("source", n);
                  });
              } else {
                url.searchParams.append("source", s);
              }

              window.location.href = url;
            }}
          >
            {s}
          </StyledSourceItem>
        );
      })}
    </div>
  );
}

export interface ListAppProps {
  params: {
    source: string[];
    group: string[];
  };
}

const style = css`
  width: 100%;
  height: 100%;
`;

export function ListApp(props: ListAppProps) {
  const [sources, setSources] = useState<string[]>([]);

  const { source, group } = props;

  useEffect(() => {
    fetch(url).then((res) => {
      console.log(
        res.json().then((ss) => {
          setSources(Object.keys(ss));
        })
      );
    });
  }, []);

  return (
    <div className={style}>
      <SourceList
        source={Array.isArray(source) ? source : [source]}
      ></SourceList>
    </div>
  );
}

export default ListApp;
