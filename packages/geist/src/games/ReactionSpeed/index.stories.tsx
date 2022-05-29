import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import styled from "styled-components";

import { ReactionSpeed } from './index';

export default {
  title: 'Geist/ReactionSpeed',
  component: ReactionSpeed,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof ReactionSpeed>;

const Container = styled.div`
  width: 200px;
  height: 200px;
`

const Template: ComponentStory<typeof ReactionSpeed> = (args) => (<Container><ReactionSpeed {...args} /></Container>)

export const  Default = Template.bind({});
Default.args = {
  size: {
    name: 'Jane Doe',
  },
};
