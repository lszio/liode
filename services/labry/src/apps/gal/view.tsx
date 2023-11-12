import { useEffect, useState } from "react";
import { css } from "@emotion/css";
import styled from "@emotion/styled";
import type { FlatItem, SourceItem } from "./protocol";
import type { Params } from "./utils";

const url = "/apis/gal";

// export interface SourceItemProps {
//   name: string;
// }

// export function SourceItem(props: SourceItemProps) {
//   return <div>Source: {props.name}</div>;
// }

export interface SourceListProps {
  sources: FlatItem<SourceItem>[];
  params: Params;
}

const StyledSourceItem = styled("div")`
  &.toggled {
    color: red;
  }
`;

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

export function Gal(props: ListAppProps) {
  const [sources, setSources] = useState<FlatItem<SourceItem>[]>([]);
  const [groups, setGroups] = useState<FlatItem[]>([]);
  const [params, setParams] = useState<Params>({
    source: [],
    group: [],
  });

  const toggleSource = (source: string) => {
    if (params.source?.includes(source))
      setParams({
        ...params,
        source: params.source.filter((s) => s !== source),
      });
    else
      setParams({
        ...params,
        source: [...params.source, source],
      });
  };

  // const toggleParams = (section: string, value: string) => {
  //   const ps = params[section];
  //   const index = ps.indexOf(value);
  //   if (index !== -1) {
  //     ps.splice(index, 1);
  //   } else {
  //     ps.push(value);
  //   }
  //   setParams({
  //     ...params,
  //     [section]: ps,
  //   });
  // };

  useEffect(() => {
    fetch(url + "?refresh=true&source=meta&group=sources").then((res) => {
      res.json().then((items: FlatItem<SourceItem>[]) => {
        setSources(items);
      });
    });
  }, []);

  useEffect(() => {
    fetch(url + "?refresh=true&source=@groups&group=local&group=sync").then(
      (res) => {
        res.json().then((items: FlatItem<SourceItem>[]) => {
          console.log(items);
          setGroups(items);
        });
      }
    );
  }, [sources]);

  return (
    <div className={style}>
      <div>
        {/* {sources.filter(s => params.source.includes(s.name)).map(s => {
          return (<div>picked {s.name}</div>)
        })} */}
        {sources.map((s) => {
          const source = props.params.source ?? [];
          const picked = source.includes(s.name);

          return (
            <StyledSourceItem
              className={"" + (picked ? "picked " : "")}
              key={s.name}
              onClick={() => {
                console.log(picked, params);
                toggleSource(s.name);
                setSources(sources);
              }}
            >
              {s.name}
            </StyledSourceItem>
          );
        })}
      </div>
    </div>
  );
}

export default Gal;
