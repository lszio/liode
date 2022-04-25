import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import styled from "styled-components";

import { PowerMemory } from './index';

export default {
  title: 'Geist/PowerMemory',
  component: PowerMemory,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof PowerMemory>;

const Container = styled.div`
  width: 200px;
  height: 200px;
`

const Template: ComponentStory<typeof PowerMemory> = (args) => (<Container><PowerMemory {...args} /></Container>)

export const  Default = Template.bind({});
Default.args = {
  size: {
    name: 'Jane Doe',
  },
};
