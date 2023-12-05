import styled from "@emotion/styled";
import autoAnimate from "@formkit/auto-animate";
import { ReactNode, useEffect, useRef, useState, MouseEvent } from "react";

export type Item =
  | string
  | {
      key?: string;
      label?: string;
      value: string;
    };

export interface CheckListItemProps<T extends Item> {
  key: string;
  value: T;
  label: string;
  checked: boolean;
  onClick: (e: MouseEvent) => void;
  children: ReactNode[];
}

const Li = styled("li")``;

export function CheckListItem<T extends Item>(props: CheckListItemProps<T>) {
  return (
    <Li
      key={props.key}
      onClick={props.onClick}
      data-testid="check-list-item"
      className={`check-list-item ${props.checked ? "checked" : "unchecked"}`}
    >
      {...props.children}
    </Li>
  );
}

export interface CheckListProps<T extends Item> {
  items: T[];
  checked?: string[];
  getKey?(item: T, idx?: number): string;
  getLabel?(item: T): string;
  onToggle?(item: T, state?: boolean): void;
  renderItem?(item: T): ReactNode;
}

function defaultKey<T extends Item>(item: T) {
  return typeof item === "string" ? item : item.key || item.value;
}

function defaultLabel<T extends Item>(item: T) {
  return typeof item === "string" ? item : item.label || item.key || item.value;
}

const Ul = styled("ul")`
  display: flex;
  flex-flow: row wrap;

  .checked {
    color: #1661ab;
  }

  .unchecked {
    color: #bf3553;
  }

  li {
    cursor: pointer;
    user-select: none;
    list-style-type: none;
    padding: 0.2rem 0.5rem;
    margin: 0.2rem 0.2rem;
    border-radius: 0.5rem;
    background-color: #efefef;

    &:hover {
      background-color: #eee;
    }
  }
`;

export function CheckList<T extends Item>({
  items,
  checked,
  onToggle,
  getKey = defaultKey<T>,
  getLabel = defaultLabel<T>,
  renderItem = (i: T) => defaultLabel(i),
}: CheckListProps<T>) {
  const [checkedItems, setCheckedItems] = useState<T[]>([]);
  const [uncheckedItems, setUnCheckedItems] = useState<T[]>([]);
  const parent = useRef(null);

  const doToggle = onToggle
    ? onToggle
    : (item: T) => {
        const key = getKey(item);
        if (checkedItems.find((i) => getKey(i) === key)) {
          setUnCheckedItems([item, ...uncheckedItems]);
          setCheckedItems([...checkedItems.filter((i) => getKey(i) !== key)]);
        } else {
          setCheckedItems([...checkedItems, item]);
          setUnCheckedItems([
            ...uncheckedItems.filter((i) => getKey(i) !== key),
          ]);
        }
      };

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, []);

  useEffect(() => {
    if (checked) {
      setCheckedItems(items.filter((i) => checked.includes(getKey(i))));
      setUnCheckedItems(items.filter((i) => !checked.includes(getKey(i))));
    } else {
      setUnCheckedItems(items);
    }
  }, [items, checked, getKey]);

  const toItem = (item: T, state: boolean): CheckListItemProps<T> => ({
    key: getKey(item),
    value: item,
    label: getLabel(item),
    checked: state,
    children: [renderItem(item)],
    onClick: (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      doToggle(item);
    },
  });

  return (
    <Ul ref={parent} data-testid="check-list">
      {[
        checkedItems.map((i) => toItem(i, true)),
        uncheckedItems.map((i) => toItem(i, false)),
      ]
        .flatMap((p) => p)
        .map(CheckListItem)}
    </Ul>
  );
}
