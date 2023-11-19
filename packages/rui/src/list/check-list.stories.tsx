import { Item, CheckList } from "./check-list";
import { userEvent, within } from "@storybook/testing-library"
import { Meta, StoryObj} from "@storybook/react"

export default {
  title: "List/CheckList",
  component: CheckList,
} satisfies Meta<typeof CheckList>;

type Story = StoryObj<typeof CheckList>;

const checked: string[] = [];

export const Simple: Story = {
  args: {
    items: ["asdf", "qwer", "zxcv", "qaz", "wsx", "edc"],
    checked,
    onToggle: undefined,
  },
};

interface CustomItem extends Exclude<Item, string> {
  path: string;
}

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

export const CustomItems: Story = {
  args: {
    items: items,
    checked,
    onToggle: undefined,
    renderItem(i: CustomItem) {
      return <div>[{ i.value }] : {i.path}</div>
    }
  },
  play: async (props) => {
    const canvas = within(props.canvasElement)

    const items = canvas.getAllByTestId("check-list-item")

    for (const item of items) {
      await userEvent.click(item)
    }
  }
};
