import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import styled from "styled-components";

import { ColoredConfusion } from "./index";

export default {
  title: "Geist/ColoredConfusion",
  component: ColoredConfusion,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof ColoredConfusion>;

const Container = styled.div`
  width: 200px;
  height: 200px;
`;

const Template: ComponentStory<typeof ColoredConfusion> = (args) => (
  <Container>
    <ColoredConfusion {...args} />
  </Container>
);

export const Default = Template.bind({});
Default.args = {
  size: {
    name: "Jane Doe",
  },
};
