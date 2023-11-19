import { Item, CheckList } from "./check-list";

export default {
  title: "List/CheckList",
  component: CheckList,
};

const checked: string[] = [];

export const Simple = {
  args: {
    items: ["asdf", "qwer", "zxcv", "qaz", "wsx", "edc"],
    checked,
    onToggle: undefined,
  },
};

type CustomItem = Item & {
  path: string;
};

const items: CustomItem[] = [
  {
    label: "First",
    value: "first",
    path: "/first",
  },
  {
    label: "Second",
    value: "second",
    path: "/second",
  },
  {
    label: "Third",
    value: "third",
    path: "/third",
  },
];

export const CustomItems = {
  args: {
    items: items,
    checked,
    onToggle: undefined,
  },
};
