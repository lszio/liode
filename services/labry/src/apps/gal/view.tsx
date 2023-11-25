import { useEffect, useState } from "react";
import { css } from "@emotion/css";
import type { FlatItem, Item, SourceItem } from "./protocol";
import { CheckList } from "@ferld/rui";

const url = "/apis/gal";

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
  const [items, setItems] = useState<FlatItem[]>([]);
  const [toggled, setToggled] = useState<Record<string, any[]>>({
    sources: [],
    groups: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const sourcesJson: FlatItem<SourceItem>[] = await (
        await fetch(`${url}?refresh=true&source=meta&group=sources`)
      ).json();
      setSources(
        sourcesJson.map((s) => ({ ...s, value: s.name, lable: s.name }))
      );

      const query = sources.map((s) => `source=${s.name}`).join("&");
      const groupsJson: FlatItem[] = await (
        await fetch(`${url}?source=@groups&${query}`)
      ).json();
      setGroups(
        groupsJson.map((g) => ({ ...g, value: g.name, label: g.name }))
      );

      const {source = [], group = []} = props.params;

      setToggled({
        ...toggled,
        ...{
          sources: source.length === 0 ? sources.map((i) => i.value) : [],
          groups: group.length === 0 ? groups.map((i) => i.value) : [],
        },
      });
    };

    fetchData();
  }, [props.params]);

  useEffect(() => {
    const fetchData = async () => {
      const query = [
        ...toggled.groups.map((g) => `group=${g}`),
        ...toggled.sources.map((s) => `source=${s}`),
      ].join("&");
      const response = await fetch(`${url}?${query}`);
      setItems(await response.json());
    };

    fetchData();
  }, [sources, groups, toggled]);

  const doToggle = (type: "groups" | "sources") => (item: any) => {
    const checked = toggled[type];
    const index = checked.findIndex((i) => i === item.value);
    if (index === -1) {
      checked.push(item.value);
    } else {
      checked.splice(index, 1);
    }

    setToggled({
      ...toggled,
      [type]: [...checked],
    });
  };

  const toggleSource = doToggle("sources");
  const toggleGroup = doToggle("groups");

  return (
    <div className={style}>
      <div>
        <CheckList
          items={sources}
          checked={toggled.sources}
          onToggle={toggleSource}
          renderItem={(s: any) => (
            <div>
              {s.name}
              <CheckList
                items={groups.filter((g) => g.group === s.name)}
                checked={toggled.groups}
                onToggle={toggleGroup}
              />
            </div>
          )}
        />
      </div>
      <div>
        {items.map((item) => (
          <div key={item.name}>{item.name}</div>
        ))}
      </div>
    </div>
  );
}

export default Gal;
